import { DESKTOP_SCREEN_WIDTH, DESKTOP_XL_SCREEN_WIDTH, TABLET_SCREEN_WIDTH } from '@okampus/shared/consts';
import useBreakpoint from 'use-breakpoint';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'desktopXl';
const BREAKPOINTS = {
  mobile: 0,
  tablet: TABLET_SCREEN_WIDTH,
  desktop: DESKTOP_SCREEN_WIDTH,
  desktopXl: DESKTOP_XL_SCREEN_WIDTH,
};

export function useCurrentBreakpoint() {
  const { breakpoint } = useBreakpoint(BREAKPOINTS);
  return breakpoint;
}
