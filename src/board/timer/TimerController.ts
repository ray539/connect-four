import { NUMCOLS } from "../../constants";
import { BoardController } from "../BoardController";
import { Game } from "../Game";
import { PlacingState } from "../states/PlacingState";

export class TimerController {
  public sprite = document.querySelector('.timer') as HTMLElement;
  public playerTurn = this.sprite.querySelector('.player-turn') as HTMLElement;
  public playerTurnTimer = this.sprite.querySelector('.player-turn-timer') as HTMLElement;
  public tip = this.sprite.querySelector('.tip') as HTMLElement;

  public TIMERDURATION;
  public MESSAGEDURATION = 1000;
  public timeRemaining: number;
  public game: Game;
  public loopId: number = -1;

  constructor(game: Game, TIMERDURATION: number) {
    this.TIMERDURATION = TIMERDURATION;
    this.timeRemaining = TIMERDURATION;
    this.game = game;
    this.playerTurnTimer.innerText = `${this.timeRemaining}s`;
    if (TIMERDURATION < 0) {
      this.playerTurnTimer.innerText = `--`;
    }
  }

  /**
   * start timing loop
   */
  public startTimer() {
    if (this.loopId != -1) clearInterval(this.loopId);
    this.loopId = setInterval(() => this.decrement(this), 1000);
  }

  /**
   * pause timer without resetting time remaining
   */
  public pauseTimer() {
    if (this.loopId != -1) clearInterval(this.loopId);
  }

  public decrement(me: TimerController) {
    if (me.TIMERDURATION < 0) return;

    me.timeRemaining--;
    this.playerTurnTimer.innerText = `${me.timeRemaining}s`;
    if (me.timeRemaining == 0) {
      if (me.game.state instanceof PlacingState) {
        let timesUp = document.querySelector('.board-wrapper .board-warn') as HTMLElement;
        timesUp.classList.toggle('show', true);
        setTimeout(() => timesUp.classList.toggle('show', false), this.MESSAGEDURATION);

        let res = me.game.state.dropToken(-1);
        while (!res) {
          let randCol = Math.floor(Math.random() * NUMCOLS);
          res = me.game.state.dropToken(randCol);
        }
      }

    }
  }

  /**
   * change colour / appearance of the timer
   * @param turn
   */
  public setTurn(turn: 'R' | 'Y') {
    this.changeColorScheme(turn);
    if (this.TIMERDURATION < 0) return;

    this.timeRemaining = this.TIMERDURATION;
    this.playerTurnTimer.innerText = `${this.timeRemaining}s`;
    
  }

  public changeColorScheme(turn: 'R' | 'Y') {
    switch(turn) {
      case 'R':
        this.sprite.style.backgroundColor = 'var(--red)';
        this.tip.style.color = 'var(--red)';
        this.sprite.style.color = 'white';
        this.playerTurn.innerText = 'PLAYER 1\'S TURN';
        break;
      case 'Y':
        this.sprite.style.backgroundColor = 'var(--yellow)';
        this.tip.style.color = 'var(--yellow)';
        this.sprite.style.color = 'black';
        this.playerTurn.innerText = 'PLAYER 2\'S TURN'
        break;
    }
  }


}