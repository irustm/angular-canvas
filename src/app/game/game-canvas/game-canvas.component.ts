import {Component, ElementRef, HostListener, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {CanvasComponent} from '../../../../projects/canvas-dom-renderer/src/lib/decorators/canvas-component';
import {interval, Subscription} from 'rxjs';
import {NgUnit} from '../elements';

const STEP = 35;

@CanvasComponent
@Component({
  selector: 'app-game-canvas',
  templateUrl: './game-canvas.component.html',
  styleUrls: ['./game-canvas.component.scss']
})
export class GameCanvasComponent implements OnInit {

  public unitX = 10;
  public catSpriteIndex = 0;
  public revert = false;

  @ViewChild('cat') cat: ElementRef<NgUnit>;

  @HostListener('document:keydown.arrowright', ['$event'])
  onKeyDownRight(event: KeyboardEvent) {
    if (!this.cat.nativeElement.needDraw && this.revert === false) {
      this.unitX += STEP;
    }

    this.revert = false;
  }
  @HostListener('document:keydown.arrowleft', ['$event'])
  onKeyDownLeft(event: KeyboardEvent) {
    if (!this.cat.nativeElement.needDraw && this.revert === true) {
      this.unitX -= STEP;
    }

    this.revert = true;


  }

  private subscription = new Subscription();

  constructor() { }

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
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
