let state = { currentMs: Date.now(), counter: 0 };

export function snowflake() {
  const now = Date.now();
  if (now !== state.currentMs) state = { currentMs: now, counter: 0 };

  const timestamp = Date.now().toString(2).padStart(42, '0'); // 42 bits - max. 140 years since 1970
  const counter = (state.counter++).toString(2).padStart(21, '0'); // 21 bits - max. 2.1 million IDs per ms
  const snowflake = BigInt('0b0' + timestamp + counter); // 63 bits - MySQL/Postgres positive 8 bytes bigint limit

  return snowflake.toString();
}
