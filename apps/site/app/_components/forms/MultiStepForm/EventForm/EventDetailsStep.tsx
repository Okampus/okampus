'use client';

import DateInput from '../../../molecules/Input/Date/DateInput';
import TextInput from '../../../molecules/Input/TextInput';
import AddressSearchInput from '../../../molecules/Input/Search/AddressSearchInput';
import FormStep from '../../../organisms/Form/FormStep';

import { Controller } from 'react-hook-form';

import type { EventFormStepProps } from './EventForm';

export default function EventDetailsStep(context: EventFormStepProps) {
  const { control, formState, register, setValue, watch } = context.formMethods;

  const isOnline = watch('isOnline');

  return (
    <FormStep
      context={context}
      contentClassName="text-0 flex flex-col gap-4 max-w-[42rem]"
      header="Détails de l'événement"
      nextStep="presentation"
      validateFields={isOnline ? ['name', 'start', 'end', 'website'] : ['name', 'start', 'end', 'address']}
    >
      <TextInput error={formState.errors.name?.message} label="Nom de l'événement" {...register('name')} />
      <DateInput
        error={formState.errors.start?.message}
        label="Date et heure de début"
        includeTime={true}
        {...register('start', {
          onChange: (event) => {
            setValue(
              'end',
              // @ts-ignore - valueAsDate is not in the type
              new Date(event.target.valueAsDate.getTime() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16),
            );
          },
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
          control={control}
          name="address"
          render={({ field }) => (
            <AddressSearchInput
              error={formState.errors.address?.message}
              label="Adresse de l'événement"
              name={field.name}
              onChange={field.onChange}
              value={field.value}
            />
          )}
        />
      )}
    </FormStep>
  );
}
