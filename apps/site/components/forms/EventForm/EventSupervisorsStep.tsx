import ActionButton from '../../molecules/Button/ActionButton';
import SelectInput from '../../molecules/Input/SelectInput';
import UserLabeled from '../../molecules/Labeled/UserLabeled';

import { IconX } from '@tabler/icons-react';

import type { TeamManageInfo } from '@okampus/shared/graphql';
import type { eventFormDefaultValues } from './EventForm';
import type { FormStepContext } from '../../molecules/Form/MultiStepForm';

type Context = FormStepContext<typeof eventFormDefaultValues>;
type SupervisorsStepProps = { teamManage: TeamManageInfo; values: Context['values']; setValues: Context['setValues'] };

export default function EventSupervisorsStep({ teamManage, values, setValues }: SupervisorsStepProps) {
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
  );
}
