/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useImmer } from 'use-immer';

export type ValidateReturn = string | { error?: string; info?: React.ReactNode } | null | undefined;
export type ValidateOptions<T> = {
  name: string;
  fn: (...args: any[]) => Promise<ValidateReturn & { data?: T }>;
  callback?: (result: T) => void;
};
export function useAsyncValidation() {
  const [loading, setLoading] = useState<string[]>([]);
  const [errors, setErrors] = useImmer<Record<string, string>>({});
  const [infos, setInfos] = useImmer<Record<string, React.ReactNode>>({});

  const resetValidation = () => {
    setErrors(() => ({}));
    setInfos(() => ({}));
    setLoading(() => []);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validate = <T>({ name, fn, callback }: ValidateOptions<T>, ...args: any[]) => {
    const promise = fn(...args);
    setLoading((previous) => [...previous, name]);

    promise
      .then((result) => {
        if (result.data && callback) callback(result.data);

        console.log('result', result, name);

        const error = typeof result === 'string' ? result : result?.error;
        const info = typeof result === 'string' ? undefined : result?.info;

        if (error && errors[name] !== error)
          setErrors((previous) => {
            previous[name] = error;
          });
        else if (!error)
          setErrors((previous) => {
            delete previous[name];
          });

        if (info && infos[name] !== info)
          setInfos((previous) => {
            previous[name] = info;
          });
        else if (!info)
          setInfos((previous) => {
            delete previous[name];
          });
      })
      .catch((error) => {
        setErrors((previous) => ({ ...previous, [name]: error.message }));
        setInfos((previous) => {
          delete previous[name];
        });
      })
      .finally(() => {
        setLoading((previous) => previous.filter((item) => item !== name));
      });

    return true;
  };

  return { validate, loading, errors, infos, resetValidation };
}
