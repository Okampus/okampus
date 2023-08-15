import { useCallback, useRef, useState } from 'react';

export function useStateWithRef<T>(
  initial: T,
): [T, React.Dispatch<React.SetStateAction<T>>, React.MutableRefObject<T>] {
  const [state, setState] = useState(initial);
  const ref = useRef<T>(state);
  const set = useCallback((arg: React.SetStateAction<T>) => {
    ref.current = arg instanceof Function ? arg(ref.current) : arg;
    setState(arg);
  }, []);

  return [state, set, ref];
}
