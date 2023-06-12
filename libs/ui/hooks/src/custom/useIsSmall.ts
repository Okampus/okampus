import { SMALL_SCREEN_WIDTH } from '@okampus/shared/consts';
import { useWindowSize } from 'react-use';

export function useIsSmall(callback?: (isSmall: boolean) => void) {
  const { width } = useWindowSize();
  const isSmall = width < SMALL_SCREEN_WIDTH;
  if (callback) callback(isSmall);
  return isSmall;
}
