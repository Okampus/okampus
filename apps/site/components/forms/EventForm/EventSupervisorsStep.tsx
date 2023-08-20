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
export default function EventSupervisorsStep() {
  // const router = useRouter();
  // const slug = router.query.slug;
  // if (!slug || typeof slug !== 'string') notFound();
  // const { teamManage } = useTeamManage(slug);
  return null;
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
