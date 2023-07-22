import DateInput from '../../molecules/Input/DateInput';
import TextInput from '../../molecules/Input/TextInput';
import { validateWebsite } from '../../../utils/form-validation/website';

import AddressSearchInput from '../../molecules/Input/AddressSearchInput';

import type { FormStepContext } from '../../molecules/Form/MultiStepForm';
import type { eventFormDefaultValues } from './EventForm';

type Context = Omit<FormStepContext<typeof eventFormDefaultValues>, 'goToStep' | 'goToPreviousStep' | 'onSubmit'>;
export default function EventDetailsStep({ values, setValues }: Context) {
  return (
    <div className="text-0 flex flex-col gap-4 max-w-[42rem]">
      <TextInput
        value={values.name}
        onChange={(value) => setValues({ ...values, name: value })}
        options={{ label: "Nom de l'événement", name: 'name' }}
      />
      <div className="grid grid-cols-[1fr_8rem] gap-4">
        <DateInput
          className="w-full"
          date={values.startDate}
          onChange={(date) => setValues({ ...values, startDate: date, endDate: date })}
          options={{ label: 'Date de début', name: 'startDate' }}
        />
        <input
          className="input"
          type="time"
          value={values.startTime}
          onChange={(e) => setValues({ ...values, startTime: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-[1fr_8rem] gap-4">
        <DateInput
          className="w-full"
          date={values.endDate}
          onChange={(date) => setValues({ ...values, endDate: date })}
          options={{ label: 'Date de fin', name: 'endDate' }}
        />
        <input
          className="input"
          type="time"
          value={values.endTime}
          onChange={(e) => setValues({ ...values, endTime: e.target.value })}
        />
      </div>
      {values.isOnline ? (
        <TextInput
          checkValueError={validateWebsite}
          value={values.website}
          onChange={(value) => setValues({ ...values, website: value })}
          options={{ label: "Lien de l'événement", name: 'website' }}
        />
      ) : (
        <AddressSearchInput
          value={values.address}
          onChange={(address) => setValues({ ...values, address })}
          addressQuery={values.addressQuery}
          onQueryChange={(addressQuery) => {
            setValues({ ...values, addressQuery });
          }}
        />
      )}
    </div>
  );
}
