import {Coord, coord } from "./Coord";
import { Token } from "./Token";

export class DroppingToken extends Token {
  public DROP_DURATION = 200;

  constructor(initialPosition: coord, color: 'R' | 'Y') {
    let colorString = 'rgb(255, 104, 104)';
    if (color == 'Y') colorString = 'rgb(221, 221, 76)'
    super(initialPosition, colorString);
    this.sprite.classList.toggle('board-token', true);
  }

  /**
   * 
   * @param destRow destination row (base 0)
   * returns promise when finished
   */

  public drop(destRow: number): Promise<number> {
    return new Promise((resolve) => {
      let destY = 100*destRow + 100 // dest of center Y
      let keyFrames = [{
        top: this.sprite.style.top,
        easing: 'ease-in'
      }, {
        top: `${destY - this.radius}px`
      }]
      let options = {
        duration: this.DROP_DURATION
      }
      let animation = this.sprite.animate(keyFrames, options)
      animation.addEventListener('finish', () => {
        this.setCenterY(destY)
        resolve(1);
      })
    })
  }


}