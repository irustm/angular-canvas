import {NgCanvasElement} from '../../../../projects/angular-canvas-lib/src/lib/components/ng-canvas-element';
import {RendererStyleFlags2} from '@angular/core';
import {NgCanvas, CanvasElement} from 'angular-canvas';

@CanvasElement({
  selector: 'text'
})
export class NgText implements NgCanvasElement {
  public parent: NgCanvas;
  public text = '';
  public x = 0;
  public y = 20;
  public fillStyle = 'black';

  constructor() {}

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
  }

  setNgProperty(name: string, value: any): void {
    this[name] = value;
  }

  setStyle(style: string, value: any, flags?: RendererStyleFlags2): void {
  }

  setValue(value: any): void {
  }

  draw(context: CanvasRenderingContext2D): void {
    if (this.text && this.x && this.y) {
      context.fillStyle = this.fillStyle;
      context.fillText(this.text, this.x, this.y);
    }
  }
}
