'use client';

import AutoCompleteInput from './AutoCompleteInput';
import IHighlight from '../../../atoms/Inline/IHighlight';
import AvatarImage from '../../../atoms/Image/AvatarImage';

import { Users } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

import type { TeamMemberMinimalInfo } from '../../../../../types/features/team-member.info';
import type { ControlledInput } from '@okampus/shared/types';

export type TeamMemberSearchInputProps<T extends boolean> = {
  multiple?: T;
  teamMembers: TeamMemberMinimalInfo[];
  onChange: (teamMember: T extends true ? TeamMemberMinimalInfo[] : TeamMemberMinimalInfo | null) => void;
  teamMemberQuery?: string;
  onQueryChange?: (value: string) => void;
} & ControlledInput<TeamMemberMinimalInfo | null, T>;

const formatTeamMemberRoles = (teamMember: TeamMemberMinimalInfo) => {
  if (!teamMember) return '';
  const { teamMemberRoles } = teamMember;
  return teamMemberRoles.map((role) => role.teamRole.name).join(', ');
};

function TeamMemberSearchLabel({ highlight, teamMember }: { highlight: string; teamMember: TeamMemberMinimalInfo }) {
  return (
    <span className="flex items-center gap-2">
      <AvatarImage actor={teamMember.user.actor} className="h-5 w-5 shrink-0" type="user" size={24} />
      <IHighlight
        className="line-clamp-1 leading-4 h-5 shrink-0"
        text={teamMember.user.actor.name}
        highlight={highlight}
      />
      <span className="text-2 !font-medium text-sm line-clamp-1">{formatTeamMemberRoles(teamMember)}</span>
    </span>
  );
}

export default function TeamMemberSearchInput<T extends boolean>({
  multiple,
  teamMembers,
  teamMemberQuery,
  onQueryChange,
  placeholder = 'Rechercher un membre',
  ...props
}: TeamMemberSearchInputProps<T>) {
  const { name, value, onChange, error, className, label, disabled, required, description } = props;

  const [searchText, setSearchText] = useState(teamMemberQuery ?? '');

  useEffect(() => {
    if (teamMemberQuery) setSearchText(teamMemberQuery);
  }, [teamMemberQuery]);

  const teamMembersFiltered = teamMembers.filter((teamMember) =>
    teamMember.user.actor.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const selectedValues = (multiple ? value : value ? [value] : []) as TeamMemberMinimalInfo[];
  const selectItems = [
    ...teamMembersFiltered.map((value) => ({
      label: <TeamMemberSearchLabel highlight={searchText} teamMember={value} />,
      searchValue: formatTeamMemberRoles(value),
      value,
    })),
    ...selectedValues.map((value) => ({
      label: <TeamMemberSearchLabel highlight={searchText} teamMember={value} />,
      searchValue: formatTeamMemberRoles(value),
      value,
    })),
  ];

  return (
    <AutoCompleteInput
      name={name}
      className={className}
      multiple={multiple}
      label={label}
      disabled={disabled}
      placeholder={placeholder}
      required={required}
      description={description}
      error={error}
      value={selectedValues}
      onChange={(selectValue) =>
        onChange(
          (multiple ? selectValue : selectValue[0] ?? null) as T extends true
            ? TeamMemberMinimalInfo[]
            : TeamMemberMinimalInfo | null,
        )
      }
      search={searchText}
      onChangeSearch={(query) => (onQueryChange ? onQueryChange(query) : setSearchText(query))}
      options={selectItems}
      suffix={<Users />}
    />
  );
}
