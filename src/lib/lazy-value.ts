/** @internal */
export function lazyValue<T>(get: () => T): () => T {
  let valueReturned = false;
  let value: T;

  return (): T => {
    if (!valueReturned) {
      value = get();
      valueReturned = true;
    }

    return value;
  };
}
