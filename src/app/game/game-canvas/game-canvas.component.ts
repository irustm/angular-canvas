import {Component, ElementRef, HostListener, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {CanvasComponent} from '../../../../projects/canvas-dom-renderer/src/lib/decorators/canvas-component';
import {interval, Subscription} from 'rxjs';
import {NgCat} from '../elements';

@CanvasComponent
@Component({
  selector: 'app-game-canvas',
  templateUrl: './game-canvas.component.html',
  styleUrls: ['./game-canvas.component.scss']
})
export class GameCanvasComponent implements OnInit {

  public unitY = 10;
  public unitX = 10;
  public catSpriteIndex = 0;
  public revert = false;
  public rightPressed = false;
  public leftPressed = false;
  public downPressed = false;

  @ViewChild('cat') cat: ElementRef<NgCat>;

  @HostListener('document:keydown.arrowright', ['$event'])
  onKeyDownRight(event: KeyboardEvent) {
      this.rightPressed = true;
      this.revert = false;
  }

  @HostListener('document:keyup.arrowright', ['$event'])
  onKeyUpRight(event: KeyboardEvent) {
      this.rightPressed = false;
  }


  @HostListener('document:keydown.arrowleft', ['$event'])
  onKeyDownLeft(event: KeyboardEvent) {
      this.leftPressed = true;
      this.revert = true;
  }

  @HostListener('document:keyup.arrowleft', ['$event'])
  onKeyUpLeft(event: KeyboardEvent) {
    this.leftPressed = false;
  }

  @HostListener('document:keydown.arrowdown', ['$event'])
  onKeyDownDown(event: KeyboardEvent) {
    this.downPressed = true;
  }

  @HostListener('document:keyup.arrowdown', ['$event'])
  onKeyUpDown(event: KeyboardEvent) {
    this.downPressed = false;
  }

  private subscription = new Subscription();

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {
  }

  ngOnInit(): void {
    let d = 1;
    this.subscription.add(interval(500).subscribe(() => {
      if (this.catSpriteIndex > 2) {
        d = -1;
      } else if (this.catSpriteIndex <= 0) {
        d = 1;
      }

      this.catSpriteIndex += d;
    }));

    this.unitY =  Math.floor(this.elementRef.nativeElement.offsetHeight / 1.35);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
