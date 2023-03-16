const maxCounter = 2_097_151; // 2^21 - 1
const state = {
  counter: 0,
  currentMs: Date.now(),
};

export function snowflake() {
  const now = Date.now();
  if (now === state.currentMs) {
    state.counter++;
    if (state.counter > maxCounter) {
      while (Date.now() <= now) {
        /* Wait until next ms, as counter overflowed */
      }
      state.currentMs = Date.now();
    }
  } else {
    state.counter = 0;
    state.currentMs = now;
  }

  const timestamp = state.currentMs.toString(2).padStart(42, '0'); // 42 bits - max. 140 years since 1970
  const counter = state.counter.toString(2).padStart(21, '0'); // 21 bits - max. 2.1 million IDs per ms
  return BigInt('0b0' + timestamp + counter).toString(); // 63 bits - MySQL/Postgres positive 8 bytes bigint limit
}
