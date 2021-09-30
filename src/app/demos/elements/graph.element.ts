import { RendererStyleFlags2 } from '@angular/core';
import { NgCanvas, NgCanvasElement, CanvasElement } from 'angular-canvas';

const STEP = 5;
const SMOOTH = 30;

@CanvasElement({
  selector: 'graph-line',
})
export class NgGraph implements NgCanvasElement {
  public parent: NgCanvas;
  public needDraw: boolean;

  // NG Attributes
  public data: number[];
  public deltaX = 0;
  public lineWidth = 1;
  public min = 0;
  public max = 100;

  public step = STEP;
  public horizontal = true;

  // Attributes
  public strokeStyle = 'black';

  private oldData: number[];
  private waypointsData: number[][];

  private animationBlock = 1;

  setNgProperty(name: string, value: any): void {
    if (name === 'data') {
      if (this.data) {
        this.oldData = this.data.slice();
      }
      this.data = value;

      // Init data
      const oldData = this.oldData || new Array(this.data.length).fill(0);
      this.waypointsData = calcWaypoints(oldData, this.data);
      this.animationBlock = 1;
    } else {
      this[name] = value;
    }

    this.parent.drawAll();
  }

  setStyle(style: string, value: any, flags?: RendererStyleFlags2): void {}

  draw(context: CanvasRenderingContext2D): void {
    if (this.data && this.data.length) {
      context.strokeStyle = this.strokeStyle;
      const numberOfBlock = this.animationBlock;

      const index: number = this.waypointsData[numberOfBlock]
        ? numberOfBlock
        : this.waypointsData.length - 1;
      const currentLines = this.waypointsData[index];
      this.drawAnimate(context, currentLines);
      this.animationBlock++;

      this.needDraw = numberOfBlock < SMOOTH;
    }
  }

  // tslint:disable-next-line:typedef
  private drawAnimate(
    context: CanvasRenderingContext2D,
    currentLines: number[]
  ) {
    const deltaX = this.deltaX;
    const step = this.step;

    const dxPointsCount = Math.floor(Math.abs(deltaX / step));
    const viewPointsCount = Math.floor(
      Math.abs(this.getAxisSize(!this.horizontal) / step)
    );
    const viewLines = currentLines.slice(
      dxPointsCount,
      dxPointsCount + viewPointsCount
    );

    const kY = this.getAxisSize(this.horizontal) / (this.max - this.min);
    const horizontal = this.horizontal;

    context.lineWidth = this.lineWidth;
    context.beginPath();

    for (let i = 0; i < viewLines.length; i++) {
      const x = deltaX + (dxPointsCount + i) * step;
      horizontal
        ? context.lineTo(x, viewLines[i] * kY)
        : context.lineTo(viewLines[i] * kY, x);
    }

    context.stroke();
  }

  private getAxisSize(horizontal: boolean) {
    const viewWidth = this.parent.element.width;
    const viewHeight = this.parent.element.height;

    return (horizontal ? viewHeight : viewWidth) / window.devicePixelRatio || 1;
  }
}

// TODO optimize it with one
// calc waypoints traveling
// tslint:disable-next-line:typedef
function calcWaypoints(oldData: number[], newData: number[]) {
  const waypoints = [];

  const dataPoints = [];

  for (let i = 0; i < oldData.length; i++) {
    const pt0 = oldData[i];
    const pt1 = newData[i];
    const dx = pt1 - pt0;

    const points = [];

    for (let j = 0; j < SMOOTH; j++) {
      const x = pt0 + (dx * j) / SMOOTH;
      points.push(x || 0);
    }

    dataPoints.push(points);
  }

  for (let j = 0; j < SMOOTH; j++) {
    const data = [];
    for (let i = 0; i < oldData.length; i++) {
      data.push(dataPoints[i][j]);
    }
    waypoints.push(data);
  }

  return waypoints;
}
