import {NgCanvas, NgCanvasElement, CanvasElement} from 'angular-canvas';

const SIZE = 6;
const CAT_HEIGHT = 10;

const CACTUS = `
000000000gggg
00000000gggggg
0000000gggggggg
0000000gggggggg
0000000gggggggg
0000000gggggggg
000gg00gggggggg
00gggg0gggggggg
00gggg0gggggggg
00cgggcgggggggg
00cccccgggggggg
000ccccgggggggg0gg
0000000ggggggggcgc
0000000ggggggggcc
0000000gggggggg
0000000gggggggg
0000000gggggggg
0000000gggggggg
0000000cggggggc
0000000ccggggcc
w0wwwwwccccccccwwww0ww
000000wwwwwwwwww
`;

function getMatrix(arr) {
  return arr.split(/\n/).filter(Boolean).map(s => s.split(''));
}
const CACTUS_MATRIX = getMatrix(CACTUS);

const COLOR_MAP = new Map([
  ['0', 'transparent'],
  ['g', '#5d9d83'],
  ['c', '#518b7f'],
  ['w', '#d1784b'],
]);

function getColor(s: string){
  if (COLOR_MAP.has(s)) { return COLOR_MAP.get(s); }
  return 'transparent';
}


@CanvasElement({
  selector: 'cactus'
})
export class NgCactus implements NgCanvasElement {
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
    const y =  Math.floor(this.height / 1.5);
    const x = 200;

    const matrixLength = CACTUS_MATRIX.length;

    for (let ci = 0; ci < matrixLength; ci++) {
      const rows = CACTUS_MATRIX[ci];

      for (let cy = 0; cy < rows.length; cy++) {
        context.fillStyle = getColor(rows[cy]);
        context.fillRect(x + cy * SIZE, y + ci * SIZE, SIZE, SIZE);
      }
    }
  }
}
