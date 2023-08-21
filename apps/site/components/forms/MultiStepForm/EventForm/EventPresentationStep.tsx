import TextAreaInput from '../../../molecules/Input/TextAreaInput';

import type { EventFormStepProps } from './EventForm';

export default function EventPresentationStep({ methods: { formMethods } }: EventFormStepProps) {
  return (
    <div className="text-0 flex flex-col gap-4 max-w-[42rem]">
      <TextAreaInput
        error={formMethods.formState.errors.description?.message}
        label="Description des activités"
        rows={7}
        {...formMethods.register('description')}
      />
    </div>
  );
}
