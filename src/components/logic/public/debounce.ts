function debounce<T extends (...args: T[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timerId: NodeJS.Timeout | null = null;

  return function<This>(this: This, ...args: Parameters<T>): void {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      fn.apply(this, args);
      timerId = null;
    }, delay);
  };
}

export { debounce }