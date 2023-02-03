import { Colors } from '@okampus/shared/enums';
import { COLORS } from '@okampus/shared/consts';

export function getColorFromData(string: string) {
  const colors = Object.values(Colors);

  // eslint-disable-next-line unicorn/no-array-reduce
  const hash = [...string].reduce((a, b) => {
    // eslint-disable-next-line unicorn/prefer-code-point
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  return COLORS[colors[((hash % colors.length) + colors.length) % colors.length]];
}
