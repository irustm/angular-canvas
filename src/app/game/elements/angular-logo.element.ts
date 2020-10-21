import { NgCanvas, NgCanvasElement, CanvasElement } from 'angular-canvas';
import { getMatrix, renderMatrix } from './utils';

const SIZE = 3;

const LOGO = `
0000000rrrr
0000rrrrrdrrrr
00rrrrrrwwdddrrr
rrrrrrrwwwwddddrrr
rrrrrrrwwwwdddddrr
rrrrrrwwrdwwddddrr
rrrrrrwwrdwwddddrr
rrrrrrwwrdwwddddrr
rrrrrwwrrddwwdddrr
rrrrrwwrrddwwddrrr
0rrrrwwwwwwwwddrr
0rrrwwwwwwwwwwdrr
0rrrwwrrrdddwwdrr
0rrwwrrrrddddwwrr
0rrwwrrrrddddwwrr
0rrrrrrrrddddrrr
000rrrrrrddrrrr
00000rrrrdrrr
000000rrrrrr
0000000rrrr
`;

const LOGO_MATRIX = getMatrix(LOGO);

const COLOR_MAP = new Map([
  ['0', 'transparent'],
  ['r', '#e15856'],
  ['d', '#ca413a'],
  ['w', '#ffffff'],
]);

@CanvasElement({
  selector: 'angular-logo',
})
export class NgLogo implements NgCanvasElement {
  public parent: NgCanvas;
  public needDraw: boolean;

  public x: number;
  public y: number;
  public height: number;
  public width: number;

  setNgProperty(name: string, value: any): void {
    this[name] = value;
    this.parent.drawAll();
  }

  draw(context: CanvasRenderingContext2D, time: number): void {
    const y = 50;
    const x = 50;

    renderMatrix(context, LOGO_MATRIX, COLOR_MAP, SIZE, x, y);
  }
}
