import {NgCanvas, NgCanvasElement, CanvasElement} from 'angular-canvas';

const CAT_SIZE = 6;
const CAT_HEIGHT = 11;

@CanvasElement({
  selector: 'background'
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
    this.width = this.parent.element.width;
    this.height = this.parent.element.height;

    context.fillStyle = '#80b4cc';
    context.fillRect(0, 0, this.width, this.height / 1.5);
    context.fillStyle = '#60b4cc';
    context.fillRect(0, 100, this.width, 150);
    context.fillStyle = '#40b4cc';
    context.fillRect(0, 150, this.width, 50);
    context.fillStyle = '#87cad9';
    context.fillRect(0, 250, this.width, 50);
    context.fillStyle = '#FFF';

    context.beginPath();
    context.arc(Math.ceil(this.height / 5), Math.ceil(this.height / 6), Math.ceil(this.height / 15), 0, 2 * Math.PI, false);
    context.fill();

    // context.fillStyle = '#FFF';
    // context.beginPath();
    // context.arc(150, 150, 150, 0, 2 * Math.PI, false);
    // context.arc(250, 250, 150, 0, 2 * Math.PI, false);
    // context.arc(150, 350, 150, 0, 2 * Math.PI, false);
    // context.arc(450, 550, 150, 0, 2 * Math.PI, false);
    // context.arc(150, 550, 150, 0, 2 * Math.PI, false);
    // context.fill();
  }
}
