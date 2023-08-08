import TextAreaInput from '../../molecules/Input/TextAreaInput';

import type { FormStepContext } from '../../organisms/Form/MultiStepForm';
import type { eventFormDefaultValues } from './EventForm';

type Context = Omit<FormStepContext<typeof eventFormDefaultValues>, 'goToStep' | 'goToPreviousStep' | 'onSubmit'>;
export default function EventPresentationStep({ values, setValues }: Context) {
  return (
    <div className="text-0 flex flex-col gap-4 max-w-[42rem]">
      <TextAreaInput
        defaultValue={values.description}
        onChange={(event) => setValues({ ...values, description: event.target.value })}
        label="Description des activités"
        name="description"
        rows={7}
      />
    </div>
  );
}
