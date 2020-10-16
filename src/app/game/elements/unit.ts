import {RendererStyleFlags2} from '@angular/core';
import {NgCanvas, NgCanvasElement, CanvasElement} from 'angular-canvas';

const SMOOTH = 10;

const CAT_SPRITES = [`
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
`
];

const SIZE = 6;

function getMatrix(arr) {
  return arr.split(/\n/).filter(Boolean).map(s => s.split(''));
}
const CAT_SPRITE_MATRIX = CAT_SPRITES.map(getMatrix);

const COLOR_MAP = new Map([
  ['0', 'transparent'],
  ['b', '#161326'],
  ['w', 'white'],
  ['y', '#ffd800'],
  ['g', '#4c4c4c'],
]);

function getColor(s: string){
  if (COLOR_MAP.has(s)) { return COLOR_MAP.get(s); }
  return 'transparent';
}

@CanvasElement({
  selector: 'unit'
})
export class NgUnit implements NgCanvasElement {
  public parent: NgCanvas;
  public needDraw: boolean;

  public x: number;
  public oldX: number;
  public waypointsX: number[];

  public y: number;
  public w: number;
  public h: number;
  public spriteIndex = 0;
  public revert = false;
  public fillStyle = 'black';

  private animationBlock = 1;

  appendChild(newChild: any): void {
  }
  addClass(name): void {
  }

  insertBefore(newChild: any, refChild: any): void {
  }

  removeAttribute(name: string, namespace?: string | null): void {
  }

  removeChild(oldChild: any): void {
    this.parent.removeChild(oldChild);
  }

  removeClass(name: string): void {
  }

  removeStyle(style: string, flags?: RendererStyleFlags2): void {
  }

  setNgAttribute(name: string, value: string, namespace?: string | null): void {
    this[name] = value;

    this.parent.drawAll();
  }

  setNgProperty(name: string, value: any): void {
    if (name === 'x') {
      if (this.x) {
        this.oldX = this.x;
      }
      this.x = value;

      // Init data
      const oldX = this.oldX || 0;
      this.waypointsX = calcWaypoints(oldX, this.x);

      this.animationBlock = 1;
    } else {

      this[name] = value;
    }

    this.parent.drawAll();
  }

  setStyle(style: string, value: any, flags?: RendererStyleFlags2): void {
  }

  setValue(): void {

  }

  draw(context: CanvasRenderingContext2D, time: number): void {
    const x = this.waypointsX[this.animationBlock - 1] || this.waypointsX[this.waypointsX.length - 1];
    const matrix = CAT_SPRITE_MATRIX[this.spriteIndex];

    for (let ci = 0; ci < matrix.length; ci++) {
      let rows = matrix[ci];
      if (this.revert) {
          rows = rows.slice().reverse();
      }
      for (let cy = 0; cy < rows.length; cy++) {
          context.fillStyle = getColor(rows[cy]);
          context.fillRect(x + cy * SIZE, this.y + ci * SIZE, SIZE, SIZE);
        }
    }

    this.animationBlock++;

    // this.needDraw = true;
    this.needDraw = this.animationBlock < SMOOTH;
  }
}

function calcWaypoints(oldX: number, newX: number): number[] {
  const points = [];
  for (let j = 0; j < SMOOTH; j++) {
    const dx = newX - oldX;
    points.push(newX + dx * j / SMOOTH);
  }
  return points;
}
