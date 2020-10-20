export const NAMESPACE_URIS: { [ns: string]: string } = {
  svg: 'http://www.w3.org/2000/svg',
  xhtml: 'http://www.w3.org/1999/xhtml',
  xlink: 'http://www.w3.org/1999/xlink',
  xml: 'http://www.w3.org/XML/1998/namespace',
  xmlns: 'http://www.w3.org/2000/xmlns/',
};

const COMPONENT_REGEX = /%COMP%/g;

export const COMPONENT_VARIABLE = '%COMP%';
export const HOST_ATTR = `_nghost-${COMPONENT_VARIABLE}`;
export const CONTENT_ATTR = `_ngcontent-${COMPONENT_VARIABLE}`;

export function shimContentAttribute(componentShortId: string): string {
  return CONTENT_ATTR.replace(COMPONENT_REGEX, componentShortId);
}

export function shimHostAttribute(componentShortId: string): string {
  return HOST_ATTR.replace(COMPONENT_REGEX, componentShortId);
}

export function flattenStyles(
  compId: string,
  styles: Array<any | any[]>,
  target: string[]
): string[] {
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < styles.length; i++) {
    let style = styles[i];

    if (Array.isArray(style)) {
      flattenStyles(compId, style, target);
    } else {
      style = style.replace(COMPONENT_REGEX, compId);
      target.push(style);
    }
  }
  return target;
}
