import { InjectionToken } from '@angular/core';

export interface CanvasRenderConfigModel {
  property: boolean;
}

export const DefaultCanvasRenderConfig: CanvasRenderConfigModel = {
  property: true,
};

export const CanvasRenderConfig = new InjectionToken<boolean>(
  'CanvasRenderConfig'
);
