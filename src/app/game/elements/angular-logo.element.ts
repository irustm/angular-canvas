import { NgCanvas, NgCanvasElement, CanvasElement } from 'angular-canvas';
import { getMatrix, renderMatrix } from './utils';

const SIZE = 3;
const CAT_SIZE = 7 * 6;

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
  public deltaY: number = 0;
  public step: number = 1;
  public unitX: number;
  public unitY: number;

  public height: number;
  public width: number;

  private callbackFunc: {
    failed?: () => {};
    success?: () => {};
  } = {};

  addEventListener(eventName: string, callbackFunc) {
    this.callbackFunc[eventName] = callbackFunc;
  }

  removeEventListener(eventName: string, callbackFunc) {}

  setNgProperty(name: string, value: any): void {
    this[name] = value;

    if (this.x && this.step && this.unitX) {
      this.parent.drawAll();
    }
  }

  setAttribute(name, value) {
    this[name] = value;
  }

  draw(context: CanvasRenderingContext2D, time: number): void {
    this.deltaY += this.step;

    renderMatrix(context, LOGO_MATRIX, COLOR_MAP, SIZE, this.x, this.deltaY);

    this.needDraw = this.deltaY < this.parent.height;

    if (!this.needDraw && this.callbackFunc.failed) {
      this.deltaY = -200;
      this.callbackFunc.failed();
    } else if (this.callbackFunc.success) {
      if (this.x - CAT_SIZE < this.unitX && this.unitX < this.x + CAT_SIZE) {
        if (
          this.deltaY - CAT_SIZE < this.unitY &&
          this.unitY < this.deltaY + CAT_SIZE
        ) {
          this.deltaY = -200;
          this.x = Math.ceil(Math.random() * this.parent.width) - CAT_SIZE;
          this.step += 0.5;
          this.callbackFunc.success();
        }
      }
    }
  }
}
