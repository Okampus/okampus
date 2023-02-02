import { useState, useRef, useEffect } from 'react';

interface ValidRefTarget {
  contains(target: EventTarget | null): unknown;
}

export function useOutsideClick<T extends ValidRefTarget>(initialIsVisible: boolean) {
  const [isComponentVisible, setIsComponentVisible] = useState<boolean>(initialIsVisible);
  const ref = useRef<T>(null);

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return [ref, isComponentVisible, setIsComponentVisible] as [
    typeof ref,
    typeof isComponentVisible,
    typeof setIsComponentVisible
  ];
}
