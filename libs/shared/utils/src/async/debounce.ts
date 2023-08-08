type Deferred<T> = { promise: Promise<T>; resolve?: (value: T) => void; reject?: () => void };

export function debounce<T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>,
  wait: number | (() => number) = 0,
  options: { leading?: boolean; trailing?: boolean } = {}
) {
  let lastCallAt: number;
  let firstPromise: Promise<T>;
  let deferred: Deferred<T> | null;
  let timer: ReturnType<typeof setTimeout>;
  let pendingArgs: Args[] = [];
  options = { leading: false, trailing: true, ...options };

  return function debounce(this: typeof fn, ...args: Args) {
    const currentWait = typeof wait === 'function' ? wait() : wait;
    const currentTime = Date.now();

    const isCold = !lastCallAt || currentTime - lastCallAt > currentWait;

    lastCallAt = currentTime;
    if (isCold && options.leading) {
      firstPromise = Promise.resolve(fn.call(this, ...args));
      return firstPromise;
    }

    if (deferred) {
      clearTimeout(timer);
    } else {
      deferred = defer();
    }

    if (options.trailing) {
      pendingArgs.push(args);
      timer = setTimeout(flush.bind(this), currentWait);
    } else {
      return firstPromise;
    }

    return deferred.promise;
  };

  function flush(this: typeof fn) {
    const thisDeferred = deferred as Deferred<T>;
    clearTimeout(timer);

    Promise.resolve(fn.apply(this, pendingArgs.at(-1) as Args)).then(thisDeferred.resolve, thisDeferred.reject);

    pendingArgs = [];
    deferred = null;
  }
}

function defer<T>(): Deferred<T> {
  const deferred: Deferred<T> = {
    promise: new Promise((resolve, reject) => {
      deferred.resolve = resolve;
      deferred.reject = reject;
    }),
  };
  return deferred;
}
