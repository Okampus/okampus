import ActionButton from '../../molecules/Button/ActionButton';
import SelectInput from '../../molecules/Input/Select/SelectInput';
import UserLabeled from '../../molecules/Labeled/UserLabeled';

import FieldSet from '../../molecules/Input/FieldSet';
import { IconX } from '@tabler/icons-react';

import type { TeamManageInfo } from '../../../context/navigation';
import type { eventFormDefaultValues } from './EventForm';
import type { FormStepContext } from '../../organisms/Form/MultiStepForm';

type Context = FormStepContext<typeof eventFormDefaultValues>;
type SupervisorsStepProps = { teamManage: TeamManageInfo; values: Context['values']; setValues: Context['setValues'] };

type SupervisorInputProps = SupervisorsStepProps & { idx: number };
const SupervisorInput = ({ teamManage, values, setValues, idx }: SupervisorInputProps) => (
  <div className="flex gap-4 items-center">
    <SelectInput
      label="Membre de l'équipe"
      name={`supervisorIds.${idx}`}
      options={
        teamManage?.teamMembers.map(({ id, user }) => ({
          label: <UserLabeled user={user} showCardOnClick={false} small={true} />,
          value: id,
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

export default function EventSupervisorsStep({ teamManage, values, setValues }: SupervisorsStepProps) {
  return (
    <FieldSet label="Responsables">
      {values.supervisorIds.map((_, idx) => (
        <SupervisorInput key={idx} idx={idx} teamManage={teamManage} values={values} setValues={setValues} />
      ))}
      <div
        className="add-button"
        onClick={() => {
          setValues({ ...values, supervisorIds: [...values.supervisorIds, null] });
        }}
      >
        Ajouter un responsable
      </div>
    </FieldSet>
  );
}
