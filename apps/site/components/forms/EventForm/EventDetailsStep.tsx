import DateInput from '../../molecules/Input/Date/DateInput';
import TextInput from '../../molecules/Input/TextInput';

import AddressSearchInput from '../../molecules/Input/Search/AddressSearchInput';

import type { FormStepContext } from '../../organisms/Form/MultiStepForm';
import type { eventFormDefaultValues } from './EventForm';

type Context = Omit<FormStepContext<typeof eventFormDefaultValues>, 'goToStep' | 'goToPreviousStep' | 'onSubmit'>;
export default function EventDetailsStep({ values, setValues }: Context) {
  return (
    <div className="text-0 flex flex-col gap-4 max-w-[42rem]">
      <TextInput
        label="Nom de l'événement"
        name="name"
        onChange={(event) => setValues({ ...values, name: event.target.value })}
        value={values.name}
      />
      <div className="grid grid-cols-[1fr_8rem] gap-4">
        <DateInput
          className="w-full"
          onChange={(event) => setValues({ ...values, startDate: event.target.value, endDate: event.target.value })}
          label="Date de début"
          name="startDate"
        />
        <TextInput
          name="startTime"
          type="time"
          value={values.startTime}
          onChange={(event) => setValues({ ...values, startTime: event.target.value })}
        />
      </div>
      <div className="grid grid-cols-[1fr_8rem] gap-4">
        <DateInput
          className="w-full"
          onChange={(event) => setValues({ ...values, endDate: event.target.value })}
          label="Date de fin"
          name="endDate"
        />
        <TextInput
          name="endTime"
          type="time"
          value={values.endTime}
          onChange={(event) => setValues({ ...values, endTime: event.target.value })}
        />
      </div>
      {values.isOnline ? (
        <TextInput
          // checkValueError={validateWebsite}
          label="Lien de l'événement"
          name="website"
          value={values.website}
          onChange={(event) => setValues({ ...values, website: event.target.value })}
        />
      ) : (
        <AddressSearchInput
          name="address"
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
