import {
  Inject,
  Injectable,
  NgZone,
  Renderer2,
  RendererFactory2,
  RendererStyleFlags2,
  RendererType2,
  ViewEncapsulation,
} from '@angular/core';
import { NgCanvasElement } from './components/ng-canvas-element';
import { NgCanvas } from './components/ng-canvas';
import {
  EventManager,
  ɵDomSharedStylesHost as DomSharedStylesHost,
} from '@angular/platform-browser';
import {
  DefaultDomRenderer2,
  EmulatedEncapsulationDomRenderer2,
  ShadowDomRenderer,
} from './default-dom-renderer';
import {
  flattenStyles,
  NAMESPACE_URIS,
  shimContentAttribute,
  shimHostAttribute,
} from './renderer-utils';
import { getMetadataArgsStorage } from './metadata/metadata-storage';
import {
  CanvasRenderConfig,
  CanvasRenderConfigModel,
} from './tokens/canvas-resize-obserer-enable-token';

@Injectable()
export class CanvasDomRendererFactory implements RendererFactory2 {
  private rendererByCompId = new Map<string, Renderer2>();
  private defaultRenderer: Renderer2;

  constructor(
    private readonly eventManager: EventManager,
    private readonly sharedStylesHost: DomSharedStylesHost,
    private readonly appId: string,
    private readonly ngZone: NgZone,
    @Inject(CanvasRenderConfig)
    private readonly canvasConfig: CanvasRenderConfigModel
  ) {
    this.defaultRenderer = new DefaultDomRenderer2(eventManager);
  }

  end() {}

  createRenderer(element: any, type: RendererType2 | null): Renderer2 {
    if (!element || !type) {
      return this.defaultRenderer;
    }

    // @ts-ignore
    if (type['type'] && type['type'].isCanvasComponent) {
      let renderer = this.rendererByCompId.get(type.id);

      if (!renderer) {
        renderer = new CanvasRenderer(
          this.eventManager,
          this.sharedStylesHost,
          type,
          this.appId,
          this.ngZone,
          this.canvasConfig
        );
        this.rendererByCompId.set(type.id, renderer);
      }
      (renderer as CanvasRenderer).applyToHost(element);
      return renderer;
    }

    switch (type.encapsulation) {
      case ViewEncapsulation.Emulated: {
        let renderer = this.rendererByCompId.get(type.id);
        if (!renderer) {
          renderer = new EmulatedEncapsulationDomRenderer2(
            this.eventManager,
            this.sharedStylesHost,
            type,
            this.appId
          );
          this.rendererByCompId.set(type.id, renderer);
        }
        (renderer as EmulatedEncapsulationDomRenderer2).applyToHost(element);
        return renderer;
      }
      case ViewEncapsulation.ShadowDom:
        return new ShadowDomRenderer(
          this.eventManager,
          this.sharedStylesHost,
          element,
          type
        );

      default: {
        if (!this.rendererByCompId.has(type.id)) {
          const styles = flattenStyles(type.id, type.styles, []);
          this.sharedStylesHost.addStyles(styles);
          this.rendererByCompId.set(type.id, this.defaultRenderer);
        }
        return this.defaultRenderer;
      }
    }
  }
}

export class CanvasRenderer implements Renderer2 {
  private contentAttr: string;
  private hostAttr: string;
  private readonly canvasElements = getMetadataArgsStorage().elements;

  readonly data: { [p: string]: any };
  destroyNode: ((node: any) => void) | null;

  constructor(
    eventManager: EventManager,
    sharedStylesHost: DomSharedStylesHost,
    private component: RendererType2,
    appId: string,
    private ngZone: NgZone,
    private config
  ) {
    const styles = flattenStyles(
      appId + '-' + component.id,
      component.styles,
      []
    );
    sharedStylesHost.addStyles(styles);

    this.contentAttr = shimContentAttribute(appId + '-' + component.id);
    this.hostAttr = shimHostAttribute(appId + '-' + component.id);
  }

  // tslint:disable-next-line:typedef
  applyToHost(element: any) {
    this.setAttribute(element, this.hostAttr, '');
  }

  createElement(name: string, namespace?: string | null): any {
    const Component = this.canvasElements.get(name);

    if (Component) {
      return new Component();
    } else if (name === 'canvas') {
      const canvas = new NgCanvas(this.ngZone, this.config);
      canvas.element.setAttribute(this.contentAttr, '');
      return canvas;
    } else {
      let element;
      if (namespace) {
        // In cases where Ivy (not ViewEngine) is giving us the actual namespace, the look up by key
        // will result in undefined, so we just return the namespace here.
        element = document.createElementNS(
          NAMESPACE_URIS[namespace] || namespace,
          name
        );
      } else {
        element = document.createElement(name);
      }

      this.setAttribute(element, this.contentAttr, '');
      return element;
    }
  }

  createText(value: string): any {
    return document.createTextNode(value);
  }

