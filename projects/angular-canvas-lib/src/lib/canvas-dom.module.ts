import {
  APP_ID,
  NgModule,
  NgZone,
  NO_ERRORS_SCHEMA,
  RendererFactory2,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasDomRendererFactory } from './canvas-dom-renderer';
import {
  EventManager,
  ɵDomSharedStylesHost as DomSharedStylesHost,
} from '@angular/platform-browser';
import { NgComponentClass } from './metadata/metadata-storage';

@NgModule({
  imports: [CommonModule],
  providers: [
    {
      provide: RendererFactory2,
      useClass: CanvasDomRendererFactory,
      deps: [EventManager, DomSharedStylesHost, APP_ID, NgZone],
    },
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class CanvasDomModule {
  // tslint:disable-next-line:typedef
  public static forRoot(elements: NgComponentClass[]) {
    return {
      ngModule: CanvasDomModule,
    };
  }
}
