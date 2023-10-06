import { BoardController } from "./board/BoardController";
import { UndoController } from "./board/UndoController";
import { TimerController } from "./board/timer/TimerController";
import { NewGameController } from "./top/NewGameController";
import { SettingsController } from "./top/SettingsController";

let bc = new BoardController()
let rc = new NewGameController(bc)
let sc = new SettingsController(bc)
let urc = new UndoController(bc)
bc.addUndoController(urc);