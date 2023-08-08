'use client';

import GroupItem from '../atoms/Item/GroupItem';
import BankInfoPreview from '../atoms/Preview/BankInfoPreview';

import SubmitButton from '../molecules/Button/SubmitButton';
import TextInput from '../molecules/Input/TextInput';
import LegalUnitInput from '../molecules/Input/LegalUnitInput';
import LegalUnitLocationInput from '../molecules/Input/LegalUnitLocationInput';

// import { useForm } from '../../hooks/form/useForm';
// import { validateIBAN } from '../../utils/form-validation/iban';

import { LegalUnitType } from '@okampus/shared/enums';
// import { formatIBAN } from '@okampus/shared/utils';

import { useForm } from 'react-hook-form';

import type { ActorBaseInfo, LegalUnitLocationMinimalInfo, LegalUnitMinimalInfo } from '@okampus/shared/graphql';

function formatBicSwift(bicSwift: string) {
  if (!bicSwift) return '';
  return bicSwift
    .slice(0, 11)
    .replaceAll(/\s\s+/g, ' ')
    .replaceAll(/[^\da-z]/gi, '')
    .toUpperCase();
}

type BankInfoValues = {
  bankLocation: LegalUnitLocationMinimalInfo | null;
  bank: LegalUnitMinimalInfo | null;
  bicSwift: string;
  iban: string;
  holderName: string;
};

export type BankInfoFormProps = {
  actor: ActorBaseInfo;
  submit: ({ bankLocation, bank, bicSwift, holderName, iban }: BankInfoValues) => Promise<void>;
};
export default function BankInfoForm({ actor, submit }: BankInfoFormProps) {
  const defaultValues: BankInfoValues = {
    iban: '',
    bicSwift: '',
    bankLocation: null,
    bank: null,
    holderName: actor.name,
  };

  const { register, setValue, handleSubmit, formState, watch } = useForm({
    defaultValues,
    // format: { iban: formatIBAN, bicSwift: formatBicSwift },
    // submit,
    // validate: { iban: { check: validateIBAN } },
  });

  const onSubmit = handleSubmit((values) => submit(values));

  const bank = watch('bank');
  const bankLocation = watch('bankLocation');
  const iban = watch('iban');
  const bicSwift = watch('bicSwift');
  const holderName = watch('holderName');

  return (
    <form className="grid grid-cols-1 lg:grid-cols-[1fr_36rem] gap-14" onSubmit={onSubmit}>
      <div className="flex flex-col gap-5 py-1">
        <div className="flex flex-col gap-4">
          <TextInput {...register('holderName')} label="Nom du titulaire du compte" />
          <TextInput {...register('iban')} description="Exemple: FR76 0000 1000 0000 0225 4793 751" label="IBAN" />
        </div>
        {!formState.errors.iban && (
          <div className="flex flex-col gap-4">
            <GroupItem heading="Banque correspondante">
              <LegalUnitInput
                name="bank"
                type={LegalUnitType.Bank}
                value={bank}
                onChange={(value) => setValue('bank', value)}
              />
              <TextInput {...register('bicSwift')} label="Code BIC/SWIFT (présent sur le RIB)" />
            </GroupItem>
            {bank && (
              <>
                <GroupItem heading="Nom de l'agence">
                  <LegalUnitLocationInput
                    name="bankLocation"
                    headerLabel="Ajouter votre agence"
                    inputLabel="Nom de l'agence"
                    legalUnitId={bank.id}
                    value={bankLocation}
                    onChange={(value) => setValue('bankLocation', value)}
                  />
                </GroupItem>
              </>
            )}
          </div>
        )}
        {bankLocation && iban && holderName && bicSwift && <SubmitButton label="Valider votre RIB" />}
      </div>
      <BankInfoPreview iban={iban} bicSwift={bicSwift} holderName={holderName} bankLocation={bankLocation} />
    </form>
  );
}
