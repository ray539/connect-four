import {Coord, coord } from "./Coord";

export abstract class Token {

  public position!: coord; // position of CENTER of the token
  public prevPosition: coord;
  public radius = 35;
  public sprite: HTMLElement;
  
  /**
   * 
   * @param initialPosition initial position of CENTER of token
   * @param backgroundColor background color as one would write in CSS
   */
  constructor(initialPosition: coord, backgroundColor: string) {
    this.sprite = document.createElement('div');
    Object.assign(this.sprite.style, {
      zIndex: '-1',
      width: `${2*this.radius}px`,
      height: `${2*this.radius}px`,
      borderRadius: '50%',
      position: 'absolute',
      backgroundColor: backgroundColor,
    })
    this.setCenterPosition(initialPosition);
    this.prevPosition = {...initialPosition};
  }

  public getPosition() : coord {
    return this.position;
  }

  public setCenterPosition(position: coord) {
    this.sprite.style.left = `${position.x - this.radius}px`;
    this.sprite.style.top = `${position.y - this.radius}px`;
    this.position = position;
  }

  public setCenterX(x: number) {
    this.sprite.style.left = `${x - this.radius}px`;
    this.position.x = x;
  }

  public setCenterY(y: number) {
    this.sprite.style.top = `${y - this.radius}px`;
    this.position.y = y;
  }

  public getTopLeftPosition() {
    return {x: this.position.x - this.radius, y: this.position.y - this.radius}
  }

  public getTopLeftX() {
    return this.position.x - this.radius;
  }

  public getTopLeftY() {
    return this.position.y - this.radius;
  }

}