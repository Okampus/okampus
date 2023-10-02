import ModalLayout from '../../atoms/Layout/ModalLayout';
import ActionButton from '../../molecules/Button/ActionButton';
import SubmitButton from '../../molecules/Button/SubmitButton';

import { ActionType } from '@okampus/shared/types';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import type { FieldValues, FieldPath } from 'react-hook-form';

import type { FormStepContext } from './MultiStepForm';

const motionConfig = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
  transition: { duration: 0.2 },
};

type ButtonOptions = {
  custom?: React.ReactNode;
  hidden?: boolean;
  label?: string;
  onClick?: () => void;
};

type FooterOptions = {
  hidden?: boolean;
  left?: ButtonOptions;
  right?: ButtonOptions & { isSkip?: boolean };
};

type FormStepProps<T extends FieldValues, U> = {
  children: React.ReactNode;
  contentClassName?: string;
  context: FormStepContext<T, U>;
  customFooter?: React.ReactNode;
  header: React.ReactNode;
  footer?: FooterOptions;
  submit?: React.ReactNode;
  nextStep?: string;
  validateFields?: FieldPath<T> | FieldPath<T>[];
};

type FormFooterProps<T extends FieldValues, U> = {
  footer?: FooterOptions;
  context: FormStepContext<T, U>;
  nextStep?: string;
  validateFields?: FieldPath<T> | FieldPath<T>[];
};

function FormFooter<T extends FieldValues, U>({ footer, context, nextStep, validateFields }: FormFooterProps<T, U>) {
  if (!footer || footer.hidden) return null;
  const { left, right } = footer;

  let leftButton = null;
  if (!left?.hidden) {
    if (left?.custom) {
      leftButton = left.custom;
    } else if (context.goToPreviousStep) {
      const label = left?.label ?? 'Retour';
      const linkOrActionOrMenu = left?.onClick ?? context.goToPreviousStep;
      leftButton = <ActionButton action={{ label, type: ActionType.Action, linkOrActionOrMenu }} />;
    } else if (context.onCancel) {
      const label = left?.label ?? 'Annuler';
      const linkOrActionOrMenu = context.onCancel;
      leftButton = <ActionButton action={{ label, linkOrActionOrMenu }} />;
    }
  }

  let rightButton = null;
  if (!right?.hidden) {
    if (right?.custom) {
      rightButton = right.custom;
    } else if (nextStep) {
      const label = right?.label ?? (right?.isSkip ? 'Passer' : 'Continuer');
      const type = right?.isSkip ? ActionType.Action : ActionType.Success;
      const linkOrActionOrMenu =
        right?.onClick ??
        (async () => {
          const isValid = await context.formMethods.trigger(validateFields);
          if (!isValid) return;
          context.goToStep(nextStep);
        });
      rightButton = <ActionButton action={{ label, type, linkOrActionOrMenu }} />;
    } else {
      const label = right?.label ?? 'Soumettre';
      rightButton = <SubmitButton label={label} loading={context.formMethods.formState.isSubmitting} />;
    }
  }

  return (
    <div className="grid md:grid-cols-2 md-max:grid-rows-2 gap-6">
      {leftButton ?? <div />}
      {rightButton ?? <div />}
    </div>
  );
}

export default function FormStep<T extends FieldValues, U>({
  contentClassName,
  context,
  header,
  customFooter,
  footer,
  children,
  nextStep,
  validateFields,
}: FormStepProps<T, U>) {
  return (
    <motion.div {...motionConfig}>
      <ModalLayout
        header={header}
        footer={
          <div className="bg-3">
            {customFooter}
            <FormFooter context={context} footer={footer} nextStep={nextStep} validateFields={validateFields} />
          </div>
        }
      >
        <div className={clsx(contentClassName, 'w-full')}>{children}</div>
      </ModalLayout>
    </motion.div>
  );
}
