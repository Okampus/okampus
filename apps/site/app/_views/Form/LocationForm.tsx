import Field from '../../_components/molecules/Input/Field';
import FieldSet from '../../_components/molecules/Input/FieldSet';
import RadioInput from '../../_components/molecules/Input/Uncontrolled/String/RadioInput';

import TextInput from '../../_components/molecules/Input/Uncontrolled/String/TextInput';

import AddressSearchInput from '../../_components/molecules/Input/Controlled/Search/SearchAddressInput';
// import TextAreaInput from '../molecules/Input/TextAreaInput';

import { MapPin, Question, VideoCamera } from '@phosphor-icons/react/dist/ssr';

import clsx from 'clsx';
import * as z from 'zod';

import type { AddressMinimal } from '../../../types/prisma/Address/address-minimal';
import type { useForm } from 'react-hook-form';

export type LocationFormProps = {
  formMethods: ReturnType<
    typeof useForm<{ location: { isOnline: boolean; type: string; address: string; name: string } }>
  >;
  className?: string;
  allowUnspecified?: boolean;
};

export const locationSchema = z.object({
  location: z.object({
    type: z.string(),
    address: z.any().nullable() as z.ZodType<AddressMinimal | null>,
    details: z.string(),
    link: z.string(),
    name: z.string(),
  }),
});

export default function LocationForm({ formMethods, className, allowUnspecified = true }: LocationFormProps) {
  const type = formMethods.watch('location.type');
  const address = formMethods.watch('location.address');

  // const addressError = formMethods.formState.errors.location?.address;
  // if (!addressError && type === LocationType.Physical && (!address?.latitude || !address?.longitude))
  //   formMethods.setError('location.address', { type: 'custom', message: 'Veuillez sélectionner une adresse.' });

  return (
    <div className={clsx(className, 'flex flex-col gap-2.5')}>
      <FieldSet className="flex xl-max:flex-col w-full gap-3">
        <RadioInput
          {...formMethods.register('location.type')}
          // value={LocationType.Physical}
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
          // value={LocationType.Online}
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
            value={undefined}
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
      {type && (
        <>
          {type === 'Online' ? (
            <>
              <Field label="Nom de la plateforme">
                <TextInput
                  name="location.name"
                  error={formMethods.formState.errors.location?.name && 'Veuillez entrer un nom de plateforme/lien.'}
                  // {...formMethods.register('location.name')}
                  placeholder="Nom de la plateforme"
                />
              </Field>
              <Field label="Précisions">
                <TextInput
                  name="location.link"
                  // TODO: input type url
                  //  type="url"
                  placeholder="Lien (optionnel)"
                />
              </Field>
            </>
          ) : (
            <>
              <Field label="Adresse">
                <AddressSearchInput
                  error={formMethods.formState.errors.location?.address?.message}
                  control={formMethods.control}
                  name="location.address"
                />
              </Field>
              <Field label="Nom du lieu">
                <TextInput name="location.name" placeholder="Nom du lieu" />
              </Field>
            </>
          )}
        </>
      )}
      {/* <TextAreaInput {...formMethods.register('location.details')} placeholder="Indications & détails" rows={4} /> */}
    </div>
  );
}
