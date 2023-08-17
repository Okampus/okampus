import ModalLayout from '../../atoms/Layout/ModalLayout';
import ActionButton from '../../molecules/Button/ActionButton';

import { ActionType } from '@okampus/shared/types';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import type { Dispatch, SetStateAction } from 'react';

export type FormStepContext<T> = {
  values: T;
  setValues: Dispatch<SetStateAction<T>>;
  goToPreviousStep: () => void;
  goToStep: (step: string) => void;
  onSubmit: (values: T) => void;
};

type FormStep<T> = {
  hideBack?: boolean;
  header: React.ReactNode | ((props: FormStepContext<T>) => React.ReactNode);
  footer?: React.ReactNode | ((props: FormStepContext<T>) => React.ReactNode);
  nextStep?: string;
  submit?: React.ReactNode;
  content: React.ReactNode | ((props: FormStepContext<T>) => React.ReactNode);
  onEnter?: (ctx: FormStepContext<T>) => void;
};

export type MultiStepFormProps<T> = {
  defaultValues: T;
  steps: { initial: FormStep<T>; [key: string]: FormStep<T> };
  onClose?: () => void;
  onSubmit: (values: T) => void;
};

const motionConfig = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
  transition: { duration: 0.2 },
};
export default function MultiStepForm<T>({ steps, defaultValues, onClose, onSubmit }: MultiStepFormProps<T>) {
  const [values, setValues] = useState<T>(defaultValues);
  const [stepHistory, setStepHistory] = useState<string[]>([]);

  const goToPreviousStep = () => (stepHistory.length === 0 ? onClose?.() : setStepHistory(stepHistory.slice(0, -1)));
  const goToStep = (step: string) => setStepHistory((current) => [...current, step]);

  const context = { values, setValues, goToPreviousStep, goToStep, onSubmit };

  const key = stepHistory.at(-1) ?? 'initial';
  const step = steps[key];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => step.onEnter?.(context), [step]);

  const renderFooter = typeof step.footer === 'function' ? step.footer?.(context) ?? null : step.footer;

  let innerFooter = renderFooter;
  if (step.nextStep || step.submit) {
    const label = step.nextStep ? 'Continuer' : step.submit;
    const linkOrActionOrMenu = () => (step.nextStep ? goToStep(step.nextStep) : onSubmit(values));
    const stepButton = <ActionButton action={{ type: ActionType.Success, label, linkOrActionOrMenu }} />;

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
        <div className="text-1 font-medium cursor-pointer hover:underline" onClick={goToPreviousStep}>
          Retour
        </div>
        {innerFooter}
      </>
    );

  const header = typeof step.header === 'function' ? step.header(context) : step.header;
  const content = typeof step.content === 'function' ? step.content(context) : step.content;

  return (
    <ModalLayout
      header={
        <AnimatePresence mode="wait">
          <motion.div key={key} {...motionConfig}>
            {header}
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
          {content}
        </motion.div>
      </AnimatePresence>
    </ModalLayout>
  );
}
