import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameContainerComponent } from './game-container/game-container.component';
import { GameCanvasComponent } from './game-canvas/game-canvas.component';
import {RouterModule} from '@angular/router';
import {CanvasDomModule} from 'angular-canvas';



@NgModule({
  declarations: [GameContainerComponent, GameCanvasComponent],
  imports: [
    CommonModule,
    CanvasDomModule,
    RouterModule.forChild([
      {
        path: '',
        component: GameContainerComponent
      }
    ])
  ]
})
export class GameModule { }
