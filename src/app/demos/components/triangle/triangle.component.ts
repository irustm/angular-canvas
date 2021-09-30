import { Component, HostListener } from '@angular/core';
import { CanvasComponent } from 'angular-canvas';

@CanvasComponent
@Component({
  selector: 'app-triangle',
  templateUrl: './triangle.component.html',
  styleUrls: ['./triangle.component.scss'],
})
export class TriangleComponent {
  public mouseX = 0;
  public mouseY = 0;

  public isHovered = false;

  @HostListener('mousemove', ['$event'])
  private onMouseMove(event: MouseEvent) {
    this.mouseX = event.offsetX;
    this.mouseY = event.offsetY;
  }

  public hover(value: boolean) {
    this.isHovered = value;
  }
}
