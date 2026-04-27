export function qs<T extends Element = Element>(selector: string, root: ParentNode = document): T | null {
  return root.querySelector<T>(selector);
}

export function setText(element: Element | null, text: string): void {
  if (element) element.textContent = text;
}
