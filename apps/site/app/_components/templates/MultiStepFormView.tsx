'use client';

import BaseView from './BaseView';
import { useFormPersist } from '../../_hooks/useFormPersist';
import Sidepanel from '../layouts/Sidepanel';
import { mergeZodObjectSchemas } from '../../../utils/zod/zod-merge';
import { getZodDefaults } from '../../../utils/zod/zod-default';
import Button from '../molecules/Button/Button';

import { ActionType } from '@okampus/shared/enums';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, CheckCircle } from '@phosphor-icons/react';

import clsx from 'clsx';
import { useCallback, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import type { MergedZodObject } from '../../../utils/zod/zod-merge';
import type { PartialDeep } from '@okampus/shared/types';

import type { DefaultValues } from 'react-hook-form';
import type { TypeOf, AnyZodObject } from 'zod';

export type FormStepContext<U> = {
  context: U;
  goToNextStep: () => void;
};

export type MultiStepFormProps<T extends AnyZodObject[], U> = {
  id: string;
  context: U;
  initialValues?: PartialDeep<TypeOf<MergedZodObject<T>>>;
  onSubmit: (values: TypeOf<MergedZodObject<T>>) => void;
  title: string;
  steps: {
    zodSchema: T[number];
    render: ({ context, goToNextStep }: FormStepContext<U>) => React.ReactNode;
    icon: React.ReactNode;
    title: string;
    description?: string;
  }[];
};

const getCleanStep = (step: number, stepCount: number, setStep: (step: number) => void) => {
  const cleanStep = step < 0 || step >= stepCount ? 0 : step;
  if (cleanStep !== step) setStep(cleanStep);
  return cleanStep;
};

const getCleanDefaultValues = <T extends AnyZodObject>(
  zodSchema: T,
  defaultValues: PartialDeep<TypeOf<T>>,
  initialValues?: PartialDeep<TypeOf<T>>,
  setFormValues?: (values: PartialDeep<TypeOf<T>>) => void,
): DefaultValues<TypeOf<T>> => {
  const cleanDefaultValues = getZodDefaults(zodSchema, defaultValues, initialValues);
  setFormValues?.(cleanDefaultValues);
  return defaultValues as DefaultValues<TypeOf<T>>;
};

export default function MultiStepFormView<T extends AnyZodObject[], U>({
  id,
  context,
  steps,
  onSubmit,
  initialValues,
}: MultiStepFormProps<T, U>) {
  const { getFormValues, getFormStep, setFormStep, setFormValues } =
    useFormPersist<PartialDeep<TypeOf<MergedZodObject<T>>>>(id);

  const mergedSchema = useMemo(() => mergeZodObjectSchemas(steps.map((step) => step.zodSchema)), [steps]);
  const defaultValues = useMemo(
    () => getCleanDefaultValues(mergedSchema, getFormValues(), initialValues, setFormValues),
    [mergedSchema, getFormValues, initialValues, setFormValues],
  );

  const initialStep = getCleanStep(getFormStep(), steps.length, setFormStep);

  const [currentStep, setCurrentStep] = useState(initialStep);
  const setStep = useCallback(
    (step: number) => {
      setCurrentStep(step);
      setFormStep(step);
    },
    [setFormStep],
  );

  const step = steps[currentStep];
  const methods = useForm({
    defaultValues,
    shouldUnregister: false,
    resolver: zodResolver(step.zodSchema),
    mode: 'onChange',
  });

  const handleNext = useCallback(async () => {
    const isValid = await methods.trigger();
    if (isValid) {
      if (currentStep + 1 === steps.length) onSubmit(methods.getValues());
      else setStep(currentStep + 1);
    }
  }, [methods, currentStep, steps.length, onSubmit, setStep]);

  const render = useMemo(() => step.render({ context, goToNextStep: handleNext }), [context, handleNext, step]);
  return (
    <>
      <BaseView
        contentMode="centered-6xl"
        sidePanelButtonSmall={
          <Button>
            Étape {currentStep + 1} / {steps.length}
          </Button>
        }
      >
        <FormProvider {...methods}>
          <form className="flex flex-col gap-8">
            {render}
            <div>
              <Button action={() => setStep(currentStep - 1)}>Retour</Button>
              <Button type={ActionType.Action} action={handleNext}>
                Continuer
                <ArrowRight />
              </Button>
            </div>
          </form>
        </FormProvider>
      </BaseView>
      <Sidepanel>
        <div className="w-full flex flex-col">
          {steps.map((step, idx) => (
            <div
              key={idx}
              onClick={() => setStep(idx)}
              className={clsx(idx !== currentStep && 'opacity-75', 'p-4 cursor-pointer')}
            >
              <div className="flex items-start gap-3 font-semibold text-0 mb-1">
                {idx > currentStep ? (
                  <CheckCircle className="text-2" />
                ) : (
                  <CheckCircle className="text-[var(--success)]" />
                )}
                {step.title}
              </div>
              {step.description && <div className="pl-9 text-sm text-2 font-medium">{step.description}</div>}
            </div>
          ))}
        </div>
      </Sidepanel>
    </>
  );
}
