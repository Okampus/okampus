import Field from '../molecules/Input/Field';
import FieldSet from '../molecules/Input/FieldSet';
import RadioInput from '../molecules/Input/Selector/RadioInput';

import TextInput from '../molecules/Input/TextInput';

import AddressSearchInput from '../molecules/Input/Search/AddressSearchInput';
import TextAreaInput from '../molecules/Input/TextAreaInput';

import { LocationType } from '@prisma/client';

import { MapPin, Question, VideoCamera } from '@phosphor-icons/react/dist/ssr';

import clsx from 'clsx';
import { Controller } from 'react-hook-form';
import * as z from 'zod';

import type { AddressMinimalInfo } from '../../../types/features/address.info';
import type { LocationMinimalInfo } from '../../../types/features/location.info';
import type { useForm } from 'react-hook-form';

export type LocationFormProps = {
  formMethods: ReturnType<typeof useForm<{ location: LocationMinimalInfo }>>;
  className?: string;
  allowUnspecified?: boolean;
};

export const locationSchema = z.object({
  location: z.object({
    type: z.string(),
    address: z.any().nullable() as z.ZodType<AddressMinimalInfo | null>,
    details: z.string(),
    link: z.string(),
    name: z.string(),
  }),
});

export default function LocationForm({ formMethods, className, allowUnspecified = true }: LocationFormProps) {
  const type = formMethods.watch('location.type');
  const address = formMethods.watch('location.address');

  const addressError = formMethods.formState.errors.location?.address;
  if (!addressError && type === LocationType.Address && (!address?.latitude || !address?.longitude))
    formMethods.setError('location.address', { type: 'custom', message: 'Veuillez sélectionner une adresse.' });

  return (
    <div className={clsx(className, 'flex flex-col gap-2.5')}>
      <FieldSet className="flex xl-max:flex-col w-full gap-3">
        <RadioInput
          {...formMethods.register('location.type')}
          value={LocationType.Address}
          label={
            <div className="flex gap-2">
              <MapPin className="w-6 h-6" />
              <div>
                <div className="text-1 font-medium shrink-0">En personne</div>
                <div className="text-2 text-sm">Adresse physique</div>
              </div>
            </div>
          }
        />
        <RadioInput
          {...formMethods.register('location.type')}
          value={LocationType.Online}
          label={
            <div className="flex gap-2">
              <VideoCamera className="w-6 h-6" />
              <div>
                <div className="text-1 font-medium shrink-0">En ligne</div>
                <div className="text-2 text-sm">Lien ou plateforme</div>
              </div>
            </div>
          }
        />
        {allowUnspecified && (
          <RadioInput
            {...formMethods.register('location.type')}
            value={LocationType.Unspecificed}
            label={
              <div className="flex gap-2">
                <Question className="w-6 h-6" />
                <div>
                  <div className="text-1 font-medium shrink-0">Non spécifié</div>
                  <div className="text-2 text-sm">À déterminer</div>
                </div>
              </div>
            }
          />
        )}
      </FieldSet>
      {type !== LocationType.Unspecificed && (
        <>
          {type === LocationType.Online ? (
            <>
              <Field label="Nom de la plateforme">
                <TextInput
                  error={formMethods.formState.errors.location?.name && 'Veuillez entrer un nom de plateforme/lien.'}
                  {...formMethods.register('location.name')}
                  placeholder="Nom de la plateforme"
                />
              </Field>
              <Field label="Précisions">
                <TextInput type="url" {...formMethods.register('location.link')} placeholder="Lien (optionnel)" />
              </Field>
            </>
          ) : (
            <>
              <Field label="Adresse">
                <Controller
                  control={formMethods.control}
                  name="location.address"
                  render={({ field }) => (
                    <AddressSearchInput
                      error={formMethods.formState.errors.location?.address?.message}
                      name={field.name}
                      value={field.value ?? null}
                      onChange={(address) => {
                        field.onChange(address);
                        formMethods.setValue('location.name', address?.name ?? '');
                        if (address) formMethods.clearErrors('location.address');
                      }}
                    />
                  )}
                />
              </Field>
              <Field label="Nom du lieu">
                <TextInput {...formMethods.register('location.name')} placeholder="Nom du lieu" />
              </Field>
            </>
          )}
        </>
      )}
      <TextAreaInput {...formMethods.register('location.details')} placeholder="Indications & détails" rows={4} />
    </div>
  );
}
