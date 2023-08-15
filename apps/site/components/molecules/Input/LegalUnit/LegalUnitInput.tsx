import AutoCompleteInput from '../Search/AutoCompleteInput';
import LegalUnitInputConfirm from '../InputConfirm/LegalUnitInputConfirm';
import AvatarLabeled from '../../Labeled/AvatarLabeled';

import { useModal } from '../../../../hooks/context/useModal';

import { useGetLegalUnitsLazyQuery, useInsertLegalUnitMutation } from '@okampus/shared/graphql';
import { LegalUnitType } from '@okampus/shared/enums';

import { useEffect, useState } from 'react';
import { useThrottle } from 'react-use';

import type { LegalUnitMinimalInfo } from '../../../../types/features/legal-unit.info';

export type LegalUnitInputProps = {
  name: string;
  value: LegalUnitMinimalInfo | null;
  type?: LegalUnitType;
  onChange: (value: LegalUnitMinimalInfo | null) => void;
  // autoFocus?: boolean;
  legalUnitQuery?: string;
  onQueryChange?: (value: string) => void;
};
export default function LegalUnitInput({
  name,
  value,
  type,
  onChange,
  // autoFocus,
  legalUnitQuery,
  onQueryChange,
}: LegalUnitInputProps) {
  const { openModal, closeModal } = useModal();

  const whereType = type ? { type: { _eq: type } } : {};

  const [searchText, setSearchText] = useState(legalUnitQuery ?? '');
  const throttledSearch = useThrottle(searchText, 1500);

  const variables = { where: { ...whereType, legalName: { _ilike: `%${throttledSearch}%` } }, limit: 7 };
  const [search, { data, loading, error }] = useGetLegalUnitsLazyQuery({ variables });

  useEffect(() => {
    if (throttledSearch) search();
  }, [throttledSearch, search]);

  const [insertLegalUnit] = useInsertLegalUnitMutation({
    onCompleted: ({ insertLegalUnitOne }) => {
      if (!insertLegalUnitOne) return;
      onChange(insertLegalUnitOne);
      closeModal();
    },
  });

  // const dataContainsValue = data ? data?.legalUnit.find((x) => x.id === value?.id) : false;
  // const items = data ? (dataContainsValue ? data?.legalUnit : value ? [value, ...data.legalUnit] : data.legalUnit) : [];
  const items = data?.legalUnit ?? [];

  const selectItems = items.map((item) => ({
    value: item,
    label: <AvatarLabeled type="team" name={item.legalName} website={item.actor.website} avatarSize={8} />,
    searchValue: item.legalName,
  }));
  const selected = value ? { value, label: value.legalName, searchValue: value.legalName } : null;

  return (
    <AutoCompleteInput
      // autoFocus={autoFocus}
      name={name}
      value={selected ? [selected.value] : []}
      onChange={(value) => onChange(value[0])}
      search={searchText}
      onChangeSearch={(value) => (onQueryChange ? onQueryChange(value) : setSearchText(value))}
      onAddCurrentSearch={(search: string) => {
        openModal({
          node: (
            <LegalUnitInputConfirm
              initialName={search}
              onSubmit={(name) =>
                insertLegalUnit({
                  variables: {
                    object: { type: type ?? LegalUnitType.Company, legalName: name, actor: { data: { name } } },
                  },
                })
              }
            />
          ),
        });
      }}
      options={selectItems}
      error={error ? error.message : undefined}
      loading={loading}
    />
  );
}
