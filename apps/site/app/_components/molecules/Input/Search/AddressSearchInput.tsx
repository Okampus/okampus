'use client';

import AutoCompleteInput from './AutoCompleteInput';
import IHighlight from '../../../../_components/atoms/Inline/IHighlight';
import { trpcClient } from '../../../../_context/trpcClient';
import { formatAddress } from '../../../../../utils/format/format-address';

import { isKey, isNonNullObject } from '@okampus/shared/utils';

import { IconMapPin, IconMapPinFilled } from '@tabler/icons-react';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';

import type { ControlledInput, GeocodeAddress } from '@okampus/shared/types';

export type AddressSearchInputProps = {
  onChange: (location: GeocodeAddress | null) => void;
  addressQuery?: string;
  onQueryChange?: (value: string) => void;
};

function isAddress(address: unknown): address is GeocodeAddress {
  return (
    isNonNullObject(address) &&
    isKey('latitude', address) &&
    isKey('longitude', address) &&
    typeof address.latitude === 'number' &&
    typeof address.longitude === 'number'
  );
}

function AddressSearchLabel({ highlight, address }: { highlight: string; address: GeocodeAddress }) {
  return (
    <span className="flex items-center gap-2">
      <IconMapPinFilled className="h-5 w-5 shrink-0" />
      <IHighlight className="line-clamp-1 leading-4 h-5 shrink-0" text={address.name} highlight={highlight} />
      <span className="text-2 !font-medium text-sm line-clamp-1">{formatAddress(address)}</span>
    </span>
  );
}

export default function AddressSearchInput({
  addressQuery,
  onQueryChange,
  placeholder = 'Rechercher une adresse',
  ...props
}: AddressSearchInputProps & ControlledInput<GeocodeAddress | null>) {
  const { name, value, onChange, error, className, label, disabled, required, description } = props;

  const [search, setSearchText] = useState(addressQuery ?? '');

  useEffect(() => {
    if (addressQuery) setSearchText(addressQuery);
  }, [addressQuery]);

  const searchAddress = trpcClient.searchAddress.useQuery({ query: search }, { enabled: !!search });

  const onChangeSearch = useCallback(
    onQueryChange
      ? (query: string) => {
          onQueryChange(query);
          setSearchText(query);
        }
      : setSearchText,
    [onQueryChange, setSearchText],
  );

  const debouncedOnChangeSearch = debounce(onChangeSearch, 200);

  const selected = isAddress(value)
    ? { label: <AddressSearchLabel highlight={value.name} address={value} />, searchValue: formatAddress(value), value }
    : null;

  const selectItems = [
    ...(searchAddress.data?.map((value) => ({
      label: <AddressSearchLabel highlight={search} address={value} />,
      searchValue: formatAddress(value),
      value,
    })) ?? []),
    ...(selected ? [selected] : []),
  ];

  return (
    <AutoCompleteInput
      name={name}
      className={className}
      label={label}
      disabled={disabled}
      placeholder={placeholder}
      required={required}
      description={description}
      error={searchAddress.error ? searchAddress.error.message : error}
      loading={searchAddress.isLoading}
      value={selected?.value ? [selected.value] : []}
      onChange={(selectValue) => onChange(selectValue[0] ?? null)}
      search={search}
      onChangeSearch={debouncedOnChangeSearch}
      options={selectItems}
      suffix={<IconMapPin />}
    />
  );
}
