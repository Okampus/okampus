import GroupItem from '../Item/GroupItem';
import { formatIban } from '@okampus/shared/utils';

import clsx from 'clsx';

import type { LegalUnitLocationMinimalInfo } from '@okampus/shared/graphql';

export type BankInfoPreviewProps = {
  iban: string;
  holderName: string;
  bicSwift: string;
  bankLocation?: LegalUnitLocationMinimalInfo | null;
};
export default function BankInfoPreview({ iban, holderName, bicSwift, bankLocation }: BankInfoPreviewProps) {
  const cleanIban = iban
    .replaceAll(/\s+/g, '')
    .replaceAll(/[^\da-z]/gi, '')
    .toUpperCase();

  const parts: Record<string, string> = {
    Pays: '',
    Banque: '',
    Agence: '',
    'N° de compte': '',
    Clé: '',
  };
  if (iban.startsWith('FR')) {
    if (cleanIban.length > 0) parts['Pays'] = cleanIban.slice(0, 4);
    if (cleanIban.length > 4) parts['Banque'] = cleanIban.slice(4, 9);
    if (cleanIban.length > 8) parts['Agence'] = cleanIban.slice(9, 14);
    if (cleanIban.length > 12) parts['N° de compte'] = cleanIban.slice(14, 25);
    if (cleanIban.length > 22) parts['Clé'] = cleanIban.slice(25, 27);
  }

  return (
    <div className="lg:w-fit h-fit flex flex-col gap-10 lg:rounded-2xl bg-2 pl-6 md:pl-12 pr-6 md:pr-20 py-8">
      <GroupItem heading="Titulaire" groupClassName={clsx('font-medium', holderName ? 'text-0' : 'opacity-50')}>
        {holderName || 'XX XXXXXXXXXX XXXXX'}
      </GroupItem>
      <GroupItem heading="IBAN" groupClassName={clsx('font-medium', iban ? 'text-0' : 'opacity-50')}>
        {formatIban(iban) || 'XXXX XXXX XXXX XXXX XXXX XXXX XXX'}
      </GroupItem>
      <div className="flex gap-5 w-fit">
        {Object.entries(parts).map(([key, value]) => (
          <GroupItem key={key} heading={key} groupClassName={clsx('font-medium', value ? 'text-0' : 'opacity-50')}>
            {value ||
              (key === 'Clé' ? 'XX' : key === 'Pays' ? 'XXXX' : key === 'N° de compte' ? 'XXXXXXXXXXX' : 'XXXXX')}
          </GroupItem>
        ))}
      </div>
      <GroupItem heading="Code BIC/SWIFT" groupClassName={clsx('font-medium', bicSwift ? 'text-0' : 'opacity-50')}>
        {bicSwift || 'XXXXXXXXXXX'}
      </GroupItem>
      <GroupItem heading="Agence" groupClassName={clsx('font-medium', bankLocation ? 'text-0' : 'opacity-50')}>
        {bankLocation
          ? `${bankLocation.legalName} / ${bankLocation.legalUnit?.legalName}`
          : 'XXX XXXXXXX / XX XXXXXXXXX (XXXXX)'}
      </GroupItem>
    </div>
  );
}
