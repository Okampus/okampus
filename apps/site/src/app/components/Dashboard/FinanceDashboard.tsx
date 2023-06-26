import { FinanceSidePanel } from '../SidePanel/FinanceSidePanel';

import { Align } from '@okampus/shared/enums';
import { formatDateDayOfWeekNoHour, getColorHexFromData, isNotNull } from '@okampus/shared/utils';

import { TextBadge, TextFinance } from '@okampus/ui/atoms';
import { NavigationContext } from '@okampus/ui/hooks';
import { FileGroup, LabeledTeam, LabeledUser } from '@okampus/ui/molecules';
import { Dashboard } from '@okampus/ui/organisms';
import { getAvatar } from '@okampus/ui/utils';

import { useTranslation } from 'react-i18next';
import { useContext } from 'react';

import type { FinanceBaseInfo } from '@okampus/shared/graphql';

export type FinanceDashboardProps = { finances?: FinanceBaseInfo[] };
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
      render: (value: FinanceBaseInfo) => {
        const projectLabel = value.project?.name ?? 'Dépense générale';
        const eventLabel = value.event?.name ?? value.category;

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
      render: (value: FinanceBaseInfo) => {
        return value.receivedBy.name;
      },
    },
    {
      label: 'Méthode',
      align: Align.Left,
      render: (value: FinanceBaseInfo) => {
        if (!value.payedBy) return <div className="text-1">{t(value.method)}</div>;

        const avatar = { src: getAvatar(value.payedBy.actorImages), size: 7 };

        const userId = value.payedBy.individual?.user?.id;
        if (userId) {
          return (
            <div className="flex flex-col gap-2">
              <div className="text-1 font-medium">{t(value.method)}</div>
              <LabeledUser
                id={userId}
                name={value.payedBy.name}
                avatar={avatar}
                labelClassName="text-base font-medium"
              />
            </div>
          );
        }

        const teamId = value.payedBy.team?.id as string;
        if (teamId) {
          return (
            <div>
              <div className="text-1 font-medium">{t(value.method)}</div>
              <LabeledTeam id={teamId} name={value.payedBy.name} avatar={avatar.src} />
              {/* <LabeledUser id={userId} name={value.payedBy.name} avatar={avatar} /> */}
            </div>
          );
        }

        return <div className="text-1 font-medium">{t(value.method)}</div>;
      },
    },
    {
      label: 'Date',
      render: (value: FinanceBaseInfo) => {
        const date = value.payedAt;
        if (!date) return null;
        return <div className="text-1 font-medium text-[1.05rem]">{formatDateDayOfWeekNoHour(date as string)}</div>;
      },
    },
    {
      label: 'Justificatif',
      render: (value: FinanceBaseInfo) => {
        const attachments = value.financeAttachments
          .map((attachment) => attachment.fileUpload)
          .filter(isNotNull)
          .map(({ name, size, type, url }) => ({ name, size, type, src: url }));

        if (attachments.length === 0) return <TextBadge color="grey" label="Manquant" />;
        return <FileGroup files={attachments} />;
      },
    },
    {
      align: Align.Right,
      label: 'Montant',
      render: (value: FinanceBaseInfo) => <TextFinance amount={value.amount ?? 0} className="text-lg" />,
    },
  ];

  return (
    <Dashboard
      columns={columns}
      data={finances}
      onElementClick={(data) => showSidePanel(<FinanceSidePanel finance={data} />)}
    />
  );
}
