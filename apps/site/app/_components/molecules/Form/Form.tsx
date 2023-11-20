'use client';

import RootErrors from './RootErrors';
import SubmitButton from './SubmitButton';

import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import type { SubmitButtonProps } from './SubmitButton';
import type { FormMessages } from '../../../../server/actions/types';
import type { UseFormReturn } from 'react-hook-form';
import type { TypeOf, ZodSchema } from 'zod';

export type FormMethods<U extends ZodSchema> = UseFormReturn<NonNullable<TypeOf<U>>, unknown, undefined>;

type SubmitContext<T, U extends ZodSchema> = {
  data: NonNullable<TypeOf<U>>;
  event?: React.BaseSyntheticEvent;
  methods: FormMethods<U>;
  formState: FormMessages<T>;
  setFormState: (state: FormMessages<T>) => void;
};
export type FormProps<T, U extends ZodSchema> = {
  zodSchema: U;
  submit: (context: SubmitContext<T, U>) => Promise<void> | void;
  render: (state: FormMessages<T>, methods: FormMethods<U>) => React.ReactNode;
  className?: string;
  submitProps?: SubmitButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;
  initialData?: T;
  defaultValues?: NonNullable<TypeOf<U>>;
};
export default forwardRef(function Form<T, U extends ZodSchema>(
  { render, submit, className, submitProps, initialData, zodSchema, defaultValues }: FormProps<T, U>,
  ref: React.ForwardedRef<HTMLFormElement>,
) {
  const [formState, setFormState] = useState<FormMessages<T>>({ data: initialData });

  const methods = useForm({ resolver: zodResolver(zodSchema), ...(defaultValues && { defaultValues }) });
  const errors = formState.errors;

  const { label, loading, ...props } = submitProps ?? {};
  return (
    <FormProvider {...methods}>
      <form
        ref={ref}
        className={className}
        onSubmit={methods.handleSubmit(async (data, event) => {
          await submit({ data, event, methods, formState, setFormState });
        })}
      >
        <div className="mb-5 flex flex-col gap-4">
          {render(formState, methods)}
          {<RootErrors errors={errors?.root} />}
        </div>
        <SubmitButton label={label} loading={loading || methods.formState.isLoading} {...props} />
      </form>
    </FormProvider>
  );
}) as <T, U extends ZodSchema>(
  props: FormProps<T, U> & { ref?: React.ForwardedRef<HTMLFormElement> },
) => React.JSX.Element;
