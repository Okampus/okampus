import { isDigits } from '@okampus/shared/utils';

export function parseSnowflake(snowflake?: string | null) {
  if (!snowflake) return null; // paramId must be defined
  if (!isDigits(snowflake)) return null; // paramId must be a number
  if (snowflake.length !== 19) return null; // 19 digits is the length of a snowflake
  return BigInt(snowflake);
}
