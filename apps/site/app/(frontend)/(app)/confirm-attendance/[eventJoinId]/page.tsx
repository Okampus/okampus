'use client';

import CenteredLayout from '../../../../../components/atoms/Layout/CenteredLayout';
import ActionButton from '../../../../../components/molecules/Button/ActionButton';

import { useMe } from '../../../../../context/navigation';
import { useGetEventJoinQuery, useUpdateEventJoinMutation } from '@okampus/shared/graphql';

import { ApprovalState, ProcessedVia } from '@okampus/shared/enums';
import { ActionType } from '@okampus/shared/types';

import { IconArrowRight, IconCircleCheck, IconCircleX, IconLoader, IconQrcode } from '@tabler/icons-react';

import clsx from 'clsx';
import { useEffect, useState } from 'react';

import type { ReactNode } from 'react';

export default function ManageEventConfirmAttendancePage({ params }: { params: { eventJoinId: string } }) {
  const me = useMe();

  const [render, setRender] = useState<ReactNode>(<div>Chargement...</div>);
  const [success, setSuccess] = useState<boolean | null>(null);

  const { data } = useGetEventJoinQuery({ variables: { eventJoinId: params.eventJoinId, userId: me.user.id } });
  const [updateEventJoin, { data: updateData }] = useUpdateEventJoinMutation();

  const eventJoin = data?.eventJoinByPk;
  const updatedEventJoin = updateData?.updateEventJoinByPk;

  useEffect(() => {
    if (eventJoin && !updatedEventJoin) {
      const canManage =
        eventJoin.event.eventOrganizes.some((eventManage) =>
          eventManage.eventSupervisors.some(({ teamMember: { user } }) => user.id === me.user.id),
        ) || me.canManageTenant;

      if (!canManage) {
        setSuccess(false);
        setRender(<div>Vous n&apos;avez pas les droits de valider cette inscription.</div>);
        return;
      }

      if (eventJoin.state !== ApprovalState.Approved) {
        setSuccess(false);
        setRender(<div>L&apos;utilisateur n&apos;a pas encore été admis à l&apos;événement</div>);
        return;
      }

      if (eventJoin.isPresent !== null) {
        setSuccess(false);
        setRender(<div>La présence ou absence a déjà été enregistrée.</div>);
        return;
      }

      setRender(<div>Chargement...</div>);
      updateEventJoin({
        variables: { id: eventJoin.id, update: { isPresent: true, participationProcessedVia: ProcessedVia.QR } },
        onCompleted: () => {
          setSuccess(true);
          setRender(<div>La présence a été enregistrée.</div>);
        },
        onError: () => {
          setSuccess(false);
          setRender(<div>Une erreur est survenue.</div>);
        },
      });
    }
  }, [me, updatedEventJoin, eventJoin, updateEventJoin]);

  const iconClass = clsx('h-32 w-32', success ? 'text-[var(--success)]' : 'text-[var(--danger)]');

  let icon = <IconLoader className={iconClass} />;
  if (success !== null)
    icon = success ? <IconCircleCheck className={iconClass} /> : <IconCircleX className={iconClass} />;

  let message = 'Chargement...';
  if (success !== null && eventJoin)
    message = success
      ? `Présence de ${eventJoin.joinedBy.actor.name} validée.`
      : `La présence de ${eventJoin.joinedBy.actor.name} n'a pas pu être validée.`;

  return (
    <CenteredLayout>
      <div className="flex flex-col items-center gap-12">
        {icon}
        <div className="text-2xl font-semibold text-center">{message}</div>
        <div className="text-xl font-medium text-center">{render}</div>
        <div className="flex gap-4">
          <ActionButton
            action={{
              linkOrActionOrMenu: `/scanner`,
              label: 'Retourner au scanner',
              iconOrSwitch: <IconQrcode />,
            }}
          />
          {eventJoin?.event && (
            <ActionButton
              iconPosition="right"
              action={{
                linkOrActionOrMenu: `/manage/event/${eventJoin.event.slug}/attendance`,
                label: 'Voir la liste de présence',
                type: ActionType.Action,
                iconOrSwitch: <IconArrowRight />,
              }}
            />
          )}
        </div>
      </div>
    </CenteredLayout>
  );
}
