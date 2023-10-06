import { BoardController } from "./BoardController";
import { NUMROWS, NUMCOLS, State } from "../constants";
import { TimerController } from "./timer/TimerController";
import { PlacingState } from "./states/PlacingState";
import { StartState } from "./states/StartState";
import { GameOverState } from "./states/GameOverState";
import { DroppingToken } from "./DroppingToken";
import { Coord } from "./Coord";

interface GameSave {
  board: Array<Array<B>>,
  turn: 'R' | 'Y'
}

type B = 'R' | 'Y' | '-';
type T = 'R' | 'Y';

export class Game {
  public boardController: BoardController;

  public canvas = document.querySelector('.board-wrapper') as HTMLElement;
  public boardImg = document.querySelector('.board-img') as HTMLElement;
  public state!: State | null;
  public board: Array<Array<B>> = [];
  public INITIALTURN: 'R' | 'Y';
  public turn: 'R' | 'Y';
  public timerController: TimerController;
  public TIMERDURATION: number;
  public redScore = 0;
  public yellowScore = 0;

  public redScoreboard = document.querySelector('.player-score.red-player') as HTMLElement;
  public yellowScoreboard = document.querySelector('.player-score.yellow-player') as HTMLElement;

  public ROUNDSEACHGAME : number;
  public ALLOWREDOUNDO : boolean;
  public INFIN: boolean

  public gameSaves: Array<GameSave> = [];
  public pointer = 0;

  constructor(boardController: BoardController, INITIALTURN: 'R' | 'Y', TIMERDURATION: number, INFIN: boolean, ROUNDSEACHGAME: number, ALLOWREDOUNDO: boolean) {
    this.INITIALTURN = INITIALTURN;
    this.turn = INITIALTURN;
    this.boardController = boardController;

    this.TIMERDURATION = TIMERDURATION;
    this.INFIN = INFIN;
    if (!INFIN) {
      this.timerController = new TimerController(this, this.TIMERDURATION);
    } else {
      this.timerController = new TimerController(this, -1);
    }

    this.redScoreboard.innerText = '0';
    this.yellowScoreboard.innerText = '0';

    this.ROUNDSEACHGAME = ROUNDSEACHGAME;
    this.ALLOWREDOUNDO = ALLOWREDOUNDO;
    if (ALLOWREDOUNDO) {
      this.boardController.undoController?.show()
    } else {
      this.boardController.undoController?.hide()
    }

    this.changeState(new StartState(this));
    this.resetBoard();
  }

  public incrementRedScore() {
    this.redScore++;
    this.redScoreboard.innerText = `${this.redScore}`;
  }

  public incrementYellowScore() {
    this.yellowScore++;
    this.yellowScoreboard.innerText = `${this.yellowScore}`;
  }

  public decrementScore(turn: T) {
    if (turn == 'R') {
      this.redScore--;
      this.redScoreboard.innerText = `${this.redScore}`;
    } else {
      this.yellowScore--;
      this.yellowScoreboard.innerText = `${this.yellowScore}`;
    }
  }

  public getScore(turn: T) {
    console.log(turn, this.redScore, this.yellowScore)
    if (turn == 'R') {
      return this.redScore;
    } else return this.yellowScore;
  }

  public getMousePos() {
    return this.boardController.mousePos;
  }

  public startNewRound() {
    this.turn = this.INITIALTURN;
    this.resetBoard();
    this.pointer = 0;
    this.gameSaves = [];
    this.gameSaves[this.pointer++] = {
      board: this.copyMatrix(this.board),
      turn: this.turn 
    }
    this.changeState(new PlacingState(this));
  }

  public changeState(newState: State) {
    if (this.state) {
      this.state.leaveState();
    }
    this.state = newState;
  }

  public removeHTMLTokens() {
    let HTMLTokens = document.querySelectorAll('.board-token');
    HTMLTokens.forEach(t => t.remove());
  }

  /**
   * empties board and resets timer
   */
  public resetBoard() {
    this.board = [];
    for (let i = 0; i < NUMROWS; i++) {
      let row:B[] = [];
      this.board.push(row);
      for (let j = 0; j < NUMCOLS; j++) {
        this.board[i][j] = '-'
      }
    }
    this.removeHTMLTokens();
    this.timerController.setTurn(this.turn);
  }

  public copyMatrix(orig: Array<Array<string>>) {
    return orig.map((arr) => arr.slice()) as B[][];
  }

  public otherTurn(turn: 'R' | 'Y') {
    if (turn == 'R') return 'Y';
    return 'R'
  }

  /**
   * 
   * @param colNum has to be > 0
   * @param _destRow if -1, then calculates dest row
   */
  public placeToken(colNum: number, _destRow: number=-1) {
    let destRow: number;
    if (_destRow < 0) destRow = this.calculateDestRow(colNum);
    else destRow = _destRow;
    this.board[destRow][colNum] = this.turn;
  }

