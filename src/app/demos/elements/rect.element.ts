import { RendererStyleFlags2 } from '@angular/core';
import { NgCanvas, NgCanvasElement, CanvasElement } from 'angular-canvas';

@CanvasElement({
  selector: 'rect',
})
export class NgRect implements NgCanvasElement {
  public parent: NgCanvas;

  public x: number;
  public y: number;
  public w: number;
  public h: number;
  public fillStyle = 'black';

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
    context.fillRect(this.x, this.y, this.w, this.h);
  }
}
