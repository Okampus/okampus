import { Modal } from '@okampus/ui/atoms';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export type FormStepContext<T> = {
  values: T;
  setValues: (values: T) => void;
  goToPreviousStep: () => void;
  goToNextStep: (step: number) => void;
  onSubmit: (values: T) => void;
};

type FormStep<T> = {
  showSkip?: boolean;
  nextSteps?: FormStep<T>[];
  header: React.ReactNode | ((props: FormStepContext<T>) => React.ReactNode);
  footer?: React.ReactNode | ((props: FormStepContext<T>) => React.ReactNode);
  content: React.ReactNode | ((props: FormStepContext<T>) => React.ReactNode);
  onEnter?: (props: FormStepContext<T>) => void;
};

export type MultiStepFormProps<T> = {
  defaultValues: T;
  initialStep: FormStep<T>;
  onClose?: () => void;
  onSubmit: (values: T) => void;
};

const motionConfig = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
  transition: { duration: 0.2 },
};
export function MultiStepForm<T>({ initialStep, defaultValues, onClose, onSubmit }: MultiStepFormProps<T>) {
  const [values, setValues] = useState<T>(defaultValues);
  const [currentStep, setCurrentStep] = useState<number[]>([]);

  const goToPreviousStep = () => {
    setCurrentStep((current) => current.slice(0, -1));
  };
  const goToNextStep = (step: number) => setCurrentStep((current) => [...current, step]);

  const context = { values, setValues, goToPreviousStep, goToNextStep, onSubmit };

  const key = currentStep.join('.') || 'initial';

  let step = initialStep;
  for (const stepIdx of currentStep) if (step.nextSteps && step.nextSteps[stepIdx]) step = step.nextSteps[stepIdx];

  useEffect(() => step.onEnter?.(context), [step]);

  const renderFooter = typeof step.footer === 'function' ? step.footer?.(context) ?? null : step.footer;
  const footer =
    step === initialStep || step.showSkip ? (
      renderFooter
    ) : (
      <div className="flex justify-between items-center">
        <div className="text-1 font-medium cursor-pointer hover:underline" onClick={() => goToPreviousStep()}>
          Retour
        </div>
        {renderFooter}
      </div>
    );

  const header = typeof step.header === 'function' ? step.header(context) : step.header;
  const content = typeof step.content === 'function' ? step.content(context) : step.content;

  return (
    // TODO: make non-modal version?
    <Modal
      header={
        <AnimatePresence mode="wait">
          <motion.div key={key} {...motionConfig}>
            {header}
          </motion.div>
        </AnimatePresence>
      }
      footer={
        <AnimatePresence mode="wait">
          <motion.div key={key} {...motionConfig}>
            {footer}
          </motion.div>
        </AnimatePresence>
      }
      onClose={onClose}
    >
      <AnimatePresence mode="wait">
        <motion.div key={key} {...motionConfig} className="w-full">
          {content}
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
}
