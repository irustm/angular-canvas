import { NgCanvas, NgCanvasElement, CanvasElement } from 'angular-canvas';

@CanvasElement({
  selector: 'background',
})
export class NgBackground implements NgCanvasElement {
  public parent: NgCanvas;
  public needDraw: boolean;

  public y: number;
  public height: number;
  public width: number;

  setNgProperty(name: string, value: any): void {
    this[name] = value;
    this.parent.drawAll();
  }

  draw(context: CanvasRenderingContext2D, time: number): void {
    this.width = this.parent.width;
    this.height = this.parent.height;

    context.fillStyle = '#abddff';
    context.fillRect(0, 0, this.width, this.height / 1.5);

    context.fillStyle = '#a1ebfe';
    context.fillRect(0, 0, this.width, this.height / 1.8);

    context.fillStyle = '#adf8ff';
    context.fillRect(0, 0, this.width, this.height / 2.2);

    context.fillStyle = '#b3fcfe';
    context.fillRect(0, 0, this.width, this.height / 2.6);

    context.fillStyle = '#d0fef9';
    context.fillRect(0, 0, this.width, this.height / 3);

    context.fillStyle = '#ffffff';

    context.beginPath();
    context.arc(
      Math.ceil(this.height / 5),
      Math.ceil(this.height / 6),
      Math.ceil(this.height / 15),
      0,
      2 * Math.PI,
      false
    );
    context.fill();
  }
}
