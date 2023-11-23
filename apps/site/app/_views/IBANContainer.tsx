import { formatAddress } from '../../utils/format/format-address';
import { Block } from '../_components/atoms/Container/Block';
import { Locale } from '../../server/ssr/getLang';

import { formatIBAN, objectEntries } from '@okampus/shared/utils';

import { useLocale, useTranslations } from 'next-intl';
import type { AddressMinimal } from '../../types/prisma/Address/address-minimal';

export type BankAccountInfoPreviewProps = {
  iban: string;
  ownerName: string;
  bicSwift: string;
  branchAddress?: AddressMinimal | null;
};
export default function IBANContainer({ iban, ownerName, bicSwift, branchAddress }: BankAccountInfoPreviewProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations();

  const cleanIban = iban
    .replaceAll(/\s+/g, '')
    .replaceAll(/[^\da-z]/gi, '')
    .toUpperCase();

  const parts = {
    country: ['', 'XXXX'],
    bank: ['', 'XXXXX'],
    agency: ['', 'XXXXX'],
    moneyAccountNumber: ['', 'XXXXXXXXXXX'],
    key: ['', 'XX'],
  };

  if (iban.startsWith('FR')) {
    if (cleanIban.length > 0) parts.country[0] = cleanIban.slice(0, 4);
    if (cleanIban.length > 4) parts.bank[0] = cleanIban.slice(4, 9);
    if (cleanIban.length > 8) parts.agency[0] = cleanIban.slice(9, 14);
    if (cleanIban.length > 12) parts.moneyAccountNumber[0] = cleanIban.slice(14, 25);
    if (cleanIban.length > 22) parts.key[0] = cleanIban.slice(25, 27);
  }

  return (
    <div className="max-w-[36rem] scrollbar h-fit flex flex-col gap-10 lg:rounded-2xl bg-2 pl-6 md:pl-12 pr-6 md:pr-20 py-8">
      <Block disabled={!ownerName} title={t('Bank.ownerName')}>
        {ownerName || 'XX XXXXXXXXXX XXXXX'}
      </Block>
      <Block title={t('Bank.iban')} disabled={!iban}>
        {formatIBAN(iban) || 'XXXX XXXX XXXX XXXX XXXX XXXX XXX'}
      </Block>
      <div className="flex gap-5 w-fit">
        {objectEntries(parts).map(([key, [value, placeholder]]) => (
          <Block key={key} title={t(`Bank.${key}`)} disabled={!value}>
            {value || placeholder}
          </Block>
        ))}
      </div>
      <Block title={t('Bank.bicSwift')} disabled={!bicSwift}>
        {bicSwift || 'XXXXXXXXXXX'}
      </Block>
      <Block title={t('Bank.agency')} disabled={!bicSwift}>
        {branchAddress ? formatAddress(locale, branchAddress) : 'XX XXX XX XXXXXXXXX (XXXXX)'}
      </Block>
    </div>
  );
}
