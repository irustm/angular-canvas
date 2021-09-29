import { Component, HostListener, OnInit } from '@angular/core';
import { CanvasComponent } from 'angular-canvas';

// tslint:disable-next-line:typedef
function getNewData() {
  const data = [];
  for (let i = 0; i < 1_000; i++) {
    data.push(Math.random() * 40 + 30);
  }
  return data;
}

@CanvasComponent
@Component({
  selector: 'app-graph-canvas-example',
  templateUrl: './graph-canvas-example.component.html',
  styleUrls: ['./graph-canvas-example.component.scss'],
})
export class GraphCanvasExampleComponent implements OnInit {
  public showData = false;

  public data = getNewData();
  public data2 = getNewData();
  public data3 = getNewData();

  public text = 'Hello world';
  public textX = 0;
  public textY = 0;

  public rectX = 20;
  public rectY = 20;

  public mouseX = 0;
  public mouseY = 0;

  public deltaX = 0;
  public step = 10;

  private ctrlPressed: boolean;

  @HostListener('mousemove', ['$event'])
  private onMouseMove(event: MouseEvent) {
    this.mouseX = event.offsetX;
    this.mouseY = event.offsetY;

    this.showData = true;
  }

  @HostListener('mousewheel', ['$event'])
  private onMouseWheel(event: WheelEvent) {
    event.preventDefault();
    if (this.ctrlPressed === true) {
      const step = this.step + event.deltaY / 100;

      if (step > 0.01) {
        const dxPoints = Math.abs(this.deltaX / this.step);
        const xPoints = Math.abs(this.mouseX / this.step);
        const leftPoints = dxPoints + xPoints;
        const dx = this.mouseX - leftPoints * step;

        this.deltaX = dx < 0 ? dx : 0;
        this.step = step;
      }
    } else {
      const deltaX = this.deltaX - event.deltaY;
      this.deltaX = deltaX < 0 ? deltaX : 0;
    }
  }

  @HostListener('window:keydown', ['$event'])
  private onKeyDown(event) {
    if (event.key === 'Control') {
      this.ctrlPressed = event.ctrlKey;
    }
  }

  @HostListener('window:keyup', ['$event'])
  private onKeyUp(event) {
    if (event.key === 'Control') {
      this.ctrlPressed = event.ctrlKey;
    }
  }

  @HostListener('mouseup')
  private onMouseOn() {
    this.showData = true;
  }

  @HostListener('mouseout')
  private onMouseOut() {
    this.showData = false;
  }

  constructor() {}

  ngOnInit(): void {
    setInterval(() => {
      this.data2 = getNewData();
      //
      this.rectX = Math.random() * 100;
      this.rectY = Math.random() * 100;
    }, 1000);
  }
}
