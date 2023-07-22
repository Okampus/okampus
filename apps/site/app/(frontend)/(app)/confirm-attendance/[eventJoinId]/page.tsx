'use client';

import CenteredLayout from '../../../../../components/atoms/Layout/CenteredLayout';
import ActionButton from '../../../../../components/molecules/Button/ActionButton';
import { useMe } from '../../../../../context/navigation';

import { ApprovalState, ProcessedVia } from '@okampus/shared/enums';
import { eventJoinWithEventInfo, updateEventJoinMutation, useTypedQuery } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';

import { useMutation } from '@apollo/client';
import { IconArrowRight, IconCircleCheck, IconCircleX, IconLoader, IconQrcode } from '@tabler/icons-react';

import clsx from 'clsx';
import { useEffect, useState } from 'react';

import type { ReactNode } from 'react';

export default function ManageEventConfirmAttendancePage({ params }: { params: { eventJoinId: string } }) {
  const me = useMe();

  const [render, setRender] = useState<ReactNode>(<div>Chargement...</div>);
  const [success, setSuccess] = useState<boolean | null>(null);

  const [updateEventJoin, { data: updateData }] = useMutation(updateEventJoinMutation);
  const { data } = useTypedQuery({ eventJoinByPk: [{ id: params.eventJoinId }, eventJoinWithEventInfo] });

  useEffect(() => {
    if (data?.eventJoinByPk && !updateData?.updateEventJoinByPk) {
      const event = data.eventJoinByPk.event;
      const canManage =
        event?.eventOrganizes.some((eventManage) =>
          eventManage.supervisors.some(({ teamMember }) => teamMember?.user?.id === me?.user.id)
        ) || me?.canManageTenant;

      if (!canManage) {
        setSuccess(false);
        setRender(<div>Vous n&apos;avez pas les droits de valider cette inscription.</div>);
        return;
      }

      if (data.eventJoinByPk.state !== ApprovalState.Approved) {
        setSuccess(false);
        setRender(<div>L&apos;utilisateur n&apos;a pas encore été admis à l&apos;événement</div>);
        return;
      }

      if (data.eventJoinByPk.isPresent !== null) {
        setSuccess(false);
        setRender(<div>La présence ou absence a déjà été enregistrée.</div>);
        return;
      }

      setRender(<div>Chargement...</div>);
      updateEventJoin({
        // @ts-ignore
        variables: { id: params.eventJoinId, update: { isPresent: true, participationProcessedVia: ProcessedVia.QR } },
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
  }, [data, me?.canManageTenant, me?.user.id, params.eventJoinId, updateData?.updateEventJoinByPk, updateEventJoin]);

  const iconClass = clsx('h-32 w-32', success ? 'text-[var(--success)]' : 'text-[var(--danger)]');

  return (
    <CenteredLayout>
      <div className="flex flex-col items-center gap-12">
        {success === null ? (
          <IconLoader className={iconClass} />
        ) : success ? (
          <IconCircleCheck className={iconClass} />
        ) : (
          <IconCircleX className={iconClass} />
        )}
        <div className="text-2xl font-semibold text-center">
          {success === null
            ? 'Chargement...'
            : success
            ? `Présence de ${data?.eventJoinByPk?.joinedBy.individual.actor.name} validée.`
            : `La présence de ${data?.eventJoinByPk?.joinedBy.individual.actor.name} n'a pas pu être validée.`}
        </div>
        <div className="text-xl font-medium text-center">{render}</div>
        <div className="flex gap-4">
          <ActionButton
            action={{
              linkOrActionOrMenu: `/manage/event/${data?.eventJoinByPk?.event.slug}/attendance`,
              label: 'Retourner au scanner',
              iconOrSwitch: <IconQrcode />,
            }}
          />
          <ActionButton
            iconPosition="right"
            action={{
              linkOrActionOrMenu: `/manage/event/${data?.eventJoinByPk?.event.slug}/attendance`,
              label: 'Voir la liste de présence',
              type: ActionType.Action,
              iconOrSwitch: <IconArrowRight />,
            }}
          />
        </div>
      </div>
    </CenteredLayout>
  );
}
