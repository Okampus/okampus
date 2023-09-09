import GroupItem from '../Item/GroupItem';
import { useTranslation } from '../../../hooks/context/useTranslation';
import { formatIBAN, objectEntries } from '@okampus/shared/utils';

import clsx from 'clsx';

import type { LegalUnitLocationMinimalInfo } from '../../../types/features/legal-unit-location.info';

export type BankInfoPreviewProps = {
  iban: string;
  holderName: string;
  bicSwift: string;
  bankInfoLocation?: LegalUnitLocationMinimalInfo | null;
};
export default function BankInfoPreview({ iban, holderName, bicSwift, bankInfoLocation }: BankInfoPreviewProps) {
  const { t } = useTranslation();

  const cleanIban = iban
    .replaceAll(/\s+/g, '')
    .replaceAll(/[^\da-z]/gi, '')
    .toUpperCase();

  const parts = {
    country: ['', 'XXXX'],
    bank: ['', 'XXXXX'],
    agency: ['', 'XXXXX'],
    bankAccountNumber: ['', 'XXXXXXXXXXX'],
    key: ['', 'XX'],
  };

  if (iban.startsWith('FR')) {
    if (cleanIban.length > 0) parts.country[0] = cleanIban.slice(0, 4);
    if (cleanIban.length > 4) parts.bank[0] = cleanIban.slice(4, 9);
    if (cleanIban.length > 8) parts.agency[0] = cleanIban.slice(9, 14);
    if (cleanIban.length > 12) parts.bankAccountNumber[0] = cleanIban.slice(14, 25);
    if (cleanIban.length > 22) parts.key[0] = cleanIban.slice(25, 27);
  }

  return (
    <div className="max-w-[36rem] scrollbar h-fit flex flex-col gap-10 lg:rounded-2xl bg-2 pl-6 md:pl-12 pr-6 md:pr-20 py-8">
      <GroupItem
        heading={t('bank.holderName')}
        groupClassName={clsx('font-medium', holderName ? 'text-0' : 'opacity-50')}
      >
        {holderName || 'XX XXXXXXXXXX XXXXX'}
      </GroupItem>
      <GroupItem heading={t('bank.iban')} groupClassName={clsx('font-medium', iban ? 'text-0' : 'opacity-50')}>
        {formatIBAN(iban) || 'XXXX XXXX XXXX XXXX XXXX XXXX XXX'}
      </GroupItem>
      <div className="flex gap-5 w-fit">
        {objectEntries(parts).map(([key, [value, placeholder]]) => (
          <GroupItem
            key={key}
            heading={t(`bank.${key}`)}
            groupClassName={clsx('font-medium', value ? 'text-0' : 'opacity-50')}
          >
            {value || placeholder}
          </GroupItem>
        ))}
      </div>
      <GroupItem heading={t('bank.bicSwift')} groupClassName={clsx('font-medium', bicSwift ? 'text-0' : 'opacity-50')}>
        {bicSwift || 'XXXXXXXXXXX'}
      </GroupItem>
      <GroupItem
        heading={t('bank.agency')}
        groupClassName={clsx('font-medium', bankInfoLocation ? 'text-0' : 'opacity-50')}
      >
        {bankInfoLocation
          ? `${bankInfoLocation.legalName} / ${bankInfoLocation.legalUnit?.legalName}`
          : 'XXX XXXXXXX / XX XXXXXXXXX (XXXXX)'}
      </GroupItem>
    </div>
  );
}
