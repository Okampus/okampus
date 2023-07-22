import TextInput from '../../molecules/Input/TextInput';

import type { FormStepContext } from '../../molecules/Form/MultiStepForm';
import type { eventFormDefaultValues } from './EventForm';

type Context = Omit<FormStepContext<typeof eventFormDefaultValues>, 'goToStep' | 'goToPreviousStep' | 'onSubmit'>;
export default function EventPresentationStep({ values, setValues }: Context) {
  return (
    <div className="text-0 flex flex-col gap-4 max-w-[42rem]">
      <TextInput
        value={values.description}
        onChange={(value) => setValues({ ...values, description: value })}
        options={{ label: 'Description des activités', name: 'name' }}
        rows={7}
      />
    </div>
  );
}
