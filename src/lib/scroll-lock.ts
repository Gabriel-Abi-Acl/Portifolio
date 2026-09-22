type ScrollLockListener = (locked: boolean) => void;

const listeners = new Set<ScrollLockListener>();

export function subscribeScrollLock(listener: ScrollLockListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setScrollLocked(locked: boolean): void {
  listeners.forEach((listener) => listener(locked));
}
