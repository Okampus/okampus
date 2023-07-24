import DateInput from '../../molecules/Input/DateInput';
import SelectInput from '../../molecules/Input/SelectInput';
import UserLabeled from '../../molecules/Labeled/UserLabeled';

import TextInput from '../../molecules/Input/TextInput';
import ActionButton from '../../molecules/Button/ActionButton';
import { projectBaseInfo, useTypedQuery } from '@okampus/shared/graphql';

import { IconX } from '@tabler/icons-react';
import type { eventFormDefaultValues } from './EventForm';
import type { FormStepContext } from '../../molecules/Form/MultiStepForm';
import type { TeamManageInfo } from '@okampus/shared/graphql';

type Context = FormStepContext<typeof eventFormDefaultValues>;
type SummaryStepProps = { teamManage: TeamManageInfo; values: Context['values']; setValues: Context['setValues'] };
export default function EventSummaryStep({ teamManage, values, setValues }: SummaryStepProps) {
  const { data: projectData } = useTypedQuery({
    project: [{ where: { team: { id: { _eq: teamManage?.id } } } }, projectBaseInfo],
  });

  const SupervisorInput = ({ idx }: { idx: number }) => (
    <div className="flex gap-4 items-center">
      <SelectInput
        options={{ label: "Membre de l'équipe" }}
        items={
          teamManage?.teamMembers.map((teamMember) => ({
            label: (
              <UserLabeled
                individual={teamMember.user.individual}
                id={teamMember.user.id}
                showCardOnClick={false}
                small={true}
              />
            ),
            value: teamMember.id,
          })) || []
        }
        value={values.supervisorIds[idx]}
        onChange={(id) => {
          const newSupervisorIds = [...values.supervisorIds];
          newSupervisorIds[idx] = id as string;
          setValues({ ...values, supervisorIds: newSupervisorIds });
        }}
      />
      {idx > 0 && (
        <ActionButton
          small={true}
          action={{
            iconOrSwitch: <IconX />,
            linkOrActionOrMenu: () => {
              setValues({ ...values, supervisorIds: values.supervisorIds.filter((_, i) => i !== idx) });
            },
          }}
        />
      )}
    </div>
  );

  return (
    <div className="w-full flex gap-4 md-max:flex-col">
      <div className="flex flex-col gap-4 md:w-[25rem]">
        <SelectInput
          items={[
            { label: 'Événement hors-projet', value: null },
            ...(projectData?.project.map((item) => ({ label: item.name, value: item.id })) ?? []),
          ]}
          options={{ label: 'Projet lié', name: 'projectId' }}
          value={values.projectId}
          onChange={(projectId) => setValues({ ...values, projectId: projectId as string, eventId: null })}
        />
        <div className="flex flex-col gap-4">
          {values.supervisorIds.map((_, idx) => (
            <SupervisorInput key={idx} idx={idx} />
          ))}
          <div
            className="add-button"
            onClick={() => {
              setValues({ ...values, supervisorIds: [...values.supervisorIds, null] });
            }}
          >
            Ajouter un responsable
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 md:w-[35rem]">
        <TextInput
          value={values.name}
          onChange={(value) => setValues({ ...values, name: value })}
          options={{ label: "Nom de l'événement", name: 'name' }}
        />
        <div className="grid grid-cols-[1fr_8rem] gap-4">
          <DateInput
            className="w-full"
            date={values.startDate}
            onChange={(date) => setValues({ ...values, startDate: date })}
            options={{ label: 'Date de début', name: 'startDate' }}
          />
          <input
            className="input"
            type="time"
            value={values.startTime}
            onChange={(e) => setValues({ ...values, startTime: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-[1fr_8rem] gap-4">
          <DateInput
            className="w-full"
            date={values.endDate}
            onChange={(date) => setValues({ ...values, endDate: date })}
            options={{ label: 'Date de fin', name: 'endDate' }}
          />
          <input
            className="input"
            type="time"
            value={values.endTime}
            onChange={(e) => setValues({ ...values, endTime: e.target.value })}
          />
        </div>
        <TextInput
          value={values.description}
          onChange={(value) => setValues({ ...values, description: value })}
          options={{ label: 'Description des activités', name: 'name' }}
          rows={7}
        />
      </div>
    </div>
  );
}
