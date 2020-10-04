import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CanvasDomModule} from 'angular-canvas';
import {RouterModule} from '@angular/router';

import {GraphCanvasExampleComponent} from './graph-canvas/graph-canvas-example.component';
import {GraphExampleComponent} from './graph-example/graph-example.component';

import {NgText, NgRect, NgLine, NgGraph, NgGrid} from './elements';

// @ts-ignore
@NgModule({
  declarations: [GraphCanvasExampleComponent, GraphExampleComponent],
  imports: [
    CommonModule,
    CanvasDomModule.forRoot([
      NgText,
      NgRect,
      NgLine,
      NgGraph,
      NgGrid
    ]),
    RouterModule.forChild([{
      path: '',
      component: GraphExampleComponent
    }])
  ],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA]
})
export class GraphExampleModule {
}
