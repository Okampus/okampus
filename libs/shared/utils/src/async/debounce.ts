/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce<T>(callback: (...args: any[]) => Promise<T>, delay: number): (...args: any[]) => Promise<T> {
  async function callbackAsync(...args: any[]) {
    return await callback(...args);
  }

  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    return new Promise((resolve, reject) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          const output = callbackAsync(...args);
          resolve(output);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}
