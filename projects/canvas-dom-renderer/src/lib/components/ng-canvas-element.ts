import {RendererStyleFlags2} from '@angular/core';
import {NgCanvas} from './ng-canvas';

export interface NgCanvasElement {
  needDraw?: boolean;
  parent: NgCanvas;

  appendChild(newChild: any): void;

  addClass(name): void;

  insertBefore(newChild: any, refChild: any): void;

  setNgAttribute(name: string, value: string, namespace?: string | null): void;

  setNgProperty(name: string, value: any): void;

  setStyle(style: string, value: any, flags?: RendererStyleFlags2): void;

  setValue(value: any): void;

  removeAttribute(name: string, namespace?: string | null): void;

  removeChild(oldChild: any): void;

  removeClass(name: string): void;

  removeStyle(style: string, flags?: RendererStyleFlags2): void;

  draw(context: CanvasRenderingContext2D): void;
}
