'use client';

import TextAreaInput from '../../../molecules/Input/TextAreaInput';
import FormStep from '../../../organisms/Form/FormStep';

import type { EventFormStepProps } from './EventForm';

export default function EventPresentationStep(context: EventFormStepProps) {
  return (
    <FormStep
      context={context}
      contentClassName="text-0 flex flex-col gap-4 max-w-[42rem]"
      header="Présentation de l'événement"
      validateFields={['description']}
    >
      <TextAreaInput
        {...context.formMethods.register('description')}
        error={context.formMethods.formState.errors.description?.message}
        label="Description des activités"
        rows={7}
      />
    </FormStep>
  );
}
