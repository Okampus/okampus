'use client';

import DateInput from '../../../molecules/Input/Date/DateInput';
import TeamMemberSearchInput from '../../../molecules/Input/Search/TeamMemberSearchInput';
import SelectInput from '../../../molecules/Input/Select/SelectInput';
import TextInput from '../../../molecules/Input/TextInput';
import TextAreaInput from '../../../molecules/Input/TextAreaInput';

import { isNotNull } from '@okampus/shared/utils';

import { Controller } from 'react-hook-form';

import type { EventFormStepProps } from './EventForm';

export default function EventSummaryStep({ methods: { formMethods }, context: { teamManage } }: EventFormStepProps) {
  const errors = formMethods.formState.errors;

  return (
    <div className="w-full grid grid-cols-2 gap-4 md-max:flex-col">
      <div className="flex flex-col gap-4">
        <TextInput error={errors.projectId?.message} label="Nom de l'événement" {...formMethods.register('name')} />
        <DateInput
          error={errors.start?.message}
          includeTime={true}
          label="Date de début"
          {...formMethods.register('start', { valueAsDate: true })}
          defaultValue={formMethods.getValues('start').toISOString().slice(0, 16)}
        />
        <Controller
          control={formMethods.control}
          name="supervisors"
          render={({ field }) => {
            return (
              <TeamMemberSearchInput
                label="Responsables"
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
      </div>
      <div className="flex flex-col gap-4">
        <Controller
          control={formMethods.control}
          name="projectId"
          render={({ field }) => (
            <SelectInput
              error={errors.projectId?.message}
              options={[
                { label: 'Nouveau projet', value: null },
                ...(teamManage.projects.map((item) => ({ label: item.name, value: item.id })) ?? []),
              ]}
              label="Projet lié"
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              value={field.value}
            />
          )}
        />
        <DateInput
          error={errors.end?.message}
          includeTime={true}
          label="Date de fin"
          {...formMethods.register('end', { valueAsDate: true })}
          defaultValue={formMethods.getValues('end').toISOString().slice(0, 16)}
        />
        <TextAreaInput
          error={errors.description?.message}
          label="Description des activités"
          rows={12}
          {...formMethods.register('description')}
        />
      </div>
    </div>
  );
}
