/**
 * Generates a random integer between the specified minimum and maximum values (inclusive).
 *
 * @param {number} min - The minimum value (inclusive) for the random integer.
 * @param {number} max - The maximum value (inclusive) for the random integer.
 * @returns {number} A random integer between min and max (inclusive).
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
