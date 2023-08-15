'use client';

import ModalLayout from '../atoms/Layout/ModalLayout';
import TextAreaInput from '../molecules/Input/TextAreaInput';
import ActionButton from '../molecules/Button/ActionButton';

import { useModal } from '../../hooks/context/useModal';

import { useInsertEventApprovalMutation, useUpdateEventMutation } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';
import { EventState } from '@okampus/shared/enums';

import { useState } from 'react';

import type { GetEventsValidationQuery } from '@okampus/shared/graphql';

export type EventApprovalModalProps = { isApproved: boolean; event: GetEventsValidationQuery['event'][number] };

export default function EventApprovalModal({ isApproved, event }: EventApprovalModalProps) {
  const { closeModal } = useModal();

  const [updateEvent] = useUpdateEventMutation();
  const [insertEventApproval] = useInsertEventApprovalMutation();
  const [message, setMessage] = useState('');

  return (
    <ModalLayout header={`${event.nextEventApprovalStep?.name} de ${event.name}`}>
      <TextAreaInput name="message" rows={5} onChange={(event) => setMessage(event.target.value)} label="Message" />
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
