
import { DroppingToken } from "../DroppingToken";
import { Game } from '../Game';

export class DroppingState {
  public canvas: HTMLElement;
  public token!: DroppingToken;
  public game: Game;
  public dropping: boolean = false;

  constructor(game: Game, colNum: number, destRow: number) {
    this.game = game;
    this.canvas = game.canvas;
    this.token = new DroppingToken({x: 100 * colNum + 50, y: 50}, this.game.turn);
    this.canvas.append(this.token.sprite)
    this.drop(destRow);
  }

  public leaveState() {
    if (this.dropping) throw new Error('cannot leave state')
  }

  public resumeState() {
  }

  public async drop(destRow: number) {
    this.dropping = true;
    await this.token.drop(destRow);
    this.dropping = false;

    // let res = this.game.checkWin();
    // if (res == 'T') {
    //   this.game.changeState(new GameOverState(this.game, this.game.turn, this.game.timerController));
    // } else if (res == 'N') {
    //   this.game.changeState(new GameOverState(this.game, 'N', this.game.timerController));
    // } else if (res == 'F') {
    //   this.game.switchTurns();
    //   this.game.changeState(new PlacingState(this.game));
    // }
    this.game.reactToWin();
  }
}