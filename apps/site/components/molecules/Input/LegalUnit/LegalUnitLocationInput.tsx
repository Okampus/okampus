import AutoCompleteInput from '../Search/AutoCompleteInput';
import LegalUnitInputConfirm from '../InputConfirm/LegalUnitInputConfirm';
import AvatarLabeled from '../../Labeled/AvatarLabeled';

import { useModal } from '../../../../hooks/context/useModal';

import { useGetLegalUnitLocationsLazyQuery, useInsertLegalUnitLocationMutation } from '@okampus/shared/graphql';

import { useEffect, useState } from 'react';
import { useThrottle } from 'react-use';

import type { LegalUnitLocationMinimalInfo } from '../../../../types/features/legal-unit-location.info';

export type LegalUnitLocationInputProps = {
  name: string;
  headerLabel?: string;
  inputLabel?: string;
  legalUnitId: string;
  value: LegalUnitLocationMinimalInfo | null;
  onChange: (value: LegalUnitLocationMinimalInfo | null) => void;
};
export default function LegalUnitLocationInput({
  name,
  headerLabel,
  inputLabel,
  legalUnitId,
  value,
  onChange,
}: LegalUnitLocationInputProps) {
  const { openModal, closeModal } = useModal();

  const [searchText, setSearchText] = useState('');
  const throttledSearch = useThrottle(searchText, 1500);

  const variables = { where: { legalName: { _ilike: `%${throttledSearch}%` } }, limit: 7 };
  const [search, { data, loading, error }] = useGetLegalUnitLocationsLazyQuery({ variables });

  useEffect(() => {
    if (throttledSearch) search();
  }, [throttledSearch, search]);

  const [insertLegalLocationUnit] = useInsertLegalUnitLocationMutation({
    onCompleted: ({ insertLegalUnitLocationOne }) => {
      if (!insertLegalUnitLocationOne) return;
      onChange(insertLegalUnitLocationOne);
      closeModal();
    },
  });

  const items = data?.legalUnitLocation ?? [];

  const selectItems = items.map((item) => ({
    value: item,
    label: <AvatarLabeled type="team" name={item.legalName} website={item.actor.website} avatarSize={8} />,
    searchValue: item.legalName,
  }));
  const selected = value ? { value, label: value.legalName, searchValue: value.legalName } : null;

  return (
    <AutoCompleteInput
      name={name}
      value={selected ? [selected.value] : []}
      onChange={(value) => onChange(value[0])}
      error={error ? error.message : undefined}
      loading={loading}
      options={selectItems}
      search={searchText}
      onChangeSearch={setSearchText}
      onAddCurrentSearch={() => {
        openModal({
          node: (
            <LegalUnitInputConfirm
              headerLabel={headerLabel}
              inputPlaceholder={inputLabel}
              initialName={searchText}
              onSubmit={(name) =>
                insertLegalLocationUnit({
                  variables: { object: { legalUnitId, legalName: name, actor: { data: { name } } } },
                })
              }
            />
          ),
        });
      }}
    />
  );
}
