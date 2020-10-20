// tslint:disable-next-line:typedef
import { getMetadataArgsStorage } from '../metadata/metadata-storage';

// tslint:disable-next-line:typedef
export function CanvasElement(config: { selector: string }) {
  // tslint:disable-next-line:only-arrow-functions typedef
  return function (target) {
    getMetadataArgsStorage().elements.set(config.selector, target);
  };
}
