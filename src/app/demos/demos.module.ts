import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasDomModule } from 'angular-canvas';
import { RouterModule } from '@angular/router';

import { GraphCanvasComponent } from './graph-canvas/graph-canvas.component';
import { GraphContainerComponent } from './graph-container/graph-container.component';

import { NgText, NgRect, NgLine, NgGraph, NgGrid } from './elements';

// @ts-ignore
@NgModule({
  declarations: [GraphCanvasComponent, GraphContainerComponent],
  imports: [
    CommonModule,
    CanvasDomModule.forRoot([NgText, NgRect, NgLine, NgGraph, NgGrid]),
    RouterModule.forChild([
      {
        path: '',
        component: GraphContainerComponent,
      },
    ]),
  ],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class DemosModule {}
