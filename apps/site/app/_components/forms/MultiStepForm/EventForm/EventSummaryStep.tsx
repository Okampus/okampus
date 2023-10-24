'use client';

import DateInput from '../../../molecules/Input/Date/DateInput';
import TeamMemberSearchInput from '../../../molecules/Input/Search/TeamMemberSearchInput';
import SelectInput from '../../../molecules/Input/Select/SelectInput';
import TextInput from '../../../molecules/Input/TextInput';
import TextAreaInput from '../../../molecules/Input/TextAreaInput';
import FormStep from '../../../organisms/Form/FormStep';

import { isNotNull } from '@okampus/shared/utils';

import { Controller } from 'react-hook-form';

import type { EventFormStepProps } from './EventForm';

export default function EventSummaryStep(context: EventFormStepProps) {
  const errors = context.formMethods.formState.errors;

  return (
    <FormStep context={context} contentClassName="w-full grid grid-cols-2 gap-4 md-max:flex-col" header="Récapitulatif">
      <div className="flex flex-col gap-4">
        <TextInput
          error={errors.projectId?.message}
          label="Nom de l'événement"
          {...context.formMethods.register('name')}
        />
        <DateInput
          defaultValue={context.formMethods.getValues('start').toISOString().slice(0, 16)}
          error={errors.start?.message}
          includeTime={true}
          label="Date de début"
          {...context.formMethods.register('start', { valueAsDate: true })}
        />
        <Controller
          control={context.formMethods.control}
          name="supervisors"
          render={({ field }) => {
            return (
              <TeamMemberSearchInput
                label="Responsables"
                error={context.formMethods.formState.errors.supervisors?.message}
                name={field.name}
                multiple={true}
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
      </div>
      <div className="flex flex-col gap-4">
        <Controller
          control={context.formMethods.control}
          name="projectId"
          render={({ field }) => (
            <SelectInput
              error={errors.projectId?.message}
              options={[
                { label: 'Nouveau projet', value: null },
                ...(context.data.teamManage.projects.map((item) => ({ label: item.name, value: item.id })) ?? []),
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
          {...context.formMethods.register('end', { valueAsDate: true })}
          defaultValue={context.formMethods.getValues('end').toISOString().slice(0, 16)}
        />
        <TextAreaInput
          error={errors.description?.message}
          label="Description des activités"
          rows={12}
          {...context.formMethods.register('description')}
        />
      </div>
    </FormStep>
  );
}
