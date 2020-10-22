import { NgCanvas, NgCanvasElement, CanvasElement } from 'angular-canvas';
import { getColor, getMatrix } from './utils';

const CAT_SPRITES = [
  `
000000bb000b00
000000bgbbbg00
00b00bbbbbbb0b
0b0000bbybbyb0
0b000bbbbbbb0b
0b00000wwww000
00b000bbwww000
000bbbbbbwb000
000bbbbwbbbw00
000bb0000bb000
0000b00000b000
`,
  `
000000bb000b00
000000bgbbbg00
0b000bbbbbbb0b
0b0000bbybbyb0
0b000bbbbbbb0b
0b00000wwww000
00b000bbwww000
000bbbbbbwb000
000bbbbwbbbw00
000bb0000bb000
000b00000b0000
`,
  `
000000bb000b00
000000bgbbbg00
00000bbbbbbb0b
b00000bbybbyb0
0b000bbbbbbb0b
0b00000wwww000
00b000bbwww000
000bbbbbbwb000
000bbbbwbbbw00
000bb0000bb000
0000b00000b000
`,
  `
000000bb000b00
000000bgbbbg00
00000bbbbbbb0b
000000bbybbyb0
bb000bbbbbbb0b
0b00000wwww000
00b000bbwww000
000bbbbbbwb000
000bbbbwbbbw00
000bb0000bb000
000b00000b0000
`,
];

const SIZE = 6;

const CAT_SPRITE_MATRIX = CAT_SPRITES.map(getMatrix);

const COLOR_MAP = new Map([
  ['0', 'transparent'],
  ['b', '#161326'],
  ['w', 'white'],
  ['y', '#ffd800'],
  ['g', '#4c4c4c'],
]);

@CanvasElement({
  selector: 'cat',
})
export class NgCat implements NgCanvasElement {
  public parent: NgCanvas;
  public needDraw: boolean;

  public x: number;
  public y: number;

  public spriteIndex = 0;
  public revert = false;
  public rightPressed = false;
  public leftPressed = false;
  public downPressed = false;
  public speed = 4;
  public size = SIZE;

  private callbackFunc;

  addEventListener(eventName: string, callbackFunc) {
    this.callbackFunc = callbackFunc;
  }

  removeEventListener(eventName: string, callbackFunc) {}

  setNgProperty(name: string, value: any): void {
    this[name] = value;
    this.parent.drawAll();
  }

  draw(context: CanvasRenderingContext2D, time: number): void {
    let dx = 0;
    const size = this.size;

    if (this.rightPressed && this.parent.element.width > this.x + SIZE * 14) {
      dx = this.downPressed ? 1 : this.speed;
    }
    if (this.leftPressed && 0 < this.x) {
      dx = this.downPressed ? -1 : -this.speed;
    }

    this.x += dx;
    let y = this.y;

    if (this.callbackFunc) {
      this.callbackFunc(this.x);
    }

    const matrix = CAT_SPRITE_MATRIX[this.spriteIndex];
    let matrixLength = matrix.length;

    // Cat is seat
    y += 2 * size;
    matrixLength -= 2;

    if (!this.downPressed && (this.rightPressed || this.leftPressed)) {
      y -= 2 * size;
      matrixLength += 2;
    }

    for (let ci = 0; ci < matrixLength; ci++) {
      let rows = matrix[ci];
      if (this.revert) {
        rows = rows.slice().reverse();
      }

      for (let cy = 0; cy < rows.length; cy++) {
        context.fillStyle = getColor(COLOR_MAP, rows[cy]);
        context.fillRect(this.x + cy * size, y + ci * size, size, size);
      }
    }
    this.needDraw = this.rightPressed || this.leftPressed;
  }
}
