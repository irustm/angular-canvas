import { NgCanvas, NgCanvasElement, CanvasElement } from 'angular-canvas';

const STEP = 20;

@CanvasElement({
  selector: 'grid',
})
export class NgGrid implements NgCanvasElement {
  public parent: NgCanvas;

  // NG Attributes
  public data: number[];
  public deltaX = 0;
  public lineWidth = 1;

  public step = STEP;
  public horizontal = false;

  // Attributes
  public strokeStyle = 'gray';

  removeChild(oldChild: any): void {
    this.parent.removeChild(oldChild);
  }

  setNgAttribute(name: string, value: string, namespace?: string | null): void {
    this[name] = value;
    this.parent && this.parent.drawAll();
  }

  setNgProperty(name: string, value: any): void {
    this[name] = value;
    this.parent.drawAll();
  }

  draw(context: CanvasRenderingContext2D): void {
    const viewWidth = this.parent.element.width;
    const viewHeight = this.parent.element.height;

    const deltaX = this.deltaX;
    const step = this.step;

    const dxPointsCount = Math.floor(Math.abs(deltaX / step));
    const viewPointsCount = Math.floor(Math.abs(viewHeight / step));

    context.beginPath();

    for (let value = dxPointsCount; value <= viewPointsCount; value += step) {
      const y = Math.round(value);
      context.moveTo(0, deltaX + y);
      context.lineTo(viewWidth, deltaX + y);
    }

    // draw vertical lines
    const quant = 5;
    const m = (viewWidth - 1) / (quant - 1);
    for (let i = 0; i < quant; ++i) {
      const x = Math.round(m * i);
      context.moveTo(x, 0);
      context.lineTo(x, viewHeight);
    }

    // styling this component
    context.lineWidth = this.lineWidth;
    context.strokeStyle = this.strokeStyle;
    context.stroke();
  }
}
