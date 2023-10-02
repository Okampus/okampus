import SimpleList from '../../molecules/List/SimpleList';

import { useTranslation } from '../../../_hooks/context/useTranslation';
import { formatAddress } from '../../../../utils/format/format-address';

import { formatIBAN, objectEntries } from '@okampus/shared/utils';

import clsx from 'clsx';

import type { GeocodeAddress } from '@okampus/shared/types';

export type BankInfoPreviewProps = {
  iban: string;
  holderName: string;
  bicSwift: string;
  branchAddress?: GeocodeAddress | null;
};
export default function BankInfoPreview({ iban, holderName, bicSwift, branchAddress }: BankInfoPreviewProps) {
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
      <SimpleList
        heading={t('bank.holderName')}
        groupClassName={clsx('font-medium', holderName ? 'text-0' : 'opacity-50')}
      >
        {holderName || 'XX XXXXXXXXXX XXXXX'}
      </SimpleList>
      <SimpleList heading={t('bank.iban')} groupClassName={clsx('font-medium', iban ? 'text-0' : 'opacity-50')}>
        {formatIBAN(iban) || 'XXXX XXXX XXXX XXXX XXXX XXXX XXX'}
      </SimpleList>
      <div className="flex gap-5 w-fit">
        {objectEntries(parts).map(([key, [value, placeholder]]) => (
          <SimpleList
            key={key}
            heading={t(`bank.${key}`)}
            groupClassName={clsx('font-medium', value ? 'text-0' : 'opacity-50')}
          >
            {value || placeholder}
          </SimpleList>
        ))}
      </div>
      <SimpleList heading={t('bank.bicSwift')} groupClassName={clsx('font-medium', bicSwift ? 'text-0' : 'opacity-50')}>
        {bicSwift || 'XXXXXXXXXXX'}
      </SimpleList>
      <SimpleList
        heading={t('bank.agency')}
        groupClassName={clsx('font-medium', branchAddress ? 'text-0' : 'opacity-50')}
      >
        {branchAddress ? formatAddress(branchAddress) : 'XX XXX XX XXXXXXXXX (XXXXX)'}
      </SimpleList>
    </div>
  );
}
