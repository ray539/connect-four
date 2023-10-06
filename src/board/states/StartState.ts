import { BoardController } from "../BoardController";
import { Game } from "../Game";

/**
 * Starting state of every game
 */
export class StartState {
  public sprite: HTMLElement;
  public playButton: HTMLElement;
  public game: Game;

  constructor(game: Game) {
    this.game = game;
    this.sprite = document.createElement('div');
    this.sprite.classList.add('board-alert', 'start-game');
    this.sprite.innerHTML = 
    '<div class="text-box">' +
      '<div class="block1">' +
        'press play button below <br>' +
        'to start new game' +
      '</div>' +
      '<div>' +
        '<button class="button-purple">PLAY</button>' +
      '</div>' +
    '</div>'
    this.sprite.style.display = 'flex';
    this.playButton = this.sprite.querySelector('.button-purple') as HTMLElement;
    this.playButton.addEventListener('click', (e) => this.startGame(this, e));
    this.game.canvas.append(this.sprite);
  }

  public startGame(me: StartState, e: MouseEvent) {
    e.stopPropagation();
    me.game.startNewRound();
    me.sprite.remove();
  }

  public leaveState() {
    this.sprite.remove();
  }

  public resumeState() {
    this.game.canvas.append(this.sprite);
  }





}