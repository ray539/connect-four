import { BoardController } from "./BoardController";
import { PlacingState } from "./states/PlacingState";
import { StartState } from "./states/StartState";

export class UndoController {
  public leftButton = document.querySelector('.undo-redo-button.left') as HTMLElement;
  public rightButton = document.querySelector('.undo-redo-button.right') as HTMLElement;
  public boardController: BoardController;

  public constructor(boardController: BoardController) {
    this.boardController = boardController;
    this.leftButton.addEventListener('mousedown', () => {
      this.buttonDown(this, this.leftButton);
    });
    this.leftButton.addEventListener('mouseup', () => {
      this.buttonUp(this, this.leftButton);
    })
    this.leftButton.addEventListener('mouseleave', () => {
      this.buttonUp(this, this.leftButton);
    })
    this.leftButton.addEventListener('click', () => this.undo(this));

    this.rightButton.addEventListener('mousedown', () => {
      this.buttonDown(this, this.rightButton);
    });
    this.rightButton.addEventListener('mouseup', () => {
      this.buttonUp(this, this.rightButton);
    })
    this.rightButton.addEventListener('mouseleave', () => {
      this.buttonUp(this, this.rightButton);
    })
    this.rightButton.addEventListener('click', () => this.redo(this));
  }

  public hide() {
    this.leftButton.style.display = 'none';
    this.rightButton.style.display = 'none';
  }

  public show() {
    this.leftButton.style.display = 'flex';
    this.rightButton.style.display = 'flex';
  }

  public undo(me: UndoController) {
    if (this.boardController.currentGame?.state instanceof StartState || this.boardController.currentGame?.paused) return;
    this.boardController.currentGame?.undo();
  }

  public redo(me: UndoController) {
    if (this.boardController.currentGame?.state instanceof StartState || this.boardController.currentGame?.paused) return;
    this.boardController.currentGame?.redo();
  }

  public buttonDown(me: UndoController, button: HTMLElement) {
    button.classList.toggle('clicked', true)
  }

  public buttonUp(me: UndoController, button: HTMLElement) {
    button.classList.toggle('clicked', false)
  }

}