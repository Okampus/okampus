'use client';

import ModalLayout from '../../../atoms/Layout/ModalLayout';
import TextAreaInput from '../../../molecules/Input/TextAreaInput';
import ActionButton from '../../../molecules/Button/ActionButton';

import { useModal } from '../../../../_hooks/context/useModal';

import { useInsertEventApprovalMutation, useUpdateEventMutation } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';
import { EventState } from '@prisma/client';

import { useState } from 'react';

import type { GetEventsValidationQuery } from '@okampus/shared/graphql';

export type EventApprovalFormProps = { isApproved: boolean; event: GetEventsValidationQuery['event'][number] };

export default function EventApprovalForm({ isApproved, event }: EventApprovalFormProps) {
  const { closeModal } = useModal();

  const [updateEvent] = useUpdateEventMutation();
  const [insertEventApproval] = useInsertEventApprovalMutation();
  const [message, setMessage] = useState('');

  return (
    <ModalLayout header={`${event.nextApprovalStep?.name} de ${event.name}`}>
      <TextAreaInput name="message" rows={5} onChange={(event) => setMessage(event.target.value)} label="Message" />
      <ActionButton
        className="w-full mt-4"
        action={{
          type: ActionType.Success,
          label: 'Valider',
          linkOrActionOrMenu: () => {
            if (event.nextApprovalStep) {
              const update =
                event.nextApprovalStep.nextSteps.length > 0
                  ? { nextApprovalStepId: event.nextApprovalStep.nextSteps[0].id }
                  : { nextApprovalStepId: null, state: isApproved ? EventState.Approved : EventState.Rejected };

              const object = {
                eventId: event.id,
                eventApprovalStepId: event.nextApprovalStep.id,
                message,
                isApproved,
              };
              insertEventApproval({
                variables: { object },
                onCompleted: () => {
                  updateEvent({ variables: { id: event.id, update }, onCompleted: () => closeModal() });
                },
              });
            }
          },
        }}
      />
    </ModalLayout>
  );
}
