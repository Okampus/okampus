import { useState, useRef, useEffect } from 'react';
import type { RefObject, Dispatch, SetStateAction } from 'react';

export interface ValidRefTarget {
  contains(target: EventTarget | null): unknown;
}

export function useOutsideClick<T extends ValidRefTarget>(
  initialIsVisible: boolean,
): [RefObject<(T | null)[]>, boolean, Dispatch<SetStateAction<boolean>>] {
  const [isComponentVisible, setIsComponentVisible] = useState<boolean>(initialIsVisible);
  const ref = useRef<(T | null)[]>([]);

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (ref.current && !ref.current.some((ref) => ref && ref.contains(event.target))) setIsComponentVisible(false);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => document.removeEventListener('click', handleClickOutside, true);
  }, []);

  return [ref, isComponentVisible, setIsComponentVisible];
}
