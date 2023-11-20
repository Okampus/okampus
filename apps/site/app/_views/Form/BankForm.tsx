'use client';

import IBANContainer from '../IBANContainer';

import SubmitButton from '../../_components/molecules/Form/SubmitButton';
import TextInput from '../../_components/molecules/Input/Uncontrolled/String/TextInput';
import LegalUnitInput from '../../_components/molecules/Input/Controlled/Search/SearchLegalUnitInput';
import AddressSearchInput from '../../_components/molecules/Input/Controlled/Search/SearchAddressInput';

import { useForm } from 'react-hook-form';

import type { LegalUnitMinimal } from '../../../types/prisma/LegalUnit/legal-unit-minimal';
import type { ActorWithTags } from '../../../types/prisma/Actor/actor-with-tags';
import type { AddressMinimal } from '../../../types/prisma/Address/address-minimal';

type BankAccountInfoValues = {
  bank: LegalUnitMinimal | undefined;
  bicSwift: string;
  branchAddress: AddressMinimal | undefined;
  ownerName: string;
  iban: string;
};

export type BankFormProps = {
  actor: ActorWithTags;
  onSubmit: ({ bank, bicSwift, ownerName, iban }: BankAccountInfoValues) => Promise<void>;
};
export default function BankForm({ actor, onSubmit: submit }: BankFormProps) {
  const defaultValues: BankAccountInfoValues = {
    bank: undefined,
    bicSwift: '',
    branchAddress: undefined,
    ownerName: actor.name,
    iban: '',
  };

  const { register, control, handleSubmit, formState, watch } = useForm({ defaultValues });

  const onSubmit = handleSubmit(submit);

  const bank = watch('bank');
  const branchAddress = watch('branchAddress');
  const iban = watch('iban');
  const bicSwift = watch('bicSwift');
  const ownerName = watch('ownerName');

  return (
    // TODO: zod, validateIban, ActionForm
    <form className="grid grid-cols-1 lg:grid-cols-[1fr_36rem] gap-14" onSubmit={onSubmit}>
      <div className="flex flex-col gap-5 py-1">
        <div className="flex flex-col gap-4">
          <TextInput name="ownerName" label="Nom du titulaire du compte" />
          <TextInput
            name="name"
            // {...register('iban', { validate: validateIBAN, setValueAs: formatIBAN })}
            description="Exemple: FR76 0000 1000 0000 0225 4793 751"
            label="IBAN"
          />
        </div>
        {!formState.errors.iban && (
          <div className="flex flex-col gap-4">
            {/*             < heading="Banque correspondante"> */}
            <LegalUnitInput control={control} name="bank" />
            <TextInput
              name="bicSwift"
              // {...register('bicSwift', { setValueAs: formatBicSwift })}
              label="Code BIC/SWIFT (présent sur le RIB)"
            />
            {/*             </> */}
            {bank && <AddressSearchInput label="Adresse de l'agence" control={control} name="branchAddress" />}
          </div>
        )}
        {branchAddress && iban && ownerName && bicSwift && (
          <SubmitButton loading={formState.isSubmitting} label="Valider votre RIB" />
        )}
      </div>
      <IBANContainer iban={iban} bicSwift={bicSwift} ownerName={ownerName} branchAddress={branchAddress} />
    </form>
  );
}
