import { NgCanvasElement } from './ng-canvas-element';
import { NgZone, RendererStyleFlags2 } from '@angular/core';

function getArrayDrawingComponents(
  set: Set<NgCanvasElement>
): NgCanvasElement[] {
  return Array.from(set.values()).filter(
    (c: NgCanvasElement) => c && !!c.draw
  ) as NgCanvasElement[];
}

export class NgCanvas {
  public static nodeName = 'canvas';
  public readonly context: CanvasRenderingContext2D;
  public readonly element: HTMLCanvasElement;

  private requestId: number;

  public set parent(element) {
    // @ts-ignore
    this.resizeObserver = new ResizeObserver(([entry]) => {
      this.element.width = entry.contentRect.width;
      this.element.height = entry.contentRect.height;
      this.drawAll(false);
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

  constructor(private readonly ngZone: NgZone) {
    this.element = document.createElement('canvas');
    this.element.style.position = 'absolute';
    this.context = this.element.getContext('2d');

    this.ngZone.runOutsideAngular(() => {
      window.requestAnimationFrame((time) => this.draw(time));
    });
  }

  addClass(name): void {
    this.element.setAttribute('class', name);
  }

  appendChild(newChild: NgCanvasElement): void {
    this.componentSet.add(newChild);
    this.componentsDrawings = getArrayDrawingComponents(this.componentSet);
    this.drawAll();
  }

  removeChild(oldChild: NgCanvasElement): void {
    this.componentSet.delete(oldChild);
    this.componentsDrawings = getArrayDrawingComponents(this.componentSet);
    this.drawAll();
  }

  insertBefore(newChild: any, refChild: any): void {
    this.componentSet.add(newChild);
    this.componentsDrawings = getArrayDrawingComponents(this.componentSet);
    this.drawAll();
  }

  removeAttribute(name: string, namespace?: string | null): void {
    this.element.removeAttribute(name);
  }

  removeClass(name: string): void {
    this.element.classList.remove(name);
  }

  removeStyle(style: string, flags?: RendererStyleFlags2): void {
    // Not supported
  }

  setNgAttribute(name: string, value: string, namespace?: string | null): void {
    this.element.setAttribute(name, value);
  }

  setNgProperty(name: string, value: any): void {
    // Not supported
  }

  setStyle(style: string, value: any, flags?: RendererStyleFlags2): void {
    // Not supported
  }

  setValue(value: any): void {
    // Not supported
  }

  drawAll(clear?: boolean): void {
    this.ngZone.runOutsideAngular(() => {
      this.requestId && window.cancelAnimationFrame(this.requestId);
      this.requestId = window.requestAnimationFrame((time) =>
        this.draw(time, clear)
      );
    });
  }

  // @ts-ignore
  draw(time: number, clear: boolean = true): void {
    const context = this.context;
    if (clear) {
      context.clearRect(0, 0, this.element.width, this.element.height);
    }

    let needDraw = false;

    for (let i = 0; i < this.componentsDrawings.length; i++) {
      this.componentsDrawings[i].draw(context, time);
      needDraw = needDraw || this.componentsDrawings[i].needDraw;
    }

    if (needDraw) {
      this.requestId && window.cancelAnimationFrame(this.requestId);
      this.requestId = window.requestAnimationFrame((time) => this.draw(time));
    }
  }
}
