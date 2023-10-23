export type FormErrors = { errors?: Record<string, string> & { root?: string[] | string } };

export type FormMessages<T = undefined> = {
  data?: T;
  errors?: Record<string, string> & { root?: string[] | string };
};

export type NextBaseServerAction<T = undefined> = (
  previousState: FormMessages<T>,
  formData: FormData,
) => Promise<FormMessages<T> | void>;

export type ServerAction<T = undefined> = (
  previousState: FormMessages<T>,
  formData: FormData,
) => Promise<FormMessages<T>>;

export type WrappedActionContext<T = undefined> = {
  previousState: FormMessages<T>;
  formData: FormData;
};
