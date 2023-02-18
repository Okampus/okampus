export function deactivateLink(element: HTMLElement): void {
  const parent = element.parentNode;
  const position = element.nextSibling;
  parent?.removeChild(element);
  parent?.insertBefore(element, position);
}
