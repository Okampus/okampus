'use client';

import SimpleList from '../molecules/List/SimpleList';
import BankInfoPreview from '../atoms/Preview/BankInfoPreview';

import SubmitButton from '../molecules/Button/SubmitButton';
import TextInput from '../molecules/Input/TextInput';
import LegalUnitInput from '../molecules/Input/LegalUnit/LegalUnitInput';
import AddressSearchInput from '../molecules/Input/Search/AddressSearchInput';

import { validateIBAN } from '../../../utils/form-validation/iban';

import { formatBicSwift, formatIBAN } from '@okampus/shared/utils';

import { LegalUnitType } from '@prisma/client';
import { Controller, useForm } from 'react-hook-form';

import type { ActorMinimalInfo } from '../../../types/features/actor.info';
import type { LegalUnitMinimalInfo } from '../../../types/features/legal-unit.info';
import type { GeocodeAddress } from '@okampus/shared/types';

type BankInfoValues = {
  bank: LegalUnitMinimalInfo | null;
  bicSwift: string;
  branchAddress: GeocodeAddress | null;
  holderName: string;
  iban: string;
};

export type BankFormProps = {
  actor: ActorMinimalInfo;
  onSubmit: ({ bank, bicSwift, holderName, iban }: BankInfoValues) => Promise<void>;
};
export default function BankForm({ actor, onSubmit: submit }: BankFormProps) {
  const defaultValues: BankInfoValues = {
    bank: null,
    bicSwift: '',
    branchAddress: null,
    holderName: actor.name,
    iban: '',
  };

  const { register, control, handleSubmit, formState, watch } = useForm({ defaultValues });

  const onSubmit = handleSubmit(submit);

  const bank = watch('bank');
  const branchAddress = watch('branchAddress');
  const iban = watch('iban');
  const bicSwift = watch('bicSwift');
  const holderName = watch('holderName');

  return (
    <form className="grid grid-cols-1 lg:grid-cols-[1fr_36rem] gap-14" onSubmit={onSubmit}>
      <div className="flex flex-col gap-5 py-1">
        <div className="flex flex-col gap-4">
          <TextInput {...register('holderName')} label="Nom du titulaire du compte" />
          <TextInput
            {...register('iban', { validate: validateIBAN, setValueAs: formatIBAN })}
            description="Exemple: FR76 0000 1000 0000 0225 4793 751"
            label="IBAN"
          />
        </div>
        {!formState.errors.iban && (
          <div className="flex flex-col gap-4">
            <SimpleList heading="Banque correspondante">
              <Controller
                control={control}
                name="bank"
                render={({ field }) => (
                  <LegalUnitInput
                    name={field.name}
                    type={LegalUnitType.Bank}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <TextInput
                {...register('bicSwift', { setValueAs: formatBicSwift })}
                label="Code BIC/SWIFT (présent sur le RIB)"
              />
            </SimpleList>
            {bank && (
              <Controller
                control={control}
                name="branchAddress"
                render={({ field }) => (
                  <AddressSearchInput
                    label="Adresse de l'agence"
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            )}
          </div>
        )}
        {branchAddress && iban && holderName && bicSwift && (
          <SubmitButton loading={formState.isSubmitting} label="Valider votre RIB" />
        )}
      </div>
      <BankInfoPreview iban={iban} bicSwift={bicSwift} holderName={holderName} branchAddress={branchAddress} />
    </form>
  );
}
