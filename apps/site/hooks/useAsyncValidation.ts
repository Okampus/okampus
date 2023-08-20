import { useState } from 'react';

export type ValidateReturn = string | { error?: string; info?: React.ReactNode } | null | undefined;
export type ValidateOptions<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (...args: any[]) => Promise<ValidateReturn & { data?: T }>;
  callback?: (result: T) => void;
  callbackError?: (error: string | null) => void;
};
export function useAsyncValidation<T>({ fn, callback, callbackError }: ValidateOptions<T>) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<React.ReactNode>(null);

  const resetValidation = () => {
    setLoading(false);
    setError(null);
    setInfo(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validate = (...args: any[]) => {
    const promise = fn(...args);
    setLoading(true);

    promise
      .then((result) => {
        if (result.data && callback) callback(result.data);

        const resultError = typeof result === 'string' ? result : result?.error;
        const resultInfo = typeof result === 'string' ? undefined : result?.info;

        if (error !== resultError) setError(resultError ?? null);
        else if (!error) setError(null);

        if (info !== resultInfo) setInfo(resultInfo ?? null);
        else if (!info) setInfo(null);
      })
      .catch((error) => {
        callbackError?.(error.message);
        setError(error.message);
        setInfo(null);
      })
      .finally(() => setLoading(false));

    return true;
  };

  return { validate, loading, error, info, resetValidation };
}
