'use client';

import ModalLayout from '../../_components/atoms/Layout/ModalLayout';
import ActionButton from '../../_components/molecules/Button/ActionButton';
import SubmitButton from '../../_components/molecules/Button/SubmitButton';
import FieldSet from '../../_components/molecules/Input/FieldSet';
import RadioInput from '../../_components/molecules/Input/Selector/RadioInput';
import TextInput from '../../_components/molecules/Input/TextInput';
import TextAreaInput from '../../_components/molecules/Input/TextAreaInput';

import { notificationAtom } from '../../_context/global';
import { useTenant } from '../../_context/navigation';
import { useModal } from '../../_hooks/context/useModal';

import { TeamType } from '@okampus/shared/enums';
import { useInsertRequiredDocumentMutation, useUpdateRequiredDocumentMutation } from '@okampus/shared/graphql';
import { ActionType, ToastType } from '@okampus/shared/types';

import { Controller, useForm } from 'react-hook-form';
import { useAtom } from 'jotai';

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
  const { tenant } = useTenant();
  const { closeModal } = useModal();

  const header = defaultValues
    ? `Modifier le document à transmettre "${defaultValues.name}"`
    : 'Ajouter un document à transmettre';

  const [insertRequiredDocument] = useInsertRequiredDocumentMutation();
  const [updateRequiredDocument] = useUpdateRequiredDocumentMutation();

  defaultValues = defaultValues ?? { name: '', description: '', isRequired: 'true' };

  const [, setNotification] = useAtom(notificationAtom);

  const { control, register, handleSubmit } = useForm({ defaultValues: { ...defaultValues, teamTypes } });

  const onSubmit = handleSubmit(
    id
      ? (object) => {
          updateRequiredDocument({
            context: { useHasura: true },
            variables: { id, update: { ...object, isRequired: object.isRequired === 'true' } },
            onCompleted: () => closeModal(),
            onError: (error) => setNotification({ type: ToastType.Error, message: error.message }),
          });
        }
      : (object) => {
          insertRequiredDocument({
            context: { useHasura: true },
            variables: { object: { ...object, isRequired: object.isRequired === 'true', tenantScopeId: tenant.id } },
            onCompleted: () => closeModal(),
            onError: (error) => setNotification({ type: ToastType.Error, message: error.message }),
          });
        },
  );

  return (
    <form onSubmit={onSubmit}>
      <ModalLayout
        contentClassName="flex flex-col gap-6"
        header={header}
        footer={
          <div className="flex items-center gap-6">
            <ActionButton action={{ type: ActionType.Action, label: 'Annuler', linkOrActionOrMenu: closeModal }} />
            <SubmitButton label="Valider" />
          </div>
        }
      >
        <TextInput {...register('name')} label="Nom du document" placeholder="Nom du document" />
        <FieldSet className="flex w-full gap-3" label="Document obligatoire ?">
          <RadioInput {...register('isRequired')} value="true" label="Obligatoire" />
          <RadioInput {...register('isRequired')} value="false" label="Facultatif" />
        </FieldSet>
        <Controller
          control={control}
          name="teamTypes"
          render={({ field }) => (
            <FieldSet className="flex flex-col gap-2" label="Associations concernées">
              <RadioInput
                checked={field.value.includes(TeamType.Association) && field.value.includes(TeamType.Club)}
                onClick={() => field.onChange([TeamType.Association, TeamType.Club])}
                label="Associations & clubs"
              />
              <RadioInput
                checked={field.value.includes(TeamType.Association) && !field.value.includes(TeamType.Club)}
                onClick={() => field.onChange([TeamType.Association])}
                label="Associations uniquement"
              />
              <RadioInput
                checked={!field.value.includes(TeamType.Association) && field.value.includes(TeamType.Club)}
                onClick={() => field.onChange([TeamType.Club])}
                label="Clubs uniquement"
              />
            </FieldSet>
          )}
        />
        <TextAreaInput
          {...register('description')}
          label="Description"
          placeholder="Description & instructions particulières"
          rows={10}
        />
      </ModalLayout>
    </form>
  );
}
