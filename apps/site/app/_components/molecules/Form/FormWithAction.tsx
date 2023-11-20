'use client';

import SubmitButton from './SubmitButton';
import RootErrors from './RootErrors';

import { objectToFormData } from '../../../../utils/form-data/object-to-form-data';
import { forwardRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

import type { FormMethods } from './Form';
import type { SubmitButtonProps } from './SubmitButton';
import type { FormMessages, ServerAction } from '../../../../server/actions/types';

import type { DefaultValues } from 'react-hook-form';
import type { TypeOf, ZodSchema } from 'zod';

function FormWithActionSubmitButton(props: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const { loading, ...submitProps } = props;
  return <SubmitButton loading={loading || pending} {...submitProps} />;
}

export type FormWithActionProps<T, U extends ZodSchema> = {
  action: ServerAction<T>;
  zodSchema: U;
  render: (state: FormMessages<T>, methods: FormMethods<U>) => React.ReactNode;
  beforeSubmit?: (data: TypeOf<U>) => void;
  afterSubmit?: (data: TypeOf<U>) => void;
  submitProps?: SubmitButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;
  className?: string;
  initialData?: T;
  defaultValues?: DefaultValues<TypeOf<U>>;
  renderFooter?: (state: FormMessages<T>, methods: FormMethods<U>) => React.ReactNode;
  footerClassName?: string;
};
export default forwardRef(function FormWithAction<T, U extends ZodSchema>(
  {
    action,
    zodSchema,
    render,
    beforeSubmit,
    afterSubmit,
    submitProps,
    className,
    initialData,
    defaultValues,
    renderFooter,
    footerClassName = 'flex gap-6',
  }: FormWithActionProps<T, U>,
  ref: React.ForwardedRef<HTMLFormElement>,
) {
  const [actionFormState, formAction] = useFormState(action, { data: initialData });

  const methods = useForm({ resolver: zodResolver(zodSchema), ...(defaultValues && { defaultValues }) });
  const errors = actionFormState.errors;

  // if (process.env.NODE_ENV !== 'production') console.warn({ actionFormState, action });

  return (
    <FormProvider {...methods}>
      <form
        ref={ref}
        action={formAction}
        className={className}
        onSubmit={methods.handleSubmit(
          (data) => {
            beforeSubmit?.(data);
            action(actionFormState, objectToFormData(data));
            afterSubmit?.(data);
          },
          (errors) => {
            console.log(methods.getValues());
            console.error(errors);
          },
        )}
      >
        <div className="mb-5 flex flex-col gap-4">
          {render(actionFormState, methods)}
          {<RootErrors errors={errors?.root} />}
        </div>
        <div className={footerClassName}>
          {renderFooter?.(actionFormState, methods)}
          <FormWithActionSubmitButton {...submitProps} />
        </div>
      </form>
    </FormProvider>
  );
}) as <T, U extends ZodSchema>(
  props: FormWithActionProps<T, U> & { ref?: React.ForwardedRef<HTMLFormElement> },
) => React.JSX.Element;
