import AutoCompleteInput from './AutoCompleteInput';
import LegalUnitInputConfirm from './InputConfirm/LegalUnitInputConfirm';
import AvatarLabeled from '../Labeled/AvatarLabeled';

import { useModal } from '../../../hooks/context/useModal';

import { LegalUnitType } from '@okampus/shared/enums';
import { legalUnitMinimalInfo, insertLegalUnitMutation, useTypedLazyQuery } from '@okampus/shared/graphql';

import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useThrottle } from 'react-use';

import type { LegalUnitMinimalInfo } from '@okampus/shared/graphql';

export type LegalUnitInputProps = {
  value: LegalUnitMinimalInfo | null;
  type?: LegalUnitType;
  onChange: (value: LegalUnitMinimalInfo | null) => void;
  autoFocus?: boolean;
  legalUnitQuery?: string;
  onQueryChange?: (value: string) => void;
};
export default function LegalUnitInput({
  value,
  type,
  onChange,
  autoFocus,
  legalUnitQuery,
  onQueryChange,
}: LegalUnitInputProps) {
  const { openModal, closeModal } = useModal();

  const whereType = type ? { type: { _eq: type } } : {};

  const [searchText, setSearchText] = useState(legalUnitQuery ?? '');
  const throttledSearch = useThrottle(searchText, 1500);

  const [search, { data, loading, error }] = useTypedLazyQuery({
    legalUnit: [
      { where: { ...whereType, legalName: { _ilike: `%${throttledSearch}%` } }, limit: 7 },
      legalUnitMinimalInfo,
    ],
  });

  useEffect(() => setSearchText(legalUnitQuery ?? ''), [legalUnitQuery]);

  useEffect(() => {
    if (throttledSearch) search();
  }, [throttledSearch, search]);

  // @ts-ignore
  const [insertLegalUnit] = useMutation(insertLegalUnitMutation, {
    onCompleted: ({ insertLegalUnitOne }) => {
      if (!insertLegalUnitOne) return;
      onChange(insertLegalUnitOne);
      closeModal();
    },
  });

  // const dataContainsValue = data ? data?.legalUnit.find((x) => x.id === value?.id) : false;
  // const items = data ? (dataContainsValue ? data?.legalUnit : value ? [value, ...data.legalUnit] : data.legalUnit) : [];
  const items = data?.legalUnit ?? [];

  const selectItems = items.map((x) => ({
    value: x,
    label: <AvatarLabeled type="team" name={x.legalName} website={x.actor.website} avatarSize={8} />,
    searchValue: x.legalName,
  }));
  const selected = value ? { value, label: value.legalName, searchValue: value.legalName } : null;

  return (
    <AutoCompleteInput
      autoFocus={autoFocus}
      value={selected}
      onChange={(x) => onChange(x?.value ?? null)}
      onChangeSearchValue={(value) => (onQueryChange ? onQueryChange(value) : setSearchText(value))}
      addCurrentSearch={() => {
        openModal(
          <LegalUnitInputConfirm
            initialName={searchText}
            onSubmit={(name) =>
              insertLegalUnit({
                variables: {
                  // @ts-ignore
                  object: {
                    type: type ?? LegalUnitType.Company,
                    legalName: name,
                    actor: { data: { name } },
                  },
                },
              })
            }
          />
        );
      }}
      searchValue={searchText}
      items={selectItems}
      error={error ? new Error(JSON.stringify(error)) : error}
      loading={loading}
    />
  );
}
