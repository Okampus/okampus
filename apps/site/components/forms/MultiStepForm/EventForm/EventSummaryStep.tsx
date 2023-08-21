import DateInput from '../../../molecules/Input/Date/DateInput';
import SelectInput from '../../../molecules/Input/Select/SelectInput';

import TextInput from '../../../molecules/Input/TextInput';
import TextAreaInput from '../../../molecules/Input/TextAreaInput';

import { Controller } from 'react-hook-form';

import type { EventFormStepProps } from './EventForm';

export default function EventSummaryStep({ methods: { formMethods }, context: { teamManage } }: EventFormStepProps) {
  const errors = formMethods.formState.errors;
  // const projects = formMethods.watch('projects');
  // const router = useRouter();
  // const slug = router.query.slug;

  // if (!slug || typeof slug !== 'string') notFound();
  // const { teamManage } = useTeamManage(slug);

  // const { data: projectData } = useGetProjectsSelectQuery({ variables: { slug: teamManage?.actor.slug ?? '' } });

  // const { register, watch } = useFormContext<typeof eventFormDefaultValues>();
  // const isOnline = watch('isOnline');

  // const SupervisorInput = ({ idx }: { idx: number }) => (
  //   <div className="flex gap-4 items-center">
  //     <SelectInput
  //       name="supervisorIds"
  //       label="Membre de l'équipe"
  //       options={
  //         teamManage?.teamMembers.map((teamMember) => ({
  //           label: <UserLabeled user={teamMember.user} showCardOnClick={false} small={true} />,
  //           value: teamMember.id,
  //         })) ?? []
  //       }
  //       value={values.supervisorIds[idx]}
  //       onChange={(id) => {
  //         const newSupervisorIds = [...values.supervisorIds];
  //         newSupervisorIds[idx] = id as string;
  //         setValues({ ...values, supervisorIds: newSupervisorIds });
  //       }}
  //     />
  //     {idx > 0 && (
  //       <ActionButton
  //         small={true}
  //         action={{
  //           iconOrSwitch: <IconX />,
  //           linkOrActionOrMenu: () => {
  //             setValues({ ...values, supervisorIds: values.supervisorIds.filter((_, i) => i !== idx) });
  //           },
  //         }}
  //       />
  //     )}
  //   </div>
  // );

  return (
    <div className="w-full flex gap-4 md-max:flex-col">
      <div className="flex flex-col gap-4 md:w-[25rem]">
        <Controller
          control={formMethods.control}
          name="projectId"
          render={({ field }) => (
            <SelectInput
              error={errors.projectId?.message}
              options={[
                { label: 'Événement hors-projet', value: null },
                ...(teamManage.projects.map((item) => ({ label: item.name, value: item.id })) ?? []),
              ]}
              label="Projet lié"
              {...field}
            />
          )}
        />
        {/* <div className="flex flex-col gap-4">
          {values.supervisorIds.map((id, idx) => (
            <SupervisorInput key={id} idx={idx} />
          ))}
          <div
            className="add-button"
            onClick={() => {
              setValues({ ...values, supervisorIds: [...values.supervisorIds, null] });
            }}
          >
            Ajouter un responsable
          </div>
        </div> */}
      </div>
      <div className="flex flex-col gap-4 md:w-[35rem]">
        <TextInput error={errors.projectId?.message} label="Nom de l'événement" {...formMethods.register('name')} />
        <DateInput
          error={errors.start?.message}
          includeTime={true}
          label="Date de début"
          {...formMethods.register('start', { valueAsDate: true })}
        />
        <DateInput
          error={errors.end?.message}
          includeTime={true}
          label="Date de fin"
          {...formMethods.register('end', { valueAsDate: true })}
        />
        <TextAreaInput
          error={errors.description?.message}
          label="Description des activités"
          rows={7}
          {...formMethods.register('description')}
        />
      </div>
    </div>
  );
}
