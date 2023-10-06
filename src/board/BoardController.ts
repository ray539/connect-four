import { coord } from "./Coord";
import { Game } from "./Game";
import { DroppingState } from "./states/DroppingState";
import { GameOverState } from "./states/GameOverState";
import { PlacingState } from "./states/PlacingState";
import { ListenerData } from './states/PlacingState'
import { StartState } from "./states/StartState";
import { TimerController } from "./timer/TimerController";
import { GameData } from "../constants";
import { UndoController } from "./UndoController";

type State = PlacingState | DroppingState | GameOverState | StartState;

/**
 * in charge of managing where the mouse is at all times
 * in charge of keeping track of what state the board is in
 * in charge of starting / stopping games
 */
export class BoardController {

  public eventListeners: ListenerData[] = [
    {
      type: 'mousemove',
      listener: (e: MouseEvent) => this.updateMousePos(e, this)
    },
  ]

  public currentGame: Game | null;
  public mousePos: coord;
  public sprite = document.querySelector('.board-wrapper') as HTMLElement;
  public boardImg = document.querySelector('.board-img') as HTMLElement;

  public nextGameData: GameData = {
    timerDuration: 30,
    infin: false,
    roundsEachGame: 3,
    allowUndoRedo: false
  }

  public undoController: UndoController | null = null;
  public addUndoController(undoController: UndoController) {
    this.undoController = undoController;
  }

  constructor() {
    this.addEventListeners();
    this.mousePos = {x: 50, y: 0};

    // start a new game on page load
    this.currentGame = null;
    this.startNewGame();
  }

  public startNewGame() {
    this.currentGame?.pause()
    this.currentGame = new Game(this, 'R', 
                       this.nextGameData.timerDuration,
                       this.nextGameData.infin,
                       this.nextGameData.roundsEachGame,
                       this.nextGameData.allowUndoRedo);
  }

  public addEventListeners() {
    this.eventListeners.forEach((item) => {this.boardImg.addEventListener(item.type, item.listener)})
  }

  public removeEventListeners() {
    this.eventListeners.forEach((item) => {this.boardImg.removeEventListener(item.type, item.listener)})
  }

  public updateMousePos(e:MouseEvent, me:BoardController) {
    if (e.offsetY > 650) return;
    me.mousePos = {x: e.offsetX, y: e.offsetY}
  }
}