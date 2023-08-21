import DateInput from '../../../molecules/Input/Date/DateInput';
import TextInput from '../../../molecules/Input/TextInput';
import AddressSearchInput from '../../../molecules/Input/Search/AddressSearchInput';

import { Controller } from 'react-hook-form';

import type { EventFormStepProps } from './EventForm';

export default function EventDetailsStep({ methods: { formMethods } }: EventFormStepProps) {
  const { formState, register, setValue, watch } = formMethods;

  const isOnline = watch('isOnline');

  return (
    <div className="text-0 flex flex-col gap-4 max-w-[42rem]">
      <TextInput error={formState.errors.name?.message} label="Nom de l'événement" {...register('name')} />
      <DateInput
        error={formState.errors.start?.message}
        label="Date et heure de début"
        includeTime={true}
        {...register('start', {
          onChange: (event) => setValue('end', new Date(event.target.valueAsDate.getTime() + 2 * 60 * 60 * 1000)),
          valueAsDate: true,
        })}
      />
      <DateInput
        error={formState.errors.end?.message}
        label="Date et heure de fin"
        includeTime={true}
        {...register('end', { valueAsDate: true })}
      />
      {isOnline ? (
        <TextInput error={formState.errors.website?.message} label="Lien de l'événement" {...register('website')} />
      ) : (
        <Controller
          name="address"
          render={({ field }) => (
            <AddressSearchInput error={formState.errors.address?.message} label="Adresse de l'événement" {...field} />
          )}
        />
      )}
    </div>
  );
}
