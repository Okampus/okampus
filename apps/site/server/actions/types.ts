export type FormErrors = { errors?: Record<string, string> & { root?: string[] | string } };

export type FormMessages<T = void> = {
  data?: T;
  errors?: Record<string, string> & { root?: string[] | string };
};

export type NextBaseServerAction<T> = (
  previousState: FormMessages<T>,
  formData: FormData,
) => Promise<FormMessages<T> | void>;

export type ServerAction<T> = (previousState: FormMessages<T>, formData: FormData) => Promise<FormMessages<T>>;

export type WrappedActionContext<T> = {
  previousState: FormMessages<T>;
  formData: FormData;
};
