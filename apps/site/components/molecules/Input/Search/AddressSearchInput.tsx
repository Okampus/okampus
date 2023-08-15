'use client';

import AutoCompleteInput from './AutoCompleteInput';

import { useSearchLocationLazyQuery } from '@okampus/shared/graphql';
import { useEffect, useState } from 'react';

import { useThrottle } from 'react-use';
import type { GeocodeAddress, SelectItem } from '@okampus/shared/types';

export type AddressSearchInputProps = {
  name: string;
  value: GeocodeAddress | null;
  onChange: (location: GeocodeAddress | null) => void;
  addressQuery?: string;
  onQueryChange?: (value: string) => void;
};

const formatAddress = (address: GeocodeAddress) => {
  if (!address) return '';
  const { streetNumber, street, city, zip } = address;
  return `${streetNumber} ${street}, ${zip} ${city}`;
};

export default function AddressSearchInput({
  name,
  value,
  onChange,
  addressQuery,
  onQueryChange,
}: AddressSearchInputProps) {
  const [searchText, setSearchText] = useState(value ? formatAddress(value) : '');

  useEffect(() => {
    if (addressQuery) setSearchText(addressQuery);
  }, [addressQuery]);

  const throttledSearch = useThrottle(searchText, 1500);

  const [search, { data, loading, error }] = useSearchLocationLazyQuery({
    variables: { query: throttledSearch },
    context: { useApi: true },
  });

  const [addresses, setAddresses] = useState<GeocodeAddress[]>([]);
  useEffect(() => {
    if (!loading) setAddresses(data?.searchLocation ?? []);
  }, [data, loading]);

  useEffect(() => {
    if (throttledSearch) search();
  }, [throttledSearch, search]);

  const selectItems = addresses.map((geocodeAddress) => {
    const label = formatAddress(geocodeAddress);
    return { value: geocodeAddress, label, searchValue: label };
  });

  const selected = value ? { value, label: formatAddress(value), searchValue: formatAddress(value) } : null;

  return (
    <AutoCompleteInput
      name={name}
      error={error ? error.message : undefined}
      loading={loading}
      value={selected?.value ? [selected.value] : []}
      onChange={(selectValue) => onChange(selectValue[0])}
      search={searchText}
      onChangeSearch={(query) => (onQueryChange ? onQueryChange(query) : setSearchText(query))}
      options={selectItems as SelectItem<GeocodeAddress, true>[]}
    />
  );
}
