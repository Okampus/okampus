'use client';

import AutoCompleteInput from './AutoCompleteInput';
import { IHighlight } from '../../../../components/atoms/Inline/IHighlight';
import { getGraphQLErrors } from '../../../../utils/apollo/get-graphql-errors';

import { useSearchLocationLazyQuery } from '@okampus/shared/graphql';
import { debounce, isKey, isNonNullObject } from '@okampus/shared/utils';

import { IconMapPin, IconMapPinFilled } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';

import type { ControlledInput, GeocodeAddress } from '@okampus/shared/types';

export type AddressSearchInputProps = {
  name: string;
  onChange: (location: GeocodeAddress | null) => void;
  addressQuery?: string;
  onQueryChange?: (value: string) => void;
};

const formatAddress = (address: GeocodeAddress) => {
  if (!address) return '';
  const { streetNumber, street, city, zip } = address;
  return `${streetNumber} ${street}, ${zip} ${city}`;
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
      <IconMapPinFilled />
      <IHighlight className="line-clamp-1 leading-4 h-4" text={address.name} highlight={highlight} />
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

  const [searchText, setSearchText] = useState(addressQuery ?? '');

  useEffect(() => {
    if (addressQuery) setSearchText(addressQuery);
  }, [addressQuery]);

  const [search, { data, loading, error: queryError }] = useSearchLocationLazyQuery({ context: { useApi: true } });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(debounce(search, 200), [search]);

  const [addresses, setAddresses] = useState<GeocodeAddress[]>([]);

  useEffect(() => {
    if (!loading) setAddresses(data?.searchLocation ?? []);
  }, [data, loading]);

  useEffect(() => {
    if (searchText) debouncedSearch({ variables: { query: searchText } });
  }, [debouncedSearch, searchText]);

  const selected = isAddress(value)
    ? { label: <AddressSearchLabel highlight={value.name} address={value} />, searchValue: formatAddress(value), value }
    : null;

  const selectItems = [
    ...addresses.map((value) => ({
      label: <AddressSearchLabel highlight={searchText} address={value} />,
      searchValue: formatAddress(value),
      value,
    })),
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
      error={queryError ? getGraphQLErrors(queryError)[0].message : error}
      loading={loading}
      value={selected?.value ? [selected.value] : []}
      onChange={(selectValue) => onChange(selectValue[0] ?? null)}
      search={searchText}
      onChangeSearch={(query) => (onQueryChange ? onQueryChange(query) : setSearchText(query))}
      options={selectItems}
      suffix={<IconMapPin />}
    />
  );
}
