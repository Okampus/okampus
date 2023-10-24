'use client';

import TeamMemberSearchInput from '../../../molecules/Input/Search/TeamMemberSearchInput';
import FormStep from '../../../organisms/Form/FormStep';

import { isNotNull } from '@okampus/shared/utils';
import { Controller } from 'react-hook-form';

import type { EventFormStepProps } from './EventForm';

export default function EventSupervisorsStep(context: EventFormStepProps) {
  return (
    <FormStep
      context={context}
      header="Responsables de l'événement"
      nextStep="summary"
      validateFields={['supervisors']}
    >
      <Controller
        control={context.formMethods.control}
        name="supervisors"
        render={({ field }) => {
          return (
            <TeamMemberSearchInput
              error={context.formMethods.formState.errors.supervisors?.message}
              multiple={true}
              name={field.name}
              onChange={(supervisors) => {
                field.onChange(supervisors);
                context.formMethods.setValue('supervisors', supervisors);
                if (supervisors) context.formMethods.clearErrors('supervisors');
              }}
              teamMembers={context.data.teamManage.teamMembers}
              value={field.value
                .map(({ id }) => context.data.teamManage.teamMembers.find((teamMember) => teamMember.id === id))
                .filter(isNotNull)}
            />
          );
        }}
      />
    </FormStep>
  );
}
