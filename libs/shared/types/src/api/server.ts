export type FormErrors = { errors?: Record<string, string> & { root?: string[] | string } };

export type FormState<T = void> = {
  data?: T;
  errors?: Record<string, string> & { root?: string[] | string };
};

export type NextBaseServerAction<T> = (formData: FormData) => Promise<T | void>;
export type ServerAction<T> = (formData: FormData) => Promise<FormState<T>>;
