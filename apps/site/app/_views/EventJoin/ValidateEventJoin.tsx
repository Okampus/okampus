import Button from '../../_components/molecules/Button/Button';

import { jsonFetcher } from '../../../utils/json-fetcher';
import { toBase62 } from '@okampus/shared/utils';

import { CircleNotch, CheckCircle, XCircle, QrCode } from '@phosphor-icons/react/dist/ssr';
import { ApprovalState } from '@prisma/client';

import clsx from 'clsx';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import type { ValidateEventJoin } from '../../api/validate/event-join/route';

const patchFetcher = (url: string) => jsonFetcher(url, { method: 'PATCH' });

export type ValidateEventJoinProps = { id: bigint; className?: string };
export function ValidateEventJoin({ id, className }: ValidateEventJoinProps) {
  const { data: eventJoin, error } = useSWR<ValidateEventJoin>(`/api/validate/event-join?id=${id}`, patchFetcher);

  // TODO:
  const { trigger } = useSWRMutation(`/api/validate/event-join?id=${id}&force=true`, patchFetcher);

  // let id;
  // try {
  //   id = BigInt(params.eventJoinId);
  // } catch {
  //   return (
  //     <CenteredLayout>
  //       <div className="flex flex-col items-center gap-12">
  //         <XCircle className="h-32 w-32 text-[var(--danger)]" />
  //         <div className="text-xl font-medium text-center">L&apos;identifiant de l&apos;inscription est invalide.</div>
  //         <div className="flex gap-4">
  //           <ActionButton
  //             action={{
  //               action={`/scanner`}
  //               label: 'Retourner au scanner',
  //               iconOrSwitch: <QrCode />,
  //             }}
  //           />
  //         </div>
  //       </div>
  //     </CenteredLayout>
  //   );
  // }

  // const eventJoin = await prisma.eventJoin.findUnique({
  //   where: { id },
  //   select: {
  //     id: true,
  //     state: true,
  //     isPresent: true,
  //     joinedBy: { select: { actor: { select: { name: true } } } },
  //     event: {
  //       select: {
  //         slug: true,
  //         eventOrganizes: { select: { eventSupervisors: { select: { user: { select: { id: true } } } } } },
  //       },
  //     },
  //   },
  // });

  // const [render, setRender] = useState<ReactNode>(<div>Chargement...</div>);
  // const [success, setSuccess] = useState<boolean | null>(null);

  // const { data } = useGetEventJoinQuery({ variables: { eventJoinId: params.eventJoinId, userId: me.id } });
  // const [updateEventJoin, { data: updateData }] = useUpdateEventJoinMutation();

  // const eventJoin = data?.eventJoinByPk;
  // const updatedEventJoin = updateData?.updateEventJoinByPk;

  // useEffect(() => {
  //   if (
  //     // eventJoin &&
  //     !updatedEventJoin
  //   ) {
  //     // const canManage = eventJoin.event.eventOrganizes.some((eventManage) =>
  //     //   eventManage.eventSupervisors.some(({ user }) => user.id === me.id),
  //     // );

  //     // if (!canManage) {
  //     //   setSuccess(false);
  //     //   setRender(<div>Vous n&apos;avez pas les droits de valider cette inscription.</div>);
  //     //   return;
  //     // }

  //     // if (eventJoin.state !== ApprovalState.Approved) {
  //     //   setSuccess(false);
  //     //   setRender(<div>L&apos;utilisateur n&apos;a pas encore été admis à l&apos;événement</div>);
  //     //   return;
  //     // }

  //     // if (eventJoin.isPresent !== null) {
  //     //   setSuccess(false);
  //     //   setRender(<div>La présence ou absence a déjà été enregistrée.</div>);
  //     //   return;
  //     // }

  //     setRender(<div>Chargement...</div>);
  //     // updateEventJoin({
  //     //   variables: { id: eventJoin.id, update: { isPresent: true, participationProcessedVia: ProcessedVia.QR } },
  //     //   onCompleted: () => {
  //     //     setSuccess(true);
  //     //     setRender(<div>La présence a été enregistrée.</div>);
  //     //   },
  //     //   onError: () => {
  //     //     setSuccess(false);
  //     //     setRender(<div>Une erreur est survenue.</div>);
  //     //   },
  //     // });
  //   }
  // }, [
  //   me,
  //   updatedEventJoin,
  //   // eventJoin,
  //   updateEventJoin,
  // ]);

  const success = eventJoin?.isPresent;

  const iconClass = clsx('h-32 w-32', {
    'text-[var(--success)]': success === true,
    'text-[var(--danger)]': success === false,
    'text-[var(--gray)] animate-spin': success === undefined,
  });

  let icon = <CircleNotch className={iconClass} />;
  if (success !== undefined) icon = success ? <CheckCircle className={iconClass} /> : <XCircle className={iconClass} />;

  let message = `Validation de l&apos;inscription #${toBase62(id)}...`;
  if (success !== undefined && eventJoin)
    message = success
      ? `Présence de ${eventJoin.joinedBy.actor.name} validée.`
      : `La présence de ${eventJoin.joinedBy.actor.name} n&apos;a pas pu être validée.`;

  let inner = <div>Chargement...</div>;
  if (success !== undefined && eventJoin) {
    if (success) {
      inner = (
        <div>
          La présence de {eventJoin.joinedBy.actor.name} a été validée pour l&apos;événement {eventJoin.event.slug}.
        </div>
      );
    } else if (eventJoin.state !== ApprovalState.Approved) {
      inner = (
        <div>
          l&apos;inscription de {eventJoin.joinedBy.actor.name} n&apos;avait pas été approuvée pour l&apos;événement{' '}
          {eventJoin.event.slug}. Êtes-vous sûr de vouloir valider sa présence ?
          <Button action={trigger}>Valider la présence</Button>
        </div>
      );
    }
  }
  return (
    <section className={clsx('w-full h-full flex flex-col items-center justify-center', className)}>
      <div className="relative flex flex-col overflow-y-auto scrollbar max-w-[35rem] mb-20 mr-20">
        <div className="flex flex-col items-center gap-12">
          {icon}
          <div className="text-2xl font-semibold text-center">{message}</div>
          <div className="text-xl font-medium text-center">{inner}</div>
          <div className="flex gap-4">
            <Button action={`/scanner`}>
              Retourner au scanner
              <QrCode />
            </Button>

            {/* {eventJoin?.event && (
            <ActionButton
              iconPosition="right"
              action={{
                action={`/manage/event/${eventJoin.event.slug}/attendance`}
                label: 'Voir la liste de présence',
                type={ActionType.Action}

                iconOrSwitch: <ArrowRight />,
              }}
            />
          )} */}
          </div>
        </div>
      </div>
    </section>
  );
}
