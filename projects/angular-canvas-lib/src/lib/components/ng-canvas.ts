import { NgCanvasElement } from './ng-canvas-element';
import { NgZone, RendererStyleFlags2 } from '@angular/core';
import { CanvasRenderConfigModel } from '../tokens/canvas-resize-obserer-enable-token';

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

  public get width(): number {
    return this._width;
  }

  public get height(): number {
    return this._height;
  }

  private requestId: number;
  private _width: number;
  private _height: number;
  private _parentElement: HTMLCanvasElement;

  public set parent(element) {
    this._parentElement = element;
    this.subResizeEvent();
  }

  private subResizeEvent() {
    this._parentElement &&
      this.resizeObserver &&
      this.resizeObserver.unobserve(this._parentElement);

    // @ts-ignore
    this.resizeObserver = new ResizeObserver(([entry]) => {
      const dpr: number = window.devicePixelRatio || 1;

      let width = entry.contentRect.width;
      let height = entry.contentRect.height;

      if (width && height) {
        width = parseInt(String(width), 10);
        height = parseInt(String(height), 10);
      }

      let resizeDetected = false;

      if (this._width !== width) {
        this._width = width;
        this.element.width = width * dpr;
        this.element.style.width = width + 'px';
        resizeDetected = true;
      }

      if (this._height !== height) {
        this._height = height;
        this.element.height = height * dpr;
        this.element.style.height = height + 'px';
        resizeDetected = true;
      }

      if (resizeDetected) {
        if (dpr !== 1) {
          this.context.scale(dpr, dpr);
        }

        this.drawWithoutRequestAnimation();
      }
    });

    this.resizeObserver.observe(this._parentElement);
  }

  public resetCanvasSize() {
    const dpr: number = window.devicePixelRatio || 1;
    this.element.width = this._width * dpr;
    this.element.style.width = this._width + 'px';

    this.element.height = this._height * dpr;
    this.element.style.height = this._height + 'px';
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

  constructor(
    private readonly ngZone: NgZone,
    private readonly config: CanvasRenderConfigModel
  ) {
    this.element = document.createElement('canvas');
    this.element.style.position = 'absolute';
    this.context = this.element.getContext('2d');

    this._height = this.element.height;
    this._width = this.element.width;

    this.ngZone.runOutsideAngular(() => {
      window.requestAnimationFrame((time) => this.draw(time));
    });
  }

  // tslint:disable-next-line:typedef
  destroy() {
    this.resizeObserver &&
      this._parentElement &&
      this.resizeObserver.unobserve(this._parentElement);
    this.componentSet.clear();
    this.componentsDrawings = null;
    this.element && this.element.remove();
  }

  addClass(name): void {
    this.element.setAttribute('class', name);
  }

  appendChild(newChild: NgCanvasElement): void {
    newChild.onInit && newChild.onInit(this.context);
    this.componentSet.add(newChild);
    this.componentsDrawings = getArrayDrawingComponents(this.componentSet);
    this.drawAll();
  }

  removeChild(oldChild: NgCanvasElement): void {
    oldChild.onDestroy && oldChild.onDestroy(this.context);
    this.componentSet.delete(oldChild);
    this.componentsDrawings = getArrayDrawingComponents(this.componentSet);
    this.drawAll();
  }

  insertBefore(newChild: any, refChild: any): void {
    this.componentSet.add(newChild);
    this.componentsDrawings = getArrayDrawingComponents(this.componentSet);
    this.drawAll();
  }

  recalculateElementsDraw(): void {
    this.componentsDrawings = getArrayDrawingComponents(this.componentSet);
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

  setAttribute(name: string, value: string): void {
    this.element.setAttribute(name, value);
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
      this.requestId = window.requestAnimationFrame((time) => {
        this.draw(time, clear);
        this.requestId = null;
      });
    });
  }

  private drawWithoutRequestAnimation(): void {
    this.ngZone.runOutsideAngular(() => {
      this.draw(0, false);
      this.requestId = null;
    });
  }

  // @ts-ignore
  draw(time: number, clear = true): void {
    const context = this.context;
    if (clear) {
      context.clearRect(0, 0, this.width, this.height);
    }

    let needDraw = false;

    const elementsCount =
      this.componentsDrawings && this.componentsDrawings.length;

    if (elementsCount) {
      for (let i = 0; i < elementsCount; i++) {
        this.componentsDrawings[i].draw(context, time);
        needDraw = this.componentsDrawings[i]?.needDraw !== undefined ? this.componentsDrawings[i].needDraw : needDraw;
      }

      if (needDraw) {
        this.requestId && window.cancelAnimationFrame(this.requestId);
        this.requestId = window.requestAnimationFrame((time) =>
          this.draw(time)
        );
      }
    }
  }
}
