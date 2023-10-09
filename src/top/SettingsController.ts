import { BoardController } from "../board/BoardController";
import { StartState } from "../board/states/StartState";
import { GameData } from "../constants";

export class SettingsController {
  public button = document.querySelector('.button-purple.settings') as HTMLElement;
  public menu = document.querySelector('.menu') as HTMLElement;
  public upArrow = this.menu.querySelector('.up-arrow') as HTMLElement;
  public applyButton = this.menu.querySelector('.button-purple.apply') as HTMLElement;
  public message = this.menu.querySelector('.message') as HTMLElement;
  public boardController: BoardController;

  public infinCheckbox = this.menu.querySelector('.infin') as HTMLInputElement;
  public timer = (this.menu.querySelector('.timer-duration') as HTMLInputElement);

  constructor(boardController: BoardController) {
    this.boardController = boardController;
    this.button.addEventListener('click', () => this.showMenu(this));
    this.upArrow.addEventListener('click', () => this.hideMenu(this));
    this.applyButton.addEventListener('click', () => this.giveData(this));

    this.infinCheckbox.addEventListener('change', () => {
      if (this.infinCheckbox.checked) {
        this.timer.disabled = true;
      } else {
        this.timer.disabled = false;
      }
    })

  }

  public showing = false;
  public showMenu(me: SettingsController) {
    if (me.showing) return;
    me.showing = true;
    me.menu.style.display = 'block'
    setTimeout(() => me.menu.classList.toggle('show', true), 0.0001);
  }

  public hideMenu(me: SettingsController) {
    me.menu.classList.toggle('show', false);
    me.menu.addEventListener('transitionend', () => {me.menu.style.display = 'none'}, {once: true});
    me.showing = false;
  }

  public validateData(timerDuration:number, infin: boolean, roundsEachGame: number) {
    if (timerDuration <= 0) {
      if (!infin) {
        return {
          success: false,
          message: 'Timer duration must be a positive integer'
        }
      }
    }
    if (roundsEachGame <= 0 || roundsEachGame % 2 != 1) {
      return {
        success: false,
        message: '\"Best of\" must be a positive odd integer'
      }
    }
    return {
      success: true,
      message: 'Changes will apply next game'
    }

  }

  public giveData(me: SettingsController) {
    let timerDuration = me.timer.value == '' ? -1 : Number(me.timer.value);
    let infin = me.infinCheckbox.checked;
    let roundsEachGameS = (this.menu.querySelector('.rounds-each-game') as HTMLInputElement).value;
    let roundsEachGame = roundsEachGameS == '' ? -1 : Number(roundsEachGameS);
    let allowUndoRedo = (this.menu.querySelector('.allow') as HTMLInputElement).checked;

    me.message.innerHTML = ''
    let {success, message} = this.validateData(timerDuration, infin, roundsEachGame);
    if (success) {
      me.message.innerHTML += '<img src="check-circle.svg" width="30" class="icon">'
    } else {
      me.message.innerHTML += '<img src="cross-circle.svg" width="30" class="icon">'
    }
    me.message.innerHTML += message;
    me.message.classList.toggle('show', true);

    let obj = {
      timerDuration: timerDuration,
      infin: infin,
      roundsEachGame: roundsEachGame,
      allowUndoRedo: allowUndoRedo,
    }

    setTimeout(() => this.doGiveData(this, obj, success), 1000);
  }

  public doGiveData(me: SettingsController, obj: GameData, success: boolean) {
    me.message.classList.toggle('show', false);
    if (!success) return;
    me.message.addEventListener('transitionend', () => this.hideMenu(me), {once: true});
    me.boardController.nextGameData = obj;
    if (this.boardController.currentGame?.state instanceof StartState) {
      this.boardController.startNewGame();
    }
  }



}