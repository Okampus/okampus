'use client';

import FormErrors from './FormErrors';
import SubmitButton from './SubmitButton';

import { objectToFormData } from '../../../../utils/form-data/object-to-form-data';
import { zodResolver } from '@hookform/resolvers/zod';

import debug from 'debug';
import { forwardRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { FormProvider, useForm } from 'react-hook-form';

import type { FormMethods } from './Form';
import type { SubmitButtonProps } from './SubmitButton';

import type { FormState, ServerAction } from '@okampus/shared/types';

import type { DefaultValues } from 'react-hook-form';
import type { TypeOf, ZodSchema } from 'zod';

function FormWithActionSubmitButton(props: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const { loading, ...submitProps } = props;
  return <SubmitButton loading={loading || pending} {...submitProps} />;
}

const debugLog = debug('okampus:site:FormWithAction');

export type FormWithActionProps<T, U extends ZodSchema> = {
  action: ServerAction<T>;
  zodSchema: U;
  render: (state: FormState<T>, methods: FormMethods<U>) => React.ReactNode;
  beforeSubmit?: (data: TypeOf<U>) => void;
  afterSubmit?: (data: TypeOf<U>) => void;
  submitProps?: SubmitButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;
  className?: string;
  initialData?: T;
  defaultValues?: DefaultValues<TypeOf<U>>;
  renderFooter?: (state: FormState<T>, methods: FormMethods<U>) => React.ReactNode;
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
  const [formState, setFormState] = useState<FormState<T>>({ data: initialData });

  const methods = useForm({ resolver: zodResolver(zodSchema), ...(defaultValues && { defaultValues }) });
  const errors = formState.errors;

  return (
    <FormProvider {...methods}>
      <form
        ref={ref}
        // action={async (data) => await action(data).then((response) => setFormState(response))}
        className={className}
        onSubmit={methods.handleSubmit(
          (data) => {
            beforeSubmit?.(data);
            action(objectToFormData(data)).then((response) => {
              response && setFormState(response);
            });
            afterSubmit?.(data);
          },
          (errors) => {
            debugLog('Errors', errors);
            debugLog('Values', methods.getValues());
          },
        )}
      >
        <div className="mb-5 flex flex-col gap-4">
          {render(formState, methods)}
          {<FormErrors errors={errors?.root} />}
        </div>
        <div className={footerClassName}>
          {renderFooter?.(formState, methods)}
          <FormWithActionSubmitButton {...submitProps} />
        </div>
      </form>
    </FormProvider>
  );
}) as <T, U extends ZodSchema>(
  props: FormWithActionProps<T, U> & { ref?: React.ForwardedRef<HTMLFormElement> },
) => React.JSX.Element;
