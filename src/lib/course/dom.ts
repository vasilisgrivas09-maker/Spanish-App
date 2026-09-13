/** Typed DOM helpers for the faithful imperative renderer. */
export function el<T extends Element = HTMLElement>(selector: string, parent: ParentNode = document): T {
  const node = parent.querySelector(selector);
  if (!node) {
    throw new Error(`Missing element: ${selector}`);
  }
  return node as T;
}

export function els<T extends Element = HTMLElement>(
  selector: string,
  parent: ParentNode = document,
): T[] {
  return Array.from(parent.querySelectorAll(selector)) as T[];
}

export function maybeEl<T extends Element = HTMLElement>(
  selector: string,
  parent: ParentNode = document,
): T | null {
  return parent.querySelector(selector) as T | null;
}
