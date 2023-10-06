import { BoardController } from "../board/BoardController";
import { GameOverState } from "../board/states/GameOverState";
import { PlacingState } from "../board/states/PlacingState";

export class NewGameController {
  public sprite = document.querySelector('.button-purple.restart') as HTMLElement;
  public boardController: BoardController;

  constructor(boardController: BoardController) {
    this.boardController = boardController;
    this.sprite.addEventListener('click', () => this.showScreen(this));
  }

  public showing = false;
  public showScreen(me: NewGameController) {
    if (this.showing) return;
    me.boardController.currentGame?.pause();
    this.showing = true;
    let restartScreen = new RestartScreen(me.boardController, me);
    me.boardController.sprite.append(restartScreen.sprite);
  }
}


class RestartScreen {
  public sprite: HTMLElement;
  public yesButton: HTMLElement;
  public noButton: HTMLElement;
  public boardController: BoardController;

  // when called, show the restart screen
  constructor(boardController: BoardController, newGameController: NewGameController) {
    this.boardController = boardController;

    this.sprite = document.createElement('div');
    this.sprite.classList.add('board-alert', 'restart');
    this.sprite.innerHTML = 
    '<div class="text-box">' +
      '<div class="block1">' +
        'Game still ongoing. All scores will be lost. <br>' +
        'Are you sure you want to restart?' +
      '</div>' +
      '<div>' +
        '<button class="button-purple yes">YES</button>' +
        '<button class="button-purple no">NO</button>' +
      '</div>' +
    '</div>'
    this.yesButton = this.sprite.querySelector('.button-purple.yes') as HTMLElement;
    this.yesButton.addEventListener('click', (e) => {
      newGameController.showing = false;
      e.stopPropagation();
      this.yes(this);
    });

    this.noButton = this.sprite.querySelector('.button-purple.no') as HTMLElement;
    this.noButton.addEventListener('click', (e) => {
      newGameController.showing = false;
      e.stopPropagation();
      this.no(this);
    });
    this.sprite.style.display = 'flex';
  }

  public yes(me: RestartScreen) {
    me.sprite.remove();
    me.boardController.startNewGame()
  }

  public no(me: RestartScreen) {
    console.log('here')
    me.sprite.remove();
    me.boardController.currentGame?.resume();
  }


}