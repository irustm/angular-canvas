import {NgCanvasElement} from '../components/ng-canvas-element';

export type Constructable<T> = new () => T;
export type NgComponentClass = Constructable<NgCanvasElement>;

const global: any = {};

export function getMetadataArgsStorage(): MetadataArgsStorage {
  if (!(global as any).canvasRendererMetadataArgsStorage) {
    (global as any).canvasRendererMetadataArgsStorage =
      new MetadataArgsStorage();
  }

  return (global as any).canvasRendererMetadataArgsStorage;
}

export class MetadataArgsStorage {
  public elements: Map<string, NgComponentClass> = new Map<string,
    NgComponentClass>();
}
