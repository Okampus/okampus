import ViewLayout from './ViewLayout';
import { clsx } from 'clsx';
import { useState } from 'react';
import { IconCircleCheck } from '@tabler/icons-react';

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
  header?: string;
  scrollable?: boolean;
  bottomPadded?: boolean;
  initialStep?: number;
  className?: string;
  steps: MultiStepPageStep<T>[];
  onSubmit: (values: T) => void;
};

export default function MultiStepPageLayout<T>({
  initialData,
  header,
  scrollable = true,
  bottomPadded = true,
  initialStep,
  className,
  steps,
  onSubmit,
}: MultiStepPageLayoutProps<T>) {
  const [currentStep, setCurrentStep] = useState(initialStep ?? 0);
  const [data, setData] = useState<T>(initialData);

  const goToPreviousStep = () => setCurrentStep(currentStep - 1);
  const goToNextStep = () => setCurrentStep(currentStep + 1);

  const step = steps[currentStep];

  if (!step) return null;

  return (
    <>
      <ViewLayout innerClassName={className} header={header} bottomPadded={bottomPadded} scrollable={scrollable}>
        {header && <div className="page-title mb-10">{header}</div>}
        {step.render({ values: data, setValues: setData, goToPreviousStep, goToNextStep, onSubmit })}
      </ViewLayout>

      <div className="my-[var(--py-content)] w-full flex flex-col">
        {steps.map((step, idx) => (
          <div key={idx} className={clsx(idx !== currentStep && 'opacity-50', 'p-4')}>
            <div className="flex items-start gap-3 font-semibold text-0 mb-1">
              {idx > currentStep ? (
                <IconCircleCheck className="text-2" />
              ) : (
                <IconCircleCheck className="text-[var(--success)]" />
              )}
              {step.title}
            </div>
            {step.subtitle && <div className="pl-9 text-sm text-2 font-medium">{step.subtitle}</div>}
          </div>
        ))}
      </div>
    </>
  );
}
