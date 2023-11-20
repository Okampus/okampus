'use client';

import { Component, cloneElement } from 'react';
import ReactChildrenUtilities from 'react-children-utilities';
import type { deepMap as deepMapType } from 'react-children-utilities';

const reactRecursiveChildrenMap: typeof deepMapType = ReactChildrenUtilities.deepMap.bind(ReactChildrenUtilities);
let SVG_GLOBAL_ID = 0;

/** @internal */
export const resetSVGGlobalID = () => {
  SVG_GLOBAL_ID = 0;
};

export default class SVGUniqueID extends Component<{ children: React.ReactNode }> {
  private svgId: number = SVG_GLOBAL_ID++;

  private lastLocalId = 0;
  private localIdsMap = new Map<string, number>();

  private getId(originalId: string): string | null {
    if (originalId === undefined) return null;
    if (!this.localIdsMap.has(originalId)) this.localIdsMap.set(originalId, this.lastLocalId++);

    const localId = this.localIdsMap.get(originalId);

    return `___SVG_ID__${this.svgId}__${localId}___`;
  }

  private fixPropWithUrl(prop: string): string {
    if (typeof prop !== 'string') return prop;
    const [_, id] = prop.match(/^url\(#(.*)\)$/) || [null, null];

    if (id === null) return prop;

    const fixedId = this.getId(id);
    if (fixedId === null) return prop;

    return `url(#${fixedId})`;
  }

  private fixHref(prop: string): string {
    if (typeof prop !== 'string' || !prop.startsWith('#')) return prop;
    const id = prop.replace('#', '');

    const fixedId = this.getId(id);
    if (fixedId === null) return prop;

    return `#${fixedId}`;
  }

  render() {
    return reactRecursiveChildrenMap(this.props.children, (child) => {
      const hasProps = child && typeof child === 'object' && 'props' in child;
      if (!hasProps) return child;

      const fixedId = this.getId(child.props.id);
      const fixedProps = { ...child.props };

      Object.keys(fixedProps).map((key) => (fixedProps[key] = this.fixPropWithUrl(fixedProps[key])));

      return cloneElement(child, {
        ...fixedProps,
        id: fixedId,
        xlinkHref: this.fixHref(child.props.xlinkHref),
        href: this.fixHref(child.props.href),
      });
    });
  }
}
