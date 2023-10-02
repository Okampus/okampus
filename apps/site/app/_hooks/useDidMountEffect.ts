import { useEffect, useRef } from 'react';

export function useDidMountEffect(func: () => void, deps: React.DependencyList) {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
