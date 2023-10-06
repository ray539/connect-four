
import { Game } from "../Game";
import { TimerController } from "../timer/TimerController";


export class GameOverState {
  public sprite: HTMLElement;
  public TIMERDURATION = 5;
  public timer = this.TIMERDURATION;
  public game: Game;
  public button;

  public checkOverallWin(score: number) {
    return score == Math.floor(this.game.ROUNDSEACHGAME / 2) + 1;
  }

  public constructor(game: Game, result: 'R' | 'Y' | 'N', timerController: TimerController) {
    this.game = game;
    this.sprite = document.createElement('div');
    this.sprite.classList.add('board-alert', 'game-over');
    this.sprite.innerHTML =
    '<div class="winner">' +
      'RED WON' +
    '</div>' +
    `<button class="button-purple new-round">NEXT ROUND</button>` +
    '<div class="spacer2"></div>'
    this.sprite.style.display = 'flex';
    let winnerDiv = this.sprite.querySelector('.winner') as HTMLElement
    let overallWin = false;

    switch (result) {
      case 'R':
        this.game.incrementRedScore();
        winnerDiv.innerText = 'RED WON';
        winnerDiv.style.color = 'red';
        if (this.checkOverallWin(this.game.getScore(result))) {
          winnerDiv.innerText = 'OVERALL WINNER: RED';
          overallWin = true;
        }
        break;
      case 'Y':
        this.game.incrementYellowScore();
        winnerDiv.innerText = 'YELLOW WON';
        winnerDiv.style.color = 'rgb(0,0,0)';
        if (this.checkOverallWin(this.game.getScore(result))) {
          winnerDiv.innerText = 'OVERALL WINNER: YELLOW';
          overallWin = true;
        }
        break;
      case 'N':
        winnerDiv.innerText = 'TIE';
        winnerDiv.style.color = 'rgb(133, 5, 238);';
        break;
    }
    this.game.canvas.append(this.sprite);
    this.button = this.sprite.querySelector('.new-round') as HTMLElement;
    if (overallWin) {
      this.button.innerText = 'NEW GAME'
      this.button.addEventListener('click', (e) => {
        e.stopPropagation();
        this.startNewGame(this);
      })
    } else {
      this.button.addEventListener('click', (e) => {
        e.stopPropagation();
        this.startNewRound(this);
      })
    }
    timerController.pauseTimer();
  }

  public startNewGame(me: GameOverState) {
    me.sprite.remove();
    me.game.boardController.startNewGame();
  }


  public startNewRound(me: GameOverState) {
    me.sprite.remove();
    me.game.startNewRound();
  }

  public leaveState() {
    this.sprite.remove();
  }

  public resumeState() {
    this.game.canvas.append(this.sprite);
  }

}