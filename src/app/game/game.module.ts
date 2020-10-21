import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameContainerComponent } from './game-container/game-container.component';
import { GameCanvasComponent } from './game-canvas/game-canvas.component';
import { RouterModule } from '@angular/router';
import { CanvasDomModule } from 'angular-canvas';
import { NgCat } from './elements';
import { NgBackground } from './elements/background.element';
import { NgCactus } from './elements/cactus.element';
import { NgLogo } from './elements/angular-logo.element';

@NgModule({
  declarations: [GameContainerComponent, GameCanvasComponent],
  imports: [
    CommonModule,
    CanvasDomModule.forRoot([NgCat, NgBackground, NgCactus, NgLogo]),
    RouterModule.forChild([
      {
        path: '',
        component: GameContainerComponent,
      },
    ]),
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class GameModule {}
