import { BoardController } from "./board/BoardController";
import { UndoController } from "./board/UndoController";
import { NewGameController } from "./top/NewGameController";
import { SettingsController } from "./top/SettingsController";

let bc = new BoardController()
new NewGameController(bc)
new SettingsController(bc)
let urc = new UndoController(bc)
bc.addUndoController(urc);