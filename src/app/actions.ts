export function bindPrototypeActions(): void {
  // Inline prototype handlers are exported from main.ts for now.
}

export function bindDelegatedAction(
  root: HTMLElement,
  action: string,
  handler: (el: HTMLElement) => void,
): void {
  root.addEventListener('click', e => {
    const target = (e.target as HTMLElement).closest(`[data-action="${action}"]`);
    if (target) handler(target as HTMLElement);
  });
}
