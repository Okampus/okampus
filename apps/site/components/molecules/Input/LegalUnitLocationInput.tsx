import AutoCompleteInput from './Search/AutoCompleteInput';
import LegalUnitInputConfirm from './InputConfirm/LegalUnitInputConfirm';
import AvatarLabeled from '../Labeled/AvatarLabeled';
import { useModal } from '../../../hooks/context/useModal';

import {
  useTypedLazyQuery,
  legalUnitLocationMinimalInfo,
  insertLegalUnitLocationMutation,
} from '@okampus/shared/graphql';

import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useThrottle } from 'react-use';

import type { LegalUnitLocationMinimalInfo } from '@okampus/shared/graphql';

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

  const [search, { data, loading, error }] = useTypedLazyQuery({
    legalUnitLocation: [
      { where: { legalName: { _ilike: `%${throttledSearch}%` } }, limit: 7 },
      legalUnitLocationMinimalInfo,
    ],
  });

  useEffect(() => {
    if (throttledSearch) search();
  }, [throttledSearch, search]);

  // @ts-ignore
  const [insertLegalLocationUnit] = useMutation(insertLegalUnitLocationMutation, {
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
      value={selected}
      onChange={(value) => onChange((value as LegalUnitLocationMinimalInfo) ?? null)}
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
                  // @ts-ignore
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
