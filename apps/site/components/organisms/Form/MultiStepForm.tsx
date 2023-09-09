import ModalLayout from '../../atoms/Layout/ModalLayout';
import ActionButton from '../../molecules/Button/ActionButton';
import SubmitButton from '../../molecules/Button/SubmitButton';
import { notificationAtom } from '../../../context/global';

import { ActionType, ToastType } from '@okampus/shared/types';

import { AnimatePresence, motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import type { DeepPartial, FieldPath, FieldValues, Resolver, UseFormReturn } from 'react-hook-form';

export type FormStepContext<Values extends FieldValues, U> = {
  context: U;
  methods: {
    goToPreviousStep: () => void;
    goToStep: (step: string) => void;
    formMethods: UseFormReturn<Values>;
  };
};

type FormStep<Values extends FieldValues, U> = {
  header: React.ReactNode | ((ctx: FormStepContext<Values, U>) => React.ReactNode);
  footer?: React.ReactNode | ((ctx: FormStepContext<Values, U>) => React.ReactNode);
  content: React.ReactNode | ((ctx: FormStepContext<Values, U>) => React.ReactNode);
  submit?: React.ReactNode;
  hideBack?: boolean;
  nextStep?: string;
  validateFields?:
    | FieldPath<Values>
    | FieldPath<Values>[]
    | true
    | ((ctx: FormStepContext<Values, U>) => FieldPath<Values> | FieldPath<Values>[] | true);
  onEnter?: (ctx: FormStepContext<Values, U>) => void;
};

export type MultiStepFormProps<T extends FieldValues, U> = {
  defaultValues: DeepPartial<T>;
  context: U;
  resolver: Resolver<T>;
  onSubmit: (values: T) => void;
  steps: { initial: FormStep<T, U>; [key: string]: FormStep<T, U> };
  onClose?: () => void;
};

const motionConfig = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
  transition: { duration: 0.2 },
};
export default function MultiStepForm<T extends FieldValues, U>({
  resolver,
  context,
  onSubmit: submit,
  defaultValues,
  steps,
  onClose,
}: MultiStepFormProps<T, U>) {
  const [, setNotification] = useAtom(notificationAtom);
  const methods = useForm<T>({ defaultValues, resolver });
  const onSubmit = methods.handleSubmit(
    (values) => {
      console.log(values);
    },
    (e) => console.log(e),
  );

  const [stepHistory, setStepHistory] = useState<string[]>([]);

  const ctx = useMemo(
    () => ({
      methods: {
        goToPreviousStep: () => (stepHistory.length === 0 ? onClose?.() : setStepHistory(stepHistory.slice(0, -1))),
        goToStep: (step: string) => setStepHistory((current) => [...current, step]),
        formMethods: methods,
      },
      context,
    }),
    [methods, onClose, stepHistory, context],
  );

  const key = stepHistory.at(-1) ?? 'initial';
  const step = steps[key];

  useEffect(() => step.onEnter?.(ctx), [ctx, step]);

  const renderFooter = typeof step.footer === 'function' ? step.footer?.(ctx) ?? null : step.footer;

  let innerFooter = renderFooter;
  if (step.nextStep || step.submit) {
    const label = step.nextStep ? 'Continuer' : step.submit;
    let stepButton = null;
    if (step.nextStep) {
      const nextStep = step.nextStep;
      const linkOrActionOrMenu = async () => {
        if (step.validateFields) {
          const fields = typeof step.validateFields === 'function' ? step.validateFields(ctx) : step.validateFields;
          const isValid = await methods.trigger(fields === true ? undefined : fields);
          if (!isValid) {
            setNotification({ type: ToastType.Error, message: 'Veuillez corriger les erreurs dans le formulaire.' });
            return;
          }
        }

        ctx.methods.goToStep(nextStep);
      };
      const action = { type: ActionType.Success, label, linkOrActionOrMenu };
      stepButton = <ActionButton action={action} />;
    } else {
      stepButton = <SubmitButton label={label} loading={methods.formState.isSubmitting} />;
    }

    innerFooter = renderFooter ? (
      <div className="flex items-center gap-2">
        {renderFooter}
        {stepButton}
      </div>
    ) : (
      stepButton
    );
  }

  const footer =
    key === 'initial' || step.hideBack ? (
      innerFooter
    ) : (
      <>
        <div className="text-1 font-medium cursor-pointer hover:underline" onClick={ctx.methods.goToPreviousStep}>
          Retour
        </div>
        {innerFooter}
      </>
    );

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <ModalLayout
          header={
            <AnimatePresence mode="wait">
              <motion.div key={key} {...motionConfig}>
                {typeof step.header === 'function' ? step.header(ctx) : step.header}
              </motion.div>
            </AnimatePresence>
          }
          footer={
            <AnimatePresence mode="wait">
              <motion.div key={key} {...motionConfig} className="flex justify-between items-center gap-6">
                {footer}
              </motion.div>
            </AnimatePresence>
          }
        >
          <AnimatePresence mode="wait">
            <motion.div key={key} {...motionConfig} className="w-full">
              {typeof step.content === 'function' ? step.content(ctx) : step.content}
            </motion.div>
          </AnimatePresence>
        </ModalLayout>
      </form>
    </FormProvider>
  );
}
