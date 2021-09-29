import { NgCanvas } from './ng-canvas';
import { RendererStyleFlags2 } from '@angular/core';

export interface NgCanvasElement {
  style?: CSSStyleDeclaration;
  classList?: DOMTokenList;
  needDraw?: boolean;
  parent: NgCanvas;

  onInit?(context: CanvasRenderingContext2D): void;

  onDestroy?(context: CanvasRenderingContext2D): void;

  draw(context: CanvasRenderingContext2D, time?: number): void;

  appendChild?(newChild: any): void;

  addClass?(name): void;

  insertBefore?(newChild: any, refChild: any): void;

  setNgAttribute?(name: string, value: string, namespace?: string | null): void;

  setAttribute?(name: string, value: string, namespace?: string | null): void;

  setNgProperty?(name: string, value: any): void;

  setStyle?(style: string, value: any, flags?: RendererStyleFlags2): void;

  setValue?(value: any): void;

  removeAttribute?(name: string, namespace?: string | null): void;

  removeChild?(oldChild: any): void;

  removeClass?(name: string): void;

  removeStyle?(style: string, flags?: RendererStyleFlags2): void;

  setAttributeNS?(namespaceUri: string, name: string, value: string): void;

  removeAttributeNS?(namespaceUri: string, name: string): void;
}

export interface NgAttributeCanvasElement {
  setNgAttribute(name: string, value: string, namespace?: string | null): void;

  removeAttribute(name: string, namespace?: string | null): void;
}

export interface NgPropertyCanvasElement {
  setNgProperty(name: string, value: any): void;
}
