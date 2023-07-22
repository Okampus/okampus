'use client';

import ModalLayout from '../atoms/Layout/ModalLayout';
import TextInput from '../molecules/Input/TextInput';
import ActionButton from '../molecules/Button/ActionButton';

import { useModal } from '../../hooks/context/useModal';

import { insertEventApprovalMutation, updateEventMutation } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';
import { EventState } from '@okampus/shared/enums';

import { useMutation } from '@apollo/client';
import { useState } from 'react';

import type { EventManageInfo } from '@okampus/shared/graphql';

export type EventApprovalModalProps = { isApproved: boolean; event: EventManageInfo };

export default function EventApprovalModal({ isApproved, event }: EventApprovalModalProps) {
  const { closeModal } = useModal();

  // @ts-ignore
  const [updateEvent] = useMutation(updateEventMutation);
  // @ts-ignore
  const [insertEventApproval] = useMutation(insertEventApprovalMutation);

  const [message, setMessage] = useState('');

  return (
    <ModalLayout header={`${event.nextEventApprovalStep?.name} de ${event.name}`}>
      <TextInput rows={5} value={message} onChange={setMessage} options={{ label: 'Message' }} />
      <ActionButton
        className="w-full mt-4"
        action={{
          type: ActionType.Success,
          label: 'Valider',
          linkOrActionOrMenu: () => {
            if (event.nextEventApprovalStep) {
              const update =
                event.nextEventApprovalStep.nextSteps.length > 0
                  ? { nextEventApprovalStepId: event.nextEventApprovalStep.nextSteps[0].id }
                  : { nextEventApprovalStepId: null, state: isApproved ? EventState.Approved : EventState.Rejected };

              const object = {
                eventId: event.id,
                eventApprovalStepId: event.nextEventApprovalStep.id,
                message,
                isApproved,
              };
              insertEventApproval({
                // @ts-ignore
                variables: { object },
                onCompleted: () => {
                  // @ts-ignore
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
