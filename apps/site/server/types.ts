export type NextFormErrors = { errors?: Record<string, string> & { root?: string[] | string } };

export type NextFormMessages<T = undefined> = {
  data?: T;
  errors?: Record<string, string> & { root?: string[] | string };
};

export type NextBaseServerAction<T = undefined> = (
  previousState: NextFormMessages<T>,
  formData: FormData,
) => Promise<NextFormMessages<T> | void>;

export type NextServerAction<T = undefined> = (
  previousState: NextFormMessages<T>,
  formData: FormData,
) => Promise<NextFormMessages<T>>;

export type WrappedActionContext<T = undefined> = {
  previousState: NextFormMessages<T>;
  formData: FormData;
};
