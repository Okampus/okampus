'use client';

import FieldSet from '../../_components/molecules/Input/FieldSet';
import RadioInput from '../../_components/molecules/Input/Uncontrolled/String/RadioInput';
import TextInput from '../../_components/molecules/Input/Uncontrolled/String/TextInput';
import TextAreaInput from '../../_components/molecules/Input/Uncontrolled/String/TextAreaInput';

// import { useTenant } from '../../_context/navigation';
import FormWithAction from '../../_components/molecules/Form/FormWithAction';
import { useModal } from '../../_hooks/context/useModal';

import insertRequiredDocument from '../../../server/actions/RequiredDocument/insertRequiredDocument';
import updateRequiredDocument from '../../../server/actions/RequiredDocument/updateRequiredDocument';

import CheckboxInput from '../../_components/molecules/Input/Uncontrolled/Boolean/CheckboxInput';
import { insertRequiredDocumentSchema } from '../../../schemas/RequiredDocument/insertRequiredDocumentSchema';

import { ALL } from '@okampus/shared/consts';

import { TeamType } from '@prisma/client';
import { useForm } from 'react-hook-form';
// import { useAtom } from 'jotai';

export function teamTypesHeader(teamTypes: string[]) {
  if (teamTypes.includes(TeamType.Association) && teamTypes.includes(TeamType.Club)) return 'associations & clubs';
  if (teamTypes.includes(TeamType.Association)) return 'associations uniquement';
  if (teamTypes.includes(TeamType.Club)) return 'clubs uniquement';
  return 'autres équipes';
}

export type RequiredDocumentModalProps = {
  teamTypes: string[];
  id?: string;
  defaultValues?: { name: string; description: string; isRequired: string };
};

export default function RequiredDocumentModal({ defaultValues, id, teamTypes }: RequiredDocumentModalProps) {
  // const { data: tenant } = useTenant();
  const { closeModal } = useModal();

  const action = id ? updateRequiredDocument : insertRequiredDocument;

  const header = defaultValues
    ? `Modifier le document à transmettre "${defaultValues.name}"`
    : 'Ajouter un document à transmettre';

  // const [insertRequiredDocument] = useInsertRequiredDocumentMutation();
  // const [updateRequiredDocument] = useUpdateRequiredDocumentMutation();

  defaultValues = defaultValues ?? { name: '', description: '', isRequired: 'true' };
  const { formState, control, register, handleSubmit } = useForm({ defaultValues: { ...defaultValues, teamTypes } });

  // const onSubmit = handleSubmit(
  //   id
  //     ? (object) => {
  //         updateRequiredDocument({
  //           context: { useHasura: true },
  //           variables: { id, update: { ...object, isRequired: object.isRequired === 'true' } },
  //           onCompleted: () => closeModal(),
  //           onError: (error) => setNotification({ type: ToastType.Error, message: error.message }),
  //         });
  //       }
  //     : (object) => {
  //         insertRequiredDocument({
  //           context: { useHasura: true },
  //           variables: { object: { ...object, isRequired: object.isRequired === 'true', tenantScopeId: tenant.id } },
  //           onCompleted: () => closeModal(),
  //           onError: (error) => setNotification({ type: ToastType.Error, message: error.message }),
  //         });
  //       },
  // );

  return (
    <FormWithAction
      action={action}
      zodSchema={insertRequiredDocumentSchema}
      render={() => (
        // <ModalLayout
        //   contentClassName="flex flex-col gap-6"
        //   header={header}
        //   footer={
        //     <div className="flex items-center gap-6">
        //       <Button type={ActionType.Action} action={closeModal}>
        //         Annuler
        //       </Button>
        //       <SubmitButton label="Valider" />
        //     </div>
        //   }
        // >
        <div>
          <TextInput name="name" label="Nom du document" placeholder="Nom du document" />
          <CheckboxInput name="isRequired" label="Document obligatoire ?" />
          {/* <FieldSet className="flex w-full gap-3" label="Document obligatoire ?">
            <RadioInput name="isRequired" value="true" label="Obligatoire" />
            <RadioInput name="isRequired" value="false" label="Facultatif" />
          </FieldSet> */}
          {/* <Controller
            control={control}
            name="teamTypes"
            render={({ field }) => ( */}
          <FieldSet className="flex flex-col gap-2" label="Associations concernées">
            <RadioInput
              name="teamType"
              // checked={field.value.includes(TeamType.Association) && field.value.includes(TeamType.Club)}
              // onClick={() => field.onChange([TeamType.Association, TeamType.Club])}
              value={ALL}
              label="Associations & clubs"
            />
            <RadioInput
              name="teamType"
              // checked={field.value.includes(TeamType.Association) && !field.value.includes(TeamType.Club)}
              // onClick={() => field.onChange([TeamType.Association])}
              value={TeamType.Association}
              label="Associations uniquement"
            />
            <RadioInput
              name="teamType"
              value={TeamType.Club}
              // checked={!field.value.includes(TeamType.Association) && field.value.includes(TeamType.Club)}
              // onClick={() => field.onChange([TeamType.Club])}
              label="Clubs uniquement"
            />
          </FieldSet>
          {/* )}
          /> */}
          <TextAreaInput
            name="description"
            // {...register('description')}
            label="Description"
            placeholder="Description & instructions particulières"
            rows={10}
          />
        </div>
        // </ModalLayout>
      )}
    />

    // </form>
  );
}
