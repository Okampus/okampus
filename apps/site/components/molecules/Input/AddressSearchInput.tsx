'use client';

import AutoCompleteInput from './AutoCompleteInput';
// import ComboBoxInput from './ComboBoxInput';

import { geocodeAddressBaseInfo, useTypedLazyQuery } from '@okampus/shared/graphql';
import { useEffect, useState } from 'react';

import { useThrottle } from 'react-use';
import type { GeocodeAddress } from '@okampus/shared/types';

export type AddressSearchInputProps = {
  value: GeocodeAddress | null;
  onChange: (location: GeocodeAddress | null) => void;
  addressQuery?: string;
  onQueryChange?: (value: string) => void;
};

const formatAddress = (address: GeocodeAddress | null) => {
  if (!address) return '';
  const { streetNumber, street, city, zip } = address;
  return `${streetNumber} ${street}, ${zip} ${city}`;
};

export default function AddressSearchInput({ value, onChange, addressQuery, onQueryChange }: AddressSearchInputProps) {
  const [searchText, setSearchText] = useState(value ? formatAddress(value) : '');

  useEffect(() => {
    if (addressQuery) setSearchText(addressQuery);
  }, [addressQuery]);

  const throttledSearch = useThrottle(searchText, 1500);

  const [search, { data, loading, error }] = useTypedLazyQuery(
    { searchLocation: [{ query: throttledSearch }, geocodeAddressBaseInfo] },
    { apolloOptions: { context: { useApi: true } } }
  );

  const [addresses, setAddresses] = useState<GeocodeAddress[]>([]);
  useEffect(() => {
    if (!loading) setAddresses(data?.searchLocation || []);
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
      error={error}
      loading={loading}
      value={selected}
      onChange={(selectValue) => onChange(selectValue?.value || null)}
      searchValue={searchText}
      onChangeSearchValue={(query) => (onQueryChange ? onQueryChange(query) : setSearchText(query))}
      items={selectItems}
    />
  );
}
