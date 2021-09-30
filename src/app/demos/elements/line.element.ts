import { NgCanvas, NgCanvasElement, CanvasElement } from 'angular-canvas';

@CanvasElement({
  selector: 'line',
})
export class NgLine implements NgCanvasElement {
  public parent: NgCanvas;

  // NG Attributes
  public x1: number;
  public y1: number;
  public x2: number;
  public y2: number;

  // Attributes
  public strokeStyle = 'black';

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
    context.strokeStyle = this.strokeStyle;
    context.beginPath();
    context.moveTo(this.x1, this.y1);
    context.lineTo(this.x2, this.y2);
    context.stroke();
  }
}
