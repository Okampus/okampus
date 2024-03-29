'use client';

import ComboBoxInput from '../ComboBox/ComboBoxInput';
import IHighlight from '../../../../atoms/Inline/IHighlight';

import { formatAddress } from '../../../../../../utils/format/format-address';

import { jsonFetcher } from '../../../../../../utils/json-fetcher';
import { MapPin } from '@phosphor-icons/react';
import { useLocale } from 'next-intl';

import type { Locale } from '../../../../../../server/ssr/getLang';
import type { AddressMinimal } from '../../../../../../types/prisma/Address/address-minimal';
import type { ControlledInput } from '@okampus/shared/types';

const getOptionsKey = (search: string) => (search ? `/api/search/address?search=${search}` : null);
export default function AddressSearchInput(props: ControlledInput<AddressMinimal, true>) {
  const locale = useLocale() as Locale;
  return (
    <ComboBoxInput
      {...props}
      placeholder={props.placeholder || 'Rechercher une adresse'}
      getOptionsKey={getOptionsKey}
      getOptions={async (searchUrl) => {
        if (!searchUrl) return [];
        return jsonFetcher(searchUrl).then((addresses: AddressMinimal[]) => {
          return addresses.map((address) => ({
            searchText: formatAddress(locale, address),
            value: address,
            label: (
              <span className="flex items-center gap-2">
                <MapPin weight="fill" className="h-5 w-5 shrink-0" />
                <IHighlight
                  className="line-clamp-1 leading-4 h-5 shrink-0"
                  text={address.name}
                  highlight={searchUrl.split('=')[1]}
                />
                <span className="text-2 !font-medium text-sm line-clamp-1">{formatAddress(locale, address)}</span>
              </span>
            ),
          }));
        });
      }}
    />
  );
}
