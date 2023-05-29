export function deactivateLink(element: HTMLElement): void {
  const parent = element.parentNode;
  const position = element.nextSibling;
  element.remove();
  parent?.insertBefore(element, position);
}
