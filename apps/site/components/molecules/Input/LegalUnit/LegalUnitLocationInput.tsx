import AutoCompleteInput from '../Search/AutoCompleteInput';
import LegalUnitInputConfirm from '../InputConfirm/LegalUnitInputConfirm';
import AvatarLabeled from '../../Labeled/AvatarLabeled';

import { useModal } from '../../../../hooks/context/useModal';

import { getGraphQLErrors } from '../../../../utils/apollo/get-graphql-errors';

import { LegalUnitLocationType } from '@okampus/shared/enums';
import { useGetLegalUnitLocationsLazyQuery, useInsertLegalUnitLocationMutation } from '@okampus/shared/graphql';

import { useEffect, useState } from 'react';
import { useThrottle } from 'react-use';

import type { ControlledInput } from '@okampus/shared/types';
import type { LegalUnitLocationMinimalInfo } from '../../../../types/features/legal-unit-location.info';

export type LegalUnitLocationInputProps = {
  type?: LegalUnitLocationType;
  headerLabel?: string;
  inputLabel?: string;
  onChange: (value: LegalUnitLocationMinimalInfo | null) => void;
  legalUnitId: string;
  legalUnitQuery?: string;
  onQueryChange?: (value: string) => void;
};

export default function LegalUnitLocationInput({
  type,
  headerLabel,
  inputLabel,
  legalUnitId,
  legalUnitQuery,
  onQueryChange,
  ...props
}: LegalUnitLocationInputProps & ControlledInput<LegalUnitLocationMinimalInfo | null>) {
  const { openModal, closeModal } = useModal();
  const { name, value, onChange, error, className, label, disabled, required, description, loading } = props;

  const whereType = type ? { type: { _eq: type } } : {};

  const [searchText, setSearchText] = useState(legalUnitQuery ?? '');
  const throttledSearch = useThrottle(searchText, 1500);

  const variables = { where: { ...whereType, legalName: { _ilike: `%${throttledSearch}%` } }, limit: 7 };
  const [search, { data, loading: queryLoading, error: errorQuery }] = useGetLegalUnitLocationsLazyQuery({ variables });

  useEffect(() => {
    if (throttledSearch) search();
  }, [throttledSearch, search]);

  const [insertLegalUnitLocation] = useInsertLegalUnitLocationMutation({
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
      // autoFocus={autoFocus}
      name={name}
      className={className}
      label={label}
      disabled={disabled}
      required={required}
      description={description}
      value={selected ? [selected.value] : []}
      onChange={(value) => onChange(value[0])}
      search={searchText}
      onChangeSearch={(value) => (onQueryChange ? onQueryChange(value) : setSearchText(value))}
      onAddCurrentSearch={(search: string) => {
        openModal({
          node: (
            <LegalUnitInputConfirm
              initialName={search}
              headerLabel={headerLabel}
              inputPlaceholder={inputLabel}
              onSubmit={(name) => {
                const object = {
                  legalUnitId,
                  legalName: name,
                  actor: { data: { name } },
                };
                insertLegalUnitLocation({ variables: { object } });
              }}
            />
          ),
        });
      }}
      options={selectItems}
      error={errorQuery ? getGraphQLErrors(errorQuery)[0].message ?? error : error}
      loading={loading ?? queryLoading}
    />
  );
}
