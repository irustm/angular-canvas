import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GraphCanvasExampleComponent} from './graph-canvas/graph-canvas-example.component';
import {CanvasDomModule} from 'angular-canvas';
import {GraphExampleComponent} from './graph-example/graph-example.component';
import {NgText} from './elements/text';
import {NgRect} from './elements/rect';
import {NgLine} from './elements/line';
import {NgGraph} from './elements/graph';
import {NgGrid} from './elements/grid';
import {RouterModule} from '@angular/router';

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
      NgGrid]),
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
