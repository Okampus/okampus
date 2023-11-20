import TextInput from '../../../_components/molecules/Input/Uncontrolled/String/TextInput';
import ComboBoxInput from '../../../_components/molecules/Input/Controlled/ComboBox/ComboBoxInput';
import AvatarImage from '../../../_components/atoms/Image/AvatarImage';
import IHighlight from '../../../_components/atoms/Inline/IHighlight';

import { getRoles } from '../../../../utils/models/get-roles';

import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import type { TeamWithProjects } from '../../../../types/prisma/Team/team-with-projects';
import type { FormStepContext } from '../../../_components/templates/MultiStepFormView';

export default function EventSupervisorsStep({ context, goToNextStep }: FormStepContext<TeamWithProjects>) {
  const supervisors = useWatch({ name: 'supervisors' });
  const { control, setValue } = useFormContext();

  const { fields, append } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'supervisors', // unique name for your Field Array
  });

  return (
    <div>
      {fields.map((field, idx) => (
        <div key={field.id} className="bg-1 p-4 flex items-center">
          <ComboBoxInput
            name={`supervisors.${idx}.user`}
            control={control}
            getOptionsKey={(search) => `${context.slug}/supervisors?search=${search}`}
            getOptions={(search) =>
              context.teamMembers.map((teamMember) => {
                const roles = getRoles(teamMember);
                return {
                  value: teamMember.user.id,
                  searchText: teamMember.user.actor.name,
                  label: (
                    <span className="flex items-center gap-2">
                      <AvatarImage actor={teamMember.user.actor} className="h-5 w-5 shrink-0" size={24} />
                      <IHighlight
                        className="line-clamp-1 leading-4 h-5 shrink-0"
                        text={teamMember.user.actor.name}
                        highlight={search}
                      />
                      <span className="text-2 !font-medium text-sm line-clamp-1">
                        {roles.map((role) => role.name).join(' / ')}
                      </span>
                    </span>
                  ),
                };
              })
            }
          />
          <TextInput name={`supervisors.${idx}.title`} defaultValue="Organisateur" label="Rôle" />
        </div>
      ))}
      <button className="button-underline" onClick={() => append({ user: null, title: 'Co-organisateur' })}>
        Ajouter un superviseur de l&apos;événement
      </button>
    </div>
  );
}
