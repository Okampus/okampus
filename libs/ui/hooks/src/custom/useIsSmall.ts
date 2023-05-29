import { SMALL_SCREEN_WIDTH } from '@okampus/shared/consts';
import { useWindowSize } from 'react-use';

const isSmall = (width: number) => width < SMALL_SCREEN_WIDTH;
export function useIsSmall() {
  const { width } = useWindowSize();
  return isSmall(width);
}
