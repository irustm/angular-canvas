import { NgCanvasElement } from './ng-canvas-element';
import { RendererStyleFlags2 } from '@angular/core';

function getArrayDrawingComponents(
  set: Set<NgCanvasElement>
): NgCanvasElement[] {
  return Array.from(set.values()).filter(
    (c: NgCanvasElement) => c && !!c.draw
  ) as NgCanvasElement[];
}

export class NgCanvas implements NgCanvasElement {
  public static nodeName = 'canvas';
  public readonly context: CanvasRenderingContext2D;
  public readonly element: HTMLCanvasElement;

  public set parent(element) {
    // @ts-ignore
    this.resizeObserver = new ResizeObserver(([entry]) => {
      this.element.width = entry.contentRect.width;
      this.element.height = entry.contentRect.height;
      this.drawAll();
    });

    this.resizeObserver.observe(element);
  }

  // tslint:disable-next-line:typedef
  public get parent() {
    return this._parent;
  }

  // tslint:disable-next-line:variable-name
  private _parent: any;

  private readonly componentSet = new Set<NgCanvasElement>();
  private componentsDrawings: NgCanvasElement[] = [];

  // @ts-ignore
  private resizeObserver: ResizeObserver;

  constructor() {
    this.element = document.createElement('canvas');
    this.element.style.position = 'absolute';
    this.context = this.element.getContext('2d');

    window.requestAnimationFrame((time) => this.draw(time));
  }

  addClass(name): void {
    this.element.setAttribute('class', name);
  }

  appendChild(newChild: NgCanvasElement): void {
    this.componentSet.add(newChild);
    this.componentsDrawings = getArrayDrawingComponents(this.componentSet);
  }

  removeChild(oldChild: NgCanvasElement): void {
    this.componentSet.delete(oldChild);
    this.componentsDrawings = getArrayDrawingComponents(this.componentSet);
  }

  insertBefore(newChild: any, refChild: any): void {
    this.componentSet.add(newChild);
    this.componentsDrawings = getArrayDrawingComponents(this.componentSet);
  }

  removeAttribute(name: string, namespace?: string | null): void {}

  removeClass(name: string): void {}

  removeStyle(style: string, flags?: RendererStyleFlags2): void {}

  setNgAttribute(name: string, value: string, namespace?: string | null): void {
    this.element.setAttribute(name, value);
  }

  setNgProperty(name: string, value: any): void {}

  setStyle(style: string, value: any, flags?: RendererStyleFlags2): void {}

  setValue(value: any): void {}

  drawAll(): void {
    window.requestAnimationFrame((time) => this.draw(time));
  }

  // @ts-ignore
  draw(time: number): void {
    const context = this.context;
    context.clearRect(0, 0, this.element.width, this.element.height);

    let needDraw = false;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.componentsDrawings.length; i++) {
      this.componentsDrawings[i].draw(context, time);
      needDraw = needDraw || this.componentsDrawings[i].needDraw;
    }

    if (needDraw) {
      // tslint:disable-next-line:no-shadowed-variable
      window.requestAnimationFrame((time) => this.draw(time));
    }
  }
}
