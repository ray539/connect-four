import { coord } from "./Coord";
import { Token } from "./Token";

export class PlacingToken extends Token {

  constructor(initialPosition: coord, color: 'R' | 'Y') {
    let colorString = 'rgba(255, 104, 104, 0.5)';
    if (color == 'Y') colorString = 'rgba(221, 221, 76, 0.5)'
    super(initialPosition, colorString);
  }

  /**
   * 
   * @param mouseX mouse x coordinate
   */

  public update(mouseX: number, dmouseX: number) {
    let speed = Math.max(Math.abs(dmouseX), 10);
    let destX = Math.floor(mouseX / 100) * 100 + 50;
    if (destX < 0) destX = 50;
    if (destX > 700) destX = 650;

    // update current position
    let diff = destX - this.position.x;
    if (diff == 0) return;
    let sign =  diff > 0 ? 1 : -1;
    this.setCenterX(this.position.x + sign * speed);

    // for snapping
    let d1 = destX - this.position.x;
    let d0 = destX - this.prevPosition.x;    
    if (d1 == 0 || d0*d1 < 0) {
      this.setCenterX(destX)
    }

    this.prevPosition = {...this.position};
  }
}