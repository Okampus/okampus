import { notificationAtom } from '../../../_context/global';

import { ToastType } from '@okampus/shared/types';

import { AnimatePresence } from 'framer-motion';
import { useAtom } from 'jotai';
import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import type { DefaultValues, FieldValues, Resolver, UseFormReturn } from 'react-hook-form';

export type FormStepContext<Values extends FieldValues, U> = {
  data: U;
  goToPreviousStep?: () => void;
  goToStep: (step: string) => void;
  onCancel?: () => void;
  formMethods: UseFormReturn<Values>;
};

export type MultiStepFormProps<T extends FieldValues, U> = {
  data: U;
  defaultValues: DefaultValues<T>;
  onCancel?: () => void;
  onSubmit: (values: T) => void;
  resolver: Resolver<T>;
  steps: {
    initial: (context: FormStepContext<T, U>) => React.ReactNode;
    [key: string]: (context: FormStepContext<T, U>) => React.ReactNode;
  };
};

export default function MultiStepForm<T extends FieldValues, U>({
  data,
  defaultValues,
  onSubmit,
  onCancel,
  resolver,
  steps,
}: MultiStepFormProps<T, U>) {
  const [, setNotification] = useAtom(notificationAtom);
  const methods = useForm<T>({ defaultValues, resolver });

  const [stepHistory, setStepHistory] = useState<string[]>([]);

  const ctx = useMemo(
    () => ({
      data,
      formMethods: methods,
      goToPreviousStep: stepHistory.length === 0 ? undefined : () => setStepHistory(stepHistory.slice(0, -1)),
      goToStep: (step: string) => setStepHistory((current) => [...current, step]),
      onCancel,
    }),
    [methods, onCancel, stepHistory, data],
  );

  const key = stepHistory.at(-1) ?? 'initial';
  const step = steps[key];

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit, (errors) => {
          const message = errors.root?.message ?? 'Une erreur est survenue';
          setNotification({ type: ToastType.Error, message });
          console.error('Error submitting', errors);
        })}
      >
        <AnimatePresence mode="wait">{step(ctx)}</AnimatePresence>
      </form>
    </FormProvider>
  );
}
