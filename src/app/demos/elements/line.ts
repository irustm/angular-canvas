import {RendererStyleFlags2} from '@angular/core';
import {NgCanvas, NgCanvasElement, CanvasElement} from 'angular-canvas';

@CanvasElement({
  selector: 'line'
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

  appendChild(newChild: any): void {
  }

  addClass(name): void {
  }

  insertBefore(newChild: any, refChild: any): void {
  }

  removeAttribute(name: string, namespace?: string | null): void {
  }

  removeChild(oldChild: any): void {
    this.parent.removeChild(oldChild);
  }

  removeClass(name: string): void {
  }

  removeStyle(style: string, flags?: RendererStyleFlags2): void {
  }

  setNgAttribute(name: string, value: string, namespace?: string | null): void {
    this[name] = value;
    this.parent && this.parent.drawAll();
  }

  setNgProperty(name: string, value: any): void {
    this[name] = value;
    this.parent.drawAll();
  }

  setStyle(style: string, value: any, flags?: RendererStyleFlags2): void {
  }

  setValue(): void {
  }

  draw(context: CanvasRenderingContext2D): void {
    context.strokeStyle = this.strokeStyle;
    context.beginPath();
    context.moveTo(this.x1, this.y1);
    context.lineTo(this.x2, this.y2);
    context.stroke();
  }
}
