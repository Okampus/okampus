'use client';

import GroupItem from '../atoms/Item/GroupItem';
import BankInfoPreview from '../atoms/Preview/BankInfoPreview';

import SubmitButton from '../molecules/Button/SubmitButton';
import TextInput from '../molecules/Input/TextInput';
import LegalUnitInput from '../molecules/Input/LegalUnit/LegalUnitInput';
import LegalUnitLocationInput from '../molecules/Input/LegalUnit/LegalUnitLocationInput';

import { validateIBAN } from '../../utils/form-validation/iban';

import { LegalUnitType } from '@okampus/shared/enums';
import { formatBicSwift, formatIBAN } from '@okampus/shared/utils';
import { useForm } from 'react-hook-form';

import type { ActorMinimalInfo } from '../../types/features/actor.info';
import type { LegalUnitLocationMinimalInfo } from '../../types/features/legal-unit-location.info';
import type { LegalUnitMinimalInfo } from '../../types/features/legal-unit.info';

type BankInfoValues = {
  bankInfoLocation: LegalUnitLocationMinimalInfo | null;
  bankInfo: LegalUnitMinimalInfo | null;
  bicSwift: string;
  iban: string;
  holderName: string;
};

export type BankFormProps = {
  actor: ActorMinimalInfo;
  onSubmit: ({ bankInfoLocation, bankInfo, bicSwift, holderName, iban }: BankInfoValues) => Promise<void>;
};
export default function BankForm({ actor, onSubmit: submit }: BankFormProps) {
  const defaultValues: BankInfoValues = {
    iban: '',
    bicSwift: '',
    bankInfoLocation: null,
    bankInfo: null,
    holderName: actor.name,
  };

  const { register, setValue, handleSubmit, formState, watch } = useForm({
    defaultValues,
    // format: { iban: formatIBAN, bicSwift: formatBicSwift },
    // submit,
    // validate: { iban: { check: validateIBAN } },
  });

  const onSubmit = handleSubmit((values) => submit(values));

  const bankInfo = watch('bankInfo');
  const bankInfoLocation = watch('bankInfoLocation');
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
            <GroupItem heading="Banque correspondante">
              <LegalUnitInput
                name="bankInfo"
                type={LegalUnitType.Bank}
                value={bankInfo}
                onChange={(value) => setValue('bankInfo', value)}
              />
              <TextInput
                {...register('bicSwift', { setValueAs: formatBicSwift })}
                label="Code BIC/SWIFT (présent sur le RIB)"
              />
            </GroupItem>
            {bankInfo && (
              <>
                <GroupItem heading="Nom de l'agence">
                  <LegalUnitLocationInput
                    name="bankInfoLocation"
                    headerLabel="Ajouter votre agence"
                    inputLabel="Nom de l'agence"
                    legalUnitId={bankInfo.id}
                    value={bankInfoLocation}
                    onChange={(value) => setValue('bankInfoLocation', value)}
                  />
                </GroupItem>
              </>
            )}
          </div>
        )}
        {bankInfoLocation && iban && holderName && bicSwift && (
          <SubmitButton loading={formState.isSubmitting} label="Valider votre RIB" />
        )}
      </div>
      <BankInfoPreview iban={iban} bicSwift={bicSwift} holderName={holderName} bankInfoLocation={bankInfoLocation} />
    </form>
  );
}
