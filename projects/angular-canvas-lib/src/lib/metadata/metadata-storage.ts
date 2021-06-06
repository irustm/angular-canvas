import { NgCanvasElement } from '../components/ng-canvas-element';

export type Constructable<T> = new () => T;
export type NgComponentClass = Constructable<NgCanvasElement>;

declare global {
  interface Window {
    canvasRendererMetadataArgsStorage: MetadataArgsStorage;
  }
}

export function getMetadataArgsStorage(): MetadataArgsStorage {
  if (!window.canvasRendererMetadataArgsStorage) {
    window.canvasRendererMetadataArgsStorage = new MetadataArgsStorage();
  }

  return window.canvasRendererMetadataArgsStorage;
}

export class MetadataArgsStorage {
  public elements: Map<string, NgComponentClass> = new Map<
    string,
    NgComponentClass
  >();
}
