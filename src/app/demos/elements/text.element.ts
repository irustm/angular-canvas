import { NgCanvas, CanvasElement, NgCanvasElement } from 'angular-canvas';

@CanvasElement({
  selector: 'text',
})
export class NgText implements NgCanvasElement {
  public parent: NgCanvas;
  public text = '';
  public x = 0;
  public y = 20;
  public fillStyle = 'black';

  constructor() {}

  removeChild(oldChild: any): void {
    this.parent.removeChild(oldChild);
  }

  setNgAttribute(name: string, value: string, namespace?: string | null): void {
    this[name] = value;
  }

  setNgProperty(name: string, value: any): void {
    this[name] = value;
  }

  draw(context: CanvasRenderingContext2D): void {
    if (this.text && this.x && this.y) {
      context.fillStyle = this.fillStyle;
      context.fillText(this.text, this.x, this.y);
    }
  }
}
