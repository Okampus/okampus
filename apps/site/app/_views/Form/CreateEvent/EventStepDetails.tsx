import TextInput from '../../../_components/molecules/Input/Uncontrolled/String/TextInput';
import DateInput from '../../../_components/molecules/Input/Controlled/Date/DateInput';
import HourInput from '../../../_components/molecules/Input/Uncontrolled/Date/HourInput';
import Section from '../../../_components/atoms/Container/Section';
import SelectorInput from '../../../_components/molecules/Input/Controlled/Select/SelectorInput';

import { useFormContext, useWatch } from 'react-hook-form';

import type { TeamWithProjects } from '../../../../types/prisma/Team/team-with-projects';
import type { FormStepContext } from '../../../_components/templates/MultiStepFormView';

export default function EventStepDetails({ context, goToNextStep }: FormStepContext<TeamWithProjects>) {
  const { control } = useFormContext();
  const locationType = useWatch({ name: 'locationType' });

  return (
    <div>
      <TextInput label="Nom de l'événement" name="name" />
      <Section title="Date de l'événement">
        <div className="flex gap-4 items-center">
          <DateInput control={control} label="Date de début" name="startAtDate" />
          <HourInput label="Heure de début" name="startAtHour" />
        </div>
        <div className="flex gap-4 items-center">
          <DateInput control={control} label="Date de fin" name="startAtDate" />
          <HourInput label="Heure de fin" name="startAtHour" />
        </div>
      </Section>
      {/* TODO: whole day event & event without end & redo location form */}
      <hr className="border border-[var(--border-1)]" />
      <Section title="Date de l'événement">
        <SelectorInput
          name="locationType"
          control={control}
          value={locationType}
          options={[
            // { label: 'Campus', value: LocationType.TenantLocation },
            // { label: 'En ligne', value: LocationType.Online },
            // { label: 'Physique hors-campus', value: LocationType.Physical },
            // { label: 'Hybride', value: LocationType.Hybrid },
            { label: 'À déterminer', value: null },
          ]}
        />
      </Section>
      <hr />
    </div>
  );
}
