import { TeamFinanceSidePanel } from '../SidePanel/TeamFinanceSidePanel';

import { Align } from '@okampus/shared/enums';
import { formatDateDayOfWeekNoHour, getColorHexFromData } from '@okampus/shared/utils';

import { TextAddress, TextBadge, TextFinance } from '@okampus/ui/atoms';
import { NavigationContext } from '@okampus/ui/hooks';
import { FileGroup, LabeledTeam, LabeledUser } from '@okampus/ui/molecules';
import { Dashboard } from '@okampus/ui/organisms';
import { getAvatar } from '@okampus/ui/utils';

import { useTranslation } from 'react-i18next';
import { useContext } from 'react';

import type { TeamFinanceBaseInfo } from '@okampus/shared/graphql';

export type FinanceDashboardProps = { finances?: TeamFinanceBaseInfo[] };
export function FinanceDashboard({ finances }: FinanceDashboardProps) {
  const {
    showSidePanel,
    // hideSidePanel
  } = useContext(NavigationContext);
  const { t } = useTranslation();

  // useEffect(() => () => hideSidePanel(), [hideSidePanel]); TODO once useState refresh fixed

  const columns = [
    {
      label: 'Transaction',
      render: (value: TeamFinanceBaseInfo) => {
        const projectLabel = value.project?.name ?? 'Dépense générale';
        const eventLabel = value.event?.contentMaster?.name ?? value.category;

        return (
          <div className="flex text-0 gap-4 items-center">
            <div
              className="h-12 w-12 rounded-2xl"
              style={{ backgroundColor: getColorHexFromData(value.category as string) }}
            />
            <div className="flex flex-col gap-0.5">
              <div className="flex gap-2 items-center text-base text-0 font-medium">{value.name as string}</div>
              <div className="flex gap-2 items-center text-2 line-clamp-1">
                {projectLabel} • {eventLabel}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      label: 'Destinataire',
      align: Align.Left,
      render: (value: TeamFinanceBaseInfo) => {
        return value.actorAddress && <TextAddress className="text-left" address={value.actorAddress} />;
      },
    },
    {
      label: 'Méthode',
      align: Align.Left,
      render: (value: TeamFinanceBaseInfo) => {
        if (!value.actor) return <div className="text-1">{t(value.method)}</div>;

        const avatar = { src: getAvatar(value.actor.actorImages), size: 7 };

        const userId = value.actor.individualByIndividualId?.userInfo?.id as string;
        if (userId) {
          return (
            <div className="flex flex-col gap-2">
              <div className="text-1 font-medium">{t(value.method)}</div>
              <LabeledUser id={userId} name={value.actor.name} avatar={avatar} labelClassName="text-base font-medium" />
            </div>
          );
        }

        const teamId = value.actor.team?.id as string;
        if (teamId) {
          return (
            <div>
              <div className="text-1 font-medium">{t(value.method)}</div>
              <LabeledTeam id={teamId} name={value.actor.name} avatar={avatar.src} />
              {/* <LabeledUser id={userId} name={value.actor.name} avatar={avatar} /> */}
            </div>
          );
        }

        return <div className="text-1 font-medium">{t(value.method)}</div>;
      },
    },
    {
      label: 'Date',
      render: (value: TeamFinanceBaseInfo) => {
        const date = value.payedAt;
        if (!date) return null;
        return <div className="text-1 font-medium text-[1.05rem]">{formatDateDayOfWeekNoHour(date as string)}</div>;
      },
    },
    {
      label: 'Justificatif',
      render: (value: TeamFinanceBaseInfo) => {
        const receipt = value.fileUpload;
        if (!receipt) return <TextBadge color="grey" label="Manquant" />;
        return <FileGroup files={[{ name: value.name, size: receipt.size, type: receipt.mime, src: receipt.url }]} />;
      },
    },
    {
      align: Align.Right,
      label: 'Montant',
      render: (value: TeamFinanceBaseInfo) => (
        <TextFinance amount={(value.amount as number) ?? 0} className="text-lg" />
      ),
    },
  ];

  return (
    <Dashboard
      columns={columns}
      data={finances}
      onElementClick={(data) => showSidePanel(<TeamFinanceSidePanel teamFinance={data} />)}
    />
  );
}
