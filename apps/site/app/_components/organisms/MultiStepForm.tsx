'use client';

import Button from '../molecules/Button/Button';
import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { AnyZodObject } from 'zod';

export type MultiStepFormProps<T extends AnyZodObject[]> = {
  steps: {
    zodSchema: T[number];
    title: string;
    icon: React.ReactNode;
    description?: string;
    render: () => React.ReactNode;
  }[];
  onSubmit: (values: T) => void;
};

export default function MultiStepForm<T extends AnyZodObject[]>({ steps, onSubmit }: MultiStepFormProps<T>) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  const methods = useForm({
    shouldUnregister: false,
    resolver: zodResolver(step.zodSchema),
    mode: 'onChange',
  });

  const render = useMemo(() => step.render(), [step]);

  return (
    <div>
      <div className="flex overflow-hidden">
        {steps.map((step, idx) => (
          <div key={idx} className="grow flex flex-col items-center py-2 px-4">
            <div className="w-7 h-7">{step.icon}</div>
            <div className="text-0 font-semibold">{step.title}</div>
          </div>
        ))}
      </div>
      {render}
      <div className="flex gap-6">
        <Button>Étape précédente</Button>
        <Button>Étape suivite</Button>
      </div>
    </div>
  );
}
