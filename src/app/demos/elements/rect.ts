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

  appendChild(newChild: any): void {}
  addClass(name): void {}

  insertBefore(newChild: any, refChild: any): void {}

  removeAttribute(name: string, namespace?: string | null): void {}

  removeChild(oldChild: any): void {
    this.parent.removeChild(oldChild);
  }

  removeClass(name: string): void {}

  removeStyle(style: string, flags?: RendererStyleFlags2): void {}

  setNgAttribute(name: string, value: string, namespace?: string | null): void {
    this[name] = value;
    this.parent && this.parent.drawAll();
  }

  setNgProperty(name: string, value: any): void {
    this[name] = value;
    this.parent.drawAll();
  }

  setStyle(style: string, value: any, flags?: RendererStyleFlags2): void {}

  setValue(): void {}

  draw(context: CanvasRenderingContext2D): void {
    context.fillRect(this.x, this.y, this.w, this.h);
  }
}
