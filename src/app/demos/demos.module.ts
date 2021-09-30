import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasDomModule } from 'angular-canvas';
import { RouterModule } from '@angular/router';

import { GraphCanvasComponent } from './components/graph-canvas/graph-canvas.component';

import {
  NgText,
  NgRect,
  NgLine,
  NgGraph,
  NgGrid,
  TriangleElement,
} from './elements';
import { TriangleComponent } from './components/triangle/triangle.component';
import { ContainerComponent } from './container/container.component';

// @ts-ignore
@NgModule({
  declarations: [GraphCanvasComponent, ContainerComponent, TriangleComponent],
  imports: [
    CommonModule,
    CanvasDomModule.forRoot([
      NgText,
      NgRect,
      NgLine,
      NgGraph,
      NgGrid,
      TriangleElement,
    ]),
    RouterModule.forChild([
      {
        path: '',
        component: ContainerComponent,
      },
    ]),
  ],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class DemosModule {}
