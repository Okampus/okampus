'use client';

import ViewLayout from './ViewLayout';
import SidePanel from '../../layouts/SidePanel';
import ActionButton from '../../molecules/Button/ActionButton';

import { clsx } from 'clsx';
import { useState } from 'react';
import { CheckCircle } from '@phosphor-icons/react';

import type { ViewLayoutProps } from './ViewLayout';

export type MultiStepPageStepContext<T> = {
  values: T;
  setValues: (values: T) => void;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
  onSubmit: (values: T) => void;
};

export type MultiStepPageStep<T> = {
  skip?: () => void;
  render: (ctx: MultiStepPageStepContext<T>) => React.ReactNode;
  title: string;
  subtitle?: string;
};

export type MultiStepPageLayoutProps<T> = {
  initialData: T;
  initialStep?: number;
  steps: MultiStepPageStep<T>[];
  onSubmit: (values: T) => void;
} & Omit<ViewLayoutProps, 'children'>;

export default function MultiStepPageLayout<T>({
  initialData,
  initialStep,
  steps,
  onSubmit,
  ...viewLayoutProps
}: MultiStepPageLayoutProps<T>) {
  const [currentStep, setCurrentStep] = useState(initialStep ?? 0);
  const [data, setData] = useState<T>(initialData);

  const goToPreviousStep = () => setCurrentStep(currentStep - 1);
  const goToNextStep = () => setCurrentStep(currentStep + 1);

  const step = steps[currentStep];

  if (!step) return null;

  return (
    <>
      <ViewLayout
        {...viewLayoutProps}
        sidePanelIcon={
          <ActionButton
            action={{
              label: `${currentStep + 1} / ${steps.length}`,
            }}
          />
        }
      >
        {step.render({ values: data, setValues: setData, goToPreviousStep, goToNextStep, onSubmit })}
      </ViewLayout>

      <SidePanel>
        <div className="my-[var(--py-content)] w-full flex flex-col">
          {steps.map((step, idx) => (
            <div key={step.title} className={clsx(idx !== currentStep && 'opacity-50', 'p-4')}>
              <div className="flex items-start gap-3 font-semibold text-0 mb-1">
                {idx > currentStep ? (
                  <CheckCircle className="text-2" />
                ) : (
                  <CheckCircle className="text-[var(--success)]" />
                )}
                {step.title}
              </div>
              {step.subtitle && <div className="pl-9 text-sm text-2 font-medium">{step.subtitle}</div>}
            </div>
          ))}
        </div>
      </SidePanel>
    </>
  );
}
