'use client';

import TeamMemberSearchInput from '../../../../components/molecules/Input/Search/TeamMemberSearchInput';
import { isNotNull } from '@okampus/shared/utils';

import { Controller } from 'react-hook-form';

import type { EventFormStepProps } from './EventForm';
// import { useTeamManage } from '../../../context/navigation';

// import { useRouter } from 'next/router';
// import { notFound } from 'next/navigation';

// import type { eventFormDefaultValues } from './EventForm';
// import type { FormStepContext } from '../../organisms/Form/MultiStepForm';

// type Context = FormStepContext<typeof eventFormDefaultValues>;

// type SupervisorInputProps = {
//   teamManage: TeamManageInfo;
//   values: Context['values'];
//   setValues: Context['setValues'];
//   idx: number;
// };
// const SupervisorInput = ({ teamManage, values, setValues, idx }: SupervisorInputProps) => (
//   <div className="flex gap-4 items-center">
//     <SelectInput
//       label="Membre de l'équipe"
//       name={`supervisorIds.${idx}`}
//       options={
//         teamManage?.teamMembers.map(({ id, user }) => ({
//           label: <UserLabeled user={user} showCardOnClick={false} small={true} />,
//           value: id,
//         })) || []
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

// type EventSupervisorsStepProps = { values: Context['values']; setValues: Context['setValues'] };
export default function EventSupervisorsStep({
  methods: { formMethods },
  context: { teamManage },
}: EventFormStepProps) {
  // const router = useRouter();
  // const slug = router.query.slug;
  // if (!slug || typeof slug !== 'string') notFound();
  // const { teamManage } = useTeamManage(slug);

  return (
    <Controller
      control={formMethods.control}
      name="supervisors"
      render={({ field }) => {
        console.log(
          { field },
          field.value
            .map(({ id }) => teamManage.teamMembers.find((teamMember) => teamMember.id === id))
            .filter(isNotNull),
          field.value.map(({ id }) => teamManage.teamMembers.find((teamMember) => teamMember.id === id)),
          field.value.map(({ id }) => id),
        );
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
          // <AddressSearchInput
          //   error={formMethods.formState.errors.location?.address?.message}
          //   name={field.name}
          //   value={field.value ?? null}
          //   onChange={(address) => {
          //     field.onChange(address);
          //     formMethods.setValue('location.name', address?.name ?? '');
          //     if (address) formMethods.clearErrors('location.address');
          //   }}
          // />
        );
      }}
    />
  );
  // return teamManage ? (
  //   <FieldSet label="Responsables">
  //     {values.supervisorIds.map((id, idx) => (
  //       <SupervisorInput key={id} idx={idx} teamManage={teamManage} values={values} setValues={setValues} />
  //     ))}
  //     <div
  //       className="add-button"
  //       onClick={() => {
  //         setValues({ ...values, supervisorIds: [...values.supervisorIds, null] });
  //       }}
  //     >
  //       Ajouter un responsable
  //     </div>
  //   </FieldSet>
  // ) : (
  //   <Skeleton className="h-64 w-full" />
  // );
}
