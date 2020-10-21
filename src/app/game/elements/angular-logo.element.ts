import { NgCanvas, NgCanvasElement, CanvasElement } from 'angular-canvas';

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

function getMatrix(arr) {
  return arr
    .split(/\n/)
    .filter(Boolean)
    .map((s) => s.split(''));
}
const LOGO_MATRIX = getMatrix(LOGO);

const COLOR_MAP = new Map([
  ['0', 'transparent'],
  ['r', '#e15856'],
  ['d', '#ca413a'],
  ['w', '#ffffff'],
]);

function getColor(s: string) {
  if (COLOR_MAP.has(s)) {
    return COLOR_MAP.get(s);
  }
  return 'transparent';
}

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
    this.height = this.parent.element.height - 100;
    const y = 50; //Math.floor(this.height / 1.5);
    const x = 50;

    const matrixLength = LOGO_MATRIX.length;

    for (let ci = 0; ci < matrixLength; ci++) {
      const rows = LOGO_MATRIX[ci];

      for (let cy = 0; cy < rows.length; cy++) {
        context.fillStyle = getColor(rows[cy]);
        context.fillRect(x + cy * SIZE, y + ci * SIZE, SIZE, SIZE);
      }
    }
  }
}
