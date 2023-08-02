'use client';

import GroupItem from '../atoms/Item/GroupItem';
import BankInfoPreview from '../atoms/Preview/BankInfoPreview';

import TextInput from '../molecules/Input/TextInput';
import LegalUnitInput from '../molecules/Input/LegalUnitInput';
import ActionButton from '../molecules/Button/ActionButton';
import LegalUnitLocationInput from '../molecules/Input/LegalUnitLocationInput';

import { validateIBAN } from '../../utils/form-validation/iban';

import { LegalUnitType } from '@okampus/shared/enums';
import { ActionType } from '@okampus/shared/types';
import { formatIBAN } from '@okampus/shared/utils';
import { useState } from 'react';

import type { ActorBaseInfo, LegalUnitLocationMinimalInfo, LegalUnitMinimalInfo } from '@okampus/shared/graphql';

function formatBicSwift(bicSwift: string) {
  if (!bicSwift) return '';
  return bicSwift
    .slice(0, 11)
    .replaceAll(/\s\s+/g, ' ')
    .replaceAll(/[^\da-z]/gi, '')
    .toUpperCase();
}

type BankInfoProps = {
  bankLocation: LegalUnitLocationMinimalInfo;
  bicSwift: string;
  iban: string;
  holderName: string;
};

export type BankInfoFormProps = {
  actor: ActorBaseInfo;
  onSubmit: ({ bankLocation, bicSwift, holderName, iban }: BankInfoProps) => void;
};
export default function BankInfoForm({ actor, onSubmit }: BankInfoFormProps) {
  const [iban, setIban] = useState('');
  const [canContinue, setCanContinue] = useState<boolean>(false);

  const [bank, setBank] = useState<LegalUnitMinimalInfo | null>(null);
  const [bicSwift, setBicSwift] = useState('');
  const [bankLocation, setBankLocation] = useState<LegalUnitLocationMinimalInfo | null>(null);
  const [holderName, setHolderName] = useState(actor?.name || '');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_36rem] gap-14">
      <div className="flex flex-col gap-5 py-1">
        <div className="flex flex-col gap-4">
          <TextInput options={{ label: 'Nom du titulaire du compte' }} value={holderName} onChange={setHolderName} />
          <TextInput
            format={formatIBAN}
            checkValueOn={{ length: 33 }}
            infoText={!canContinue && 'Exemple: FR76 0000 1000 0000 0225 4793 751'}
            value={iban}
            onChange={setIban}
            options={{ label: 'IBAN' }}
            checkValueError={validateIBAN}
            onErrorChange={(error) => setCanContinue(!error)}
          />
        </div>
        {canContinue && (
          <div className="flex flex-col gap-4">
            <GroupItem heading="Banque correspondante">
              <LegalUnitInput type={LegalUnitType.Bank} value={bank} onChange={setBank} />
              <TextInput
                options={{ label: 'Code BIC/SWIFT (présent sur le RIB)' }}
                format={formatBicSwift}
                value={bicSwift}
                onChange={setBicSwift}
              />
            </GroupItem>
            {bank && (
              <>
                <GroupItem heading="Nom de l'agence">
                  <LegalUnitLocationInput
                    headerLabel="Ajouter votre agence"
                    inputLabel="Nom de l'agence"
                    legalUnitId={bank.id}
                    value={bankLocation}
                    onChange={setBankLocation}
                  />
                </GroupItem>
              </>
            )}
          </div>
        )}
        {bankLocation && holderName && bank && bicSwift && (
          <ActionButton
            className="mt-4"
            action={{
              type: ActionType.Success,
              label: 'Valider votre RIB',
              linkOrActionOrMenu: () =>
                onSubmit({ bankLocation, bicSwift, holderName, iban: iban.replaceAll(' ', '') }),
            }}
          />
        )}
      </div>
      <BankInfoPreview iban={iban} bicSwift={bicSwift} holderName={holderName} bankLocation={bankLocation} />
    </div>
  );
}
