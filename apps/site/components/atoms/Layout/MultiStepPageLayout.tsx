import {
  // useEffect,
  useState,
} from 'react';
// import { IconCircleCheck } from '@tabler/icons-react';
import clsx from 'clsx';

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
  header?: React.ReactNode;
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

  // useEffect(
  //   () =>
  //     setSidePanel({
  //       id: 'multistep',
  //       panel: (
  //         <div className="mt-4 w-full flex flex-col">
  //           {steps.map((step, index) => (
  //             <div key={index} className={clsx(index !== currentStep && 'opacity-50', 'p-4')}>
  //               <div className="flex items-start gap-3 font-semibold text-0 mb-1">
  //                 {index > currentStep ? (
  //                   <IconCircleCheck className="text-2" />
  //                 ) : (
  //                   <IconCircleCheck className="text-[var(--success)]" />
  //                 )}
  //                 {step.title}
  //               </div>
  //               {step.subtitle && <div className="pl-9 text-sm text-2 font-medium">{step.subtitle}</div>}
  //             </div>
  //           ))}
  //         </div>
  //       ),
  //       priority: 2,
  //     }),
  //   [steps, currentStep, setSidePanel]
  // );

  // useEffect(() => () => removeSidePanel('multistep'), [removeSidePanel]);

  const goToPreviousStep = () => setCurrentStep(currentStep - 1);
  const goToNextStep = () => setCurrentStep(currentStep + 1);

  const step = steps[currentStep];

  if (!step) return null;

  return (
    <section
      className={clsx(
        'w-full px-[var(--px-content)] pt-[var(--py-content)]',
        className,
        scrollable && 'overflow-y-scroll overflow-x-hidden scrollbar',
        bottomPadded && 'pb-[var(--pb-app)]',
      )}
    >
      {header && <div className="page-title mb-10">{header}</div>}
      {step.render({ values: data, setValues: setData, goToPreviousStep, goToNextStep, onSubmit })}
    </section>
  );
}