  public updateBoardHTML() {
    this.removeHTMLTokens();
    for (let i = 0; i < NUMROWS; i++) {
      for (let j = 0; j < NUMCOLS; j++) {
        if (this.board[i][j] != '-') {
          let token = new DroppingToken(Coord.toScreenCoords({x: j, y: i}), this.board[i][j] as ('R' | 'Y'));
          this.canvas.append(token.sprite);
        }
      }
    }
  }

  public undo() {
    if (this.pointer <= 1) {
      console.log('can\'t undo');
      return;
    }

    if (this.state instanceof GameOverState) {
      this.decrementScore(this.turn);
      this.pointer -= 2;
    } else {
      this.pointer -= 1;
    }

    this.board = this.copyMatrix(this.gameSaves[this.pointer - 1].board);
    this.turn = this.gameSaves[this.pointer - 1].turn;

    this.timerController.setTurn(this.turn);
    this.timerController.startTimer();

    this.updateBoardHTML();
    this.changeState(new PlacingState(this));
  }

  public redo() {
    if (this.pointer >= this.gameSaves.length) {
      console.log('can\'t redo');
      return;
    }
    this.pointer += 1;
    this.board = this.copyMatrix(this.gameSaves[this.pointer - 1].board);
    this.turn = this.gameSaves[this.pointer - 1].turn;

    this.timerController.setTurn(this.turn);
    this.timerController.startTimer();

    this.updateBoardHTML();
    let res = this.checkWin();
    if (res == 'T') {
      this.changeState(new GameOverState(this, this.turn, this.timerController));
    } else if (res == 'N') {
      this.changeState(new GameOverState(this, 'N', this.timerController));
    }
    // this.changeState(new PlacingState(this));
  }

  public switchTurns() {
    if (this.turn == 'R') this.turn = 'Y'
    else if (this.turn == 'Y') this.turn = 'R'
    this.timerController.setTurn(this.turn);
    this.timerController.startTimer();
  }

  /**
   * base 0
   * given a column, calculate where it should fall
   */
  public calculateDestRow(colNum: number): number {
    let j = colNum;
    for (let i = NUMROWS - 1; i >= 0; i--) {
      if (this.board[i][j] == '-') return i;
    }
    return -1;
  }

  public checkHorizontal(turn: 'R' | 'Y') {
    for (let i = 0; i < NUMROWS; i++) {
      for (let j = 0; j <= NUMCOLS - 4; j++) {
        let found = true;
        for (let k = 0; k < 4; k++) {
          if (this.board[i][j + k] != turn) {
            found = false;
          }
        }
        if (found) return true;
      }
    }
    return false;
  }

  public checkVertical(turn: 'R' | 'Y') {
    for (let i = 0; i <= NUMROWS - 4; i++) {
      for (let j = 0; j < NUMCOLS; j++) {
        let found = true;
        for (let k = 0; k < 4; k++) {
          if (this.board[i + k][j] != turn) {
            found = false;
          }
        }
        if (found) return true;
      }
    }
    
    return false;
  }

  // checks '\' direction
  public checkDiagonal(turn: 'R' | 'Y') {
    for (let i = 0; i <= NUMROWS - 4; i++) {
      for (let j = 0; j <= NUMCOLS - 4; j++) {
        let found = true;
        for (let k = 0; k < 4; k++) {
          if (this.board[i + k][j + k] != turn) {
            found = false;
          }
        }
        if (found) return true;
      }
    }
    return false;
  }

  // checks '/' direction
  public checkOffDiagonal(turn: 'R' | 'Y') {
    for (let i = NUMROWS - 3; i < NUMROWS; i++) {
      for (let j = 0; j <= NUMCOLS - 4; j++) {
        let found = true;
        for (let k = 0; k < 4; k++) {
          if (this.board[i - k][j + k] != turn) {
            found = false;
          }
        }
        if (found) return true;
      }
    }
    return false;
  }

  public checkTie() {
    for (let i = 0; i < NUMROWS; i++) {
      for (let j = 0; j < NUMCOLS; j++) {
        if (this.board[i][j] == '-') return false;
      }
    }
    return true;
  }

  public reactToWin() {
    let res = this.checkWin();
    if (res == 'T') {
      this.changeState(new GameOverState(this, this.turn, this.timerController));
    } else if (res == 'N') {
      this.changeState(new GameOverState(this, 'N', this.timerController));
    } else if (res == 'F') {
      this.switchTurns();
      this.changeState(new PlacingState(this));
    }
    let save = {
      board: this.copyMatrix(this.board),
      turn: this.turn
    }

    this.gameSaves[this.pointer++] = save;
    this.gameSaves = this.gameSaves.slice(0, this.pointer);
  }

  // save the state here
  public checkWin(): 'T' | 'F' | 'N' {
    if (this.checkHorizontal(this.turn) || this.checkVertical(this.turn) || this.checkDiagonal(this.turn) || this.checkOffDiagonal(this.turn)) return 'T'
    if (this.checkTie()) return 'N';
    return 'F';
  }

  public paused = false;
  public pause() {
    this.paused = true;
    this.state?.leaveState();
    this.timerController.pauseTimer();
  }

  public resume() {
    this.paused = false;
    this.state?.resumeState();
  }

}