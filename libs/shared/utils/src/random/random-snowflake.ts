import { randomDigits } from './random-digits';

export function snowflake() {
  return `${Date.now()}${randomDigits(6)}`;
}
