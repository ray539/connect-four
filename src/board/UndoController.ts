import { BoardController } from "./BoardController";
import { StartState } from "./states/StartState";

export class UndoController {
  public leftButton = document.querySelector('.undo-redo-button.left') as HTMLElement;
  public rightButton = document.querySelector('.undo-redo-button.right') as HTMLElement;
  public boardController: BoardController;

  public constructor(boardController: BoardController) {
    this.boardController = boardController;
    this.leftButton.addEventListener('mousedown', () => {
      this.buttonDown(this.leftButton);
    });
    this.leftButton.addEventListener('mouseup', () => {
      this.buttonUp(this.leftButton);
    })
    this.leftButton.addEventListener('mouseleave', () => {
      this.buttonUp(this.leftButton);
    })
    this.leftButton.addEventListener('click', () => this.undo());

    this.rightButton.addEventListener('mousedown', () => {
      this.buttonDown(this.rightButton);
    });
    this.rightButton.addEventListener('mouseup', () => {
      this.buttonUp(this.rightButton);
    })
    this.rightButton.addEventListener('mouseleave', () => {
      this.buttonUp(this.rightButton);
    })
    this.rightButton.addEventListener('click', () => this.redo());
  }

  public hide() {
    this.leftButton.style.display = 'none';
    this.rightButton.style.display = 'none';
  }

  public show() {
    this.leftButton.style.display = 'flex';
    this.rightButton.style.display = 'flex';
  }

  public undo() {
    if (this.boardController.currentGame?.state instanceof StartState || this.boardController.currentGame?.paused) return;
    this.boardController.currentGame?.undo();
  }

  public redo() {
    if (this.boardController.currentGame?.state instanceof StartState || this.boardController.currentGame?.paused) return;
    this.boardController.currentGame?.redo();
  }

  public buttonDown(button: HTMLElement) {
    button.classList.toggle('clicked', true)
  }

  public buttonUp(button: HTMLElement) {
    button.classList.toggle('clicked', false)
  }

}