  selectRootElement(selectorOrNode: any, preserveContent?: boolean): any {
    const el: any =
      typeof selectorOrNode === 'string'
        ? document.querySelector(selectorOrNode)
        : selectorOrNode;
    if (!el) {
      throw new Error(
        `The selector "${selectorOrNode}" did not match any elements`
      );
    }
    if (!preserveContent) {
      el.textContent = '';
    }
    return el;
  }

  addClass(el: NgCanvasElement, name: string): void {
    if (el.classList) {
      el.classList.add(name);
    } else {
      el.addClass(name);
    }
  }

  removeClass(el: NgCanvasElement, name: string): void {
    if (el.classList) {
      el.classList.add(name);
    } else {
      el.removeClass(name);
    }
  }

  appendChild(parent: NgCanvasElement, newChild: NgCanvasElement): void {
    // parent.appendChild(newChild);
    if (!newChild) {
      return;
    }
    newChild.parent = parent as any;

    if (newChild instanceof NgCanvas) {
      parent.appendChild((newChild as NgCanvas).element);
    } else {
      parent.appendChild(newChild);
    }
  }

  removeChild(parent: NgCanvasElement, oldChild): void {
    // tslint:disable-next-line:no-unused-expression
    oldChild.destroy && oldChild.destroy();
    if (parent) {
      parent.removeChild(oldChild);
    }
    if (oldChild && oldChild.parent instanceof NgCanvas) {
      oldChild.parent.removeChild(oldChild);
    }
  }

  createComment(value: string): any {
    return document.createComment(value);
  }

  destroy(): void {}

  insertBefore(parent: NgCanvasElement, newChild: any, refChild: any): void {
    if (parent && parent.insertBefore) {
      newChild.parent = parent;

      if (newChild instanceof NgCanvas) {
        parent.insertBefore((newChild as NgCanvas).element, refChild);
      } else {
        parent.insertBefore(newChild, refChild);
      }
    }
  }

  listen(
    target: any,
    eventName: string,
    callback: (event: any) => boolean | void
  ): () => void {
    const callbackFunc = (e: any) => callback.call(target, e);

    if (target instanceof NgCanvas) {
      target = target.element;
    }

    target.addEventListener(eventName, callbackFunc);

    return () => target.removeEventListener(eventName, callbackFunc);
  }

  // tslint:disable-next-line:typedef
  nextSibling(node: any) {
    return {
      previous: node,
      next: node.nextSibling,
    };
  }

  parentNode(node: any): any {
    return node.parent ? node.parent : node;
  }

  removeAttribute(
    el: NgCanvasElement,
    name: string,
    namespace?: string | null
  ): void {
    if (namespace) {
      // TODO(FW-811): Ivy may cause issues here because it's passing around
      // full URIs for namespaces, therefore this lookup will fail.
      const namespaceUri = NAMESPACE_URIS[namespace];
      if (namespaceUri) {
        el.removeAttributeNS(namespaceUri, name);
      } else {
        // TODO(FW-811): Since ivy is passing around full URIs for namespaces
        // this could result in properties like `http://www.w3.org/2000/svg:cx="123"`,
        // which is wrong.
        el.removeAttribute(`${namespace}:${name}`);
      }
    } else {
      el.removeAttribute(name);
    }
  }

  removeStyle(
    el: NgCanvasElement,
    style: string,
    flags?: RendererStyleFlags2
  ): void {
    el.removeStyle(style, flags);
  }

  setAttribute(
    el: NgCanvasElement,
    name: string,
    value: string,
    namespace?: string | null
  ): void {
    if (namespace) {
      name = namespace + ':' + name;
      // TODO(FW-811): Ivy may cause issues here because it's passing around
      // full URIs for namespaces, therefore this lookup will fail.
      const namespaceUri = NAMESPACE_URIS[namespace];
      if (namespaceUri) {
        el.setAttributeNS(namespaceUri, name, value);
      } else {
        el.setAttribute(name, value);
      }
    } else {
      el.setAttribute(name, value);
    }
  }

  setProperty(el: NgCanvasElement, name: string, value: any): void {
    el.setNgProperty(name, value);
  }

  setStyle(
    el: NgCanvasElement,
    style: string,
    value: any,
    flags?: RendererStyleFlags2
  ): void {
    if (el.style) {
      // tslint:disable-next-line:no-bitwise
      if (flags & RendererStyleFlags2.DashCase) {
        el.style.setProperty(
          // tslint:disable-next-line:no-bitwise
          style,
          value,
          flags & RendererStyleFlags2.Important ? 'important' : ''
        );
      } else {
        el.style[style] = value;
      }
    } else {
      el.setStyle(style, value, flags);
    }
  }

  setValue(node: any, value: string): void {
    if (node.setValue) {
      node.setValue(value);
    } else {
      node.nodeValue = value;
    }
  }
}
