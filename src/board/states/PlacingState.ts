import { BoardController } from "../BoardController";
import { DroppingState } from "./DroppingState";
import { PlacingToken } from "../PlacingToken";
import { Game } from "../Game";

export interface ListenerData {
  type: 'mousemove' | 'click' | 'keydown',
  listener: any
}

export class PlacingState {

  public game: Game;
  public DELAY = 10; // delay in miliseconds of the loop
  public mouseX: number;
  public dmouseX = 0; // difference in mouseX between two frames
  public prevMouseX: number;
  public token!: PlacingToken
  public canvas: HTMLElement;
  public boardImg: HTMLElement;
  public loopId: number | undefined;
  public eventListeners: ListenerData[] = [
    {
      type: 'click',
      listener: (e: MouseEvent) => this.dropToken(-1)
    },
  ]

  constructor(game: Game) {
    this.game = game;
    this.canvas = game.canvas;
    this.boardImg = game.boardImg;
    this.mouseX = game.getMousePos().x;
    this.token = new PlacingToken({x: this.mouseX, y: 50}, this.game.turn);
    this.canvas.append(this.token.sprite)
    this.prevMouseX = this.mouseX;
    this.addEventListeners();
    this.startLoop()
    this.game.timerController.startTimer();
  }

  /**
   * async function - use me
   * @param me
   */
  public loop(me: PlacingState) {
    me.mouseX = me.game.getMousePos().x
    me.dmouseX = (me.mouseX - me.prevMouseX)
    me.prevMouseX = me.mouseX;
    me.token.update(me.mouseX, me.dmouseX);
  }

  public startLoop() {
    this.loopId = setInterval(() => this.loop(this), this.DELAY)
  }

  public stopLoop() {
    clearInterval(this.loopId)
  }

  public addEventListeners() {
    this.eventListeners.forEach((item) => {this.boardImg.addEventListener(item.type, item.listener)})
  }

  public removeEventListeners() {
    this.eventListeners.forEach((item) => {this.boardImg.removeEventListener(item.type, item.listener)})
  }

  public leaveState() {
    this.removeEventListeners();
    this.stopLoop();
    this.token.sprite.remove()
  }

  /**
   * resume state after a pause
   */
  public resumeState() {
    this.canvas.append(this.token.sprite)
    this.prevMouseX = this.mouseX;
    this.addEventListeners();
    this.startLoop()
    this.game.timerController.startTimer();
  }

  /**
   * stop the loop and change the state
   * @param _colNum if specified as -1, then the token will be dropped wherever it is
   * otherwise it will be dropped where it is specified
   */
  public dropToken(_colNum: number):boolean {
    let colNum: number;
    if (_colNum < 0) {
      colNum = Math.floor(this.token.position.x / 100);
    } else {
      colNum = _colNum;
    }
    
    let destRow = this.game.calculateDestRow(colNum);
    if (destRow == -1) {
      console.log('invalid');
      return false;
    }
    this.game.placeToken(colNum, destRow);
    this.game.changeState(new DroppingState(this.game, colNum, destRow));
    return true;
  }

}