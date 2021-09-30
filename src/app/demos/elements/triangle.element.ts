import {
  CanvasElement,
  NgCanvas,
  NgCanvasElement,
} from '../../../../projects/angular-canvas-lib/src/lib';

@CanvasElement({
  selector: 'triangle',
})
export class TriangleElement implements NgCanvasElement {
  public parent: NgCanvas;

  public x: number;
  public y: number;

  public x1 = 75;
  public x2 = 150;
  public x3 = 150;
  public y1 = 60;
  public y2 = 95;
  public y3 = 25;

  public fillStyle = 'red';

  private hovered = false;

  private callbackFunc: {
    hovered?: () => {};
    unhovered?: () => {};
  } = {};

  addEventListener(eventName: string, callbackFunc) {
    this.callbackFunc[eventName] = callbackFunc;
  }

  setNgProperty(name: string, value: any): void {
    this[name] = value;

    this.x && this.y && this.checkHover();

    this.parent.drawAll();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // context.fillRect(this.x, this.y, this.w, this.h);

    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.lineTo(this.x3, this.y3);
    ctx.fillStyle = this.fillStyle;
    ctx.fill();
  }

  private checkHover(): void {
    const x1 = this.x1;
    const x2 = this.x2;
    const x3 = this.x3;
    const y1 = this.y1;
    const y2 = this.y2;
    const y3 = this.y3;
    const x = this.x;
    const y = this.y;

    const d = [
      (x1 - x) * (y2 - y1) - (x2 - x1) * (y1 - y) > 0,
      (x2 - x) * (y3 - y2) - (x3 - x2) * (y2 - y) > 0,
      (x3 - x) * (y1 - y3) - (x1 - x3) * (y3 - y) > 0,
    ];

    const trues = d.every((v) => v === true);
    const falses = d.every((v) => v === false);

    const hovered = trues || falses;

    if (this.hovered !== hovered) {
      this.hovered = hovered;

      if (hovered) {
        this.fillStyle = 'green';
        this.callbackFunc.hovered();
      } else {
        this.fillStyle = 'red';
        this.callbackFunc.unhovered();
      }
    }
  }
}
