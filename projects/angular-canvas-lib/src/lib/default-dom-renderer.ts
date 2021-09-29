import {
  Renderer2,
  RendererStyleFlags2,
  RendererType2,
  ViewEncapsulation,
} from '@angular/core';
import {
  EventManager,
  ɵDomSharedStylesHost as DomSharedStylesHost,
} from '@angular/platform-browser';
import {
  flattenStyles,
  NAMESPACE_URIS,
  shimContentAttribute,
  shimHostAttribute,
} from './renderer-utils';

const ngDevMode = (window as any).ngDevMode;
const NG_DEV_MODE: boolean = typeof ngDevMode === 'undefined' || !!ngDevMode;

// tslint:disable-next-line:typedef
function decoratePreventDefault(eventHandler) {
  // `DebugNode.triggerEventHandler` needs to know if the listener was created with
  // decoratePreventDefault or is a listener added outside the Angular context so it can handle the
  // two differently. In the first case, the special '__ngUnwrap__' token is passed to the unwrap
  // the listener (see below).
  return (event: any) => {
    // Ivy uses '__ngUnwrap__' as a special token that allows us to unwrap the function
    // so that it can be invoked programmatically by `DebugNode.triggerEventHandler`. The debug_node
    // can inspect the listener toString contents for the existence of this special token. Because
    // the token is a string literal, it is ensured to not be modified by compiled code.
    if (event === '__ngUnwrap__') {
      return eventHandler;
    }

    const allowDefaultBehavior = eventHandler(event);
    if (allowDefaultBehavior === false) {
      // TODO(tbosch): move preventDefault into event plugins...
      event.preventDefault();
      event.returnValue = false;
    }

    return undefined;
  };
}

export class DefaultDomRenderer2 implements Renderer2 {
  constructor(private eventManager: EventManager) {}

  data: { [key: string]: any } = Object.create(null);

  destroyNode: null;

  destroy(): void {}

  createElement(name: string, namespace?: string): any {
    if (namespace) {
      // In cases where Ivy (not ViewEngine) is giving us the actual namespace, the look up by key
      // will result in undefined, so we just return the namespace here.
      return document.createElementNS(
        NAMESPACE_URIS[namespace] || namespace,
        name
      );
    }

    return document.createElement(name);
  }

  createComment(value: string): any {
    return document.createComment(value);
  }

  createText(value: string): any {
    return document.createTextNode(value);
  }

  appendChild(parent: any, newChild: any): void {
    parent.appendChild(newChild);
  }

  insertBefore(parent: any, newChild: any, refChild: any): void {
    if (parent) {
      parent.insertBefore(newChild, refChild);
    }
  }

  removeChild(parent: any, oldChild: any): void {
    if (parent) {
      parent.removeChild(oldChild);
    }
  }

  selectRootElement(
    selectorOrNode: string | any,
    preserveContent?: boolean
  ): any {
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

  parentNode(node: any): any {
    return node.parentNode;
  }

  nextSibling(node: any): any {
    return node.nextSibling;
  }

  setAttribute(el: any, name: string, value: string, namespace?: string): void {
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

  removeAttribute(el: any, name: string, namespace?: string): void {
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

  addClass(el: any, name: string): void {
    el.classList.add(name);
  }

  removeClass(el: any, name: string): void {
    el.classList.remove(name);
  }

  setStyle(
    el: any,
    style: string,
    value: any,
    flags: RendererStyleFlags2
  ): void {
    // tslint:disable-next-line:no-bitwise
    if (
      flags &
      (RendererStyleFlags2.DashCase | RendererStyleFlags2.Important)
    ) {
      el.style.setProperty(
        style,
        value,
        flags & RendererStyleFlags2.Important ? 'important' : ''
      );
    } else {
      el.style[style] = value;
    }
  }

  removeStyle(el: any, style: string, flags: RendererStyleFlags2): void {
    // tslint:disable-next-line:no-bitwise
    if (flags & RendererStyleFlags2.DashCase) {
      el.style.removeProperty(style);
    } else {
      // IE requires '' instead of null
      // see https://github.com/angular/angular/issues/7916
      el.style[style] = '';
    }
  }

  setProperty(el: any, name: string, value: any): void {
    // tslint:disable-next-line:no-unused-expression
    NG_DEV_MODE && checkNoSyntheticProp(name, 'property');
    el[name] = value;
  }

  setValue(node: any, value: string): void {
    node.nodeValue = value;
  }

  listen(
    target: 'window' | 'document' | 'body' | any,
    event: string,
    callback: (event: any) => boolean
  ): () => void {
    // tslint:disable-next-line:no-unused-expression
    NG_DEV_MODE && checkNoSyntheticProp(event, 'listener');
    if (typeof target === 'string') {
      return <() => void>(
        this.eventManager.addGlobalEventListener(
          target,
          event,
          decoratePreventDefault(callback)
        )
      );
    }
    return (<() => void>(
      this.eventManager.addEventListener(
        target,
        event,
        decoratePreventDefault(callback)
      )
    )) as () => void;
  }
}

const AT_CHARCODE = (() => '@'.charCodeAt(0))();

// tslint:disable-next-line:typedef
function checkNoSyntheticProp(name: string, nameKind: string) {
  if (name.charCodeAt(0) === AT_CHARCODE) {
    throw new Error(
      `Found the synthetic ${nameKind} ${name}. Please include either "BrowserAnimationsModule" or "NoopAnimationsModule" in your application.`
    );
  }
}

export class EmulatedEncapsulationDomRenderer2 extends DefaultDomRenderer2 {
  private contentAttr: string;
  private hostAttr: string;

  constructor(
    eventManager: EventManager,
    sharedStylesHost: DomSharedStylesHost,
    private component: RendererType2,
    appId: string
  ) {
    super(eventManager);
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
    super.setAttribute(element, this.hostAttr, '');
  }

  createElement(parent: any, name: string): Element {
    const el = super.createElement(parent, name);
    super.setAttribute(el, this.contentAttr, '');
    return el;
  }
}

export class ShadowDomRenderer extends DefaultDomRenderer2 {
  private shadowRoot: any;

  constructor(
    eventManager: EventManager,
    private sharedStylesHost: DomSharedStylesHost,
    private hostEl: any,
    private component: RendererType2
  ) {
    super(eventManager);
    if (component.encapsulation === ViewEncapsulation.ShadowDom) {
      this.shadowRoot = (hostEl as any).attachShadow({ mode: 'open' });
    } else {
      this.shadowRoot = (hostEl as any).createShadowRoot();
    }
    this.sharedStylesHost.addHost(this.shadowRoot);
    const styles = flattenStyles(component.id, component.styles, []);
    for (let i = 0; i < styles.length; i++) {
      const styleEl = document.createElement('style');
      styleEl.textContent = styles[i];
      this.shadowRoot.appendChild(styleEl);
    }
  }

  private nodeOrShadowRoot(node: any): any {
    return node === this.hostEl ? this.shadowRoot : node;
  }

  destroy() {
    this.sharedStylesHost.removeHost(this.shadowRoot);
  }

  appendChild(parent: any, newChild: any): void {
    return super.appendChild(this.nodeOrShadowRoot(parent), newChild);
  }

  insertBefore(parent: any, newChild: any, refChild: any): void {
    return super.insertBefore(
      this.nodeOrShadowRoot(parent),
      newChild,
      refChild
    );
  }

  removeChild(parent: any, oldChild: any): void {
    return super.removeChild(this.nodeOrShadowRoot(parent), oldChild);
  }

  parentNode(node: any): any {
    return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(node)));
  }
}
