import { DroppingState } from "./board/states/DroppingState";
import { GameOverState } from "./board/states/GameOverState";
import { PlacingState } from "./board/states/PlacingState";
import { StartState } from "./board/states/StartState";

export const NUMROWS = 6;
export const NUMCOLS = 7;
export type State = PlacingState | DroppingState | GameOverState | StartState;
export interface GameData {
  timerDuration: number,
  infin: boolean,
  roundsEachGame: number,
  allowUndoRedo: boolean
}