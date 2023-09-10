'use client';

import TeamMemberSearchInput from '../../../../components/molecules/Input/Search/TeamMemberSearchInput';
import { isNotNull } from '@okampus/shared/utils';

import { Controller } from 'react-hook-form';
import type { EventFormStepProps } from './EventForm';

export default function EventSupervisorsStep({
  methods: { formMethods },
  context: { teamManage },
}: EventFormStepProps) {
  return (
    <Controller
      control={formMethods.control}
      name="supervisors"
      render={({ field }) => {
        return (
          <TeamMemberSearchInput
            error={formMethods.formState.errors.supervisors?.message}
            name={field.name}
            multiple={true}
            value={field.value
              .map(({ id }) => teamManage.teamMembers.find((teamMember) => teamMember.id === id))
              .filter(isNotNull)}
            onChange={(supervisors) => {
              field.onChange(supervisors);
              formMethods.setValue('supervisors', supervisors);
              if (supervisors) formMethods.clearErrors('supervisors');
            }}
            teamMembers={teamManage.teamMembers}
          />
        );
      }}
    />
  );
}
