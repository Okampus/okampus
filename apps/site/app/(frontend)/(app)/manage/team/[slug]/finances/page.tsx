'use client';

import ViewLayout from '../../../../../../../components/atoms/Layout/ViewLayout';
import IMoney from '../../../../../../../components/atoms/Inline/IMoney';
import TextBadge from '../../../../../../../components/atoms/Badge/TextBadge';
import FileGroup from '../../../../../../../components/molecules/Group/FileGroup';
import AvatarImage from '../../../../../../../components/atoms/Image/AvatarImage';
import FinanceForm from '../../../../../../../components/forms/MultiStepForm/FinanceForm/FinanceForm';
import FinanceSidePanel from '../../../../../../../components/layouts/SidePanel/FinanceSidePanel/FinanceSidePanel';
import ActionButton from '../../../../../../../components/molecules/Button/ActionButton';
import TextInput from '../../../../../../../components/molecules/Input/TextInput';
import TeamLabeled from '../../../../../../../components/molecules/Labeled/TeamLabeled';
import UserLabeled from '../../../../../../../components/molecules/Labeled/UserLabeled';
import Dashboard from '../../../../../../../components/organisms/Dashboard';

import { isSidePanelOpenAtom } from '../../../../../../../context/global';
import { useTeamManage } from '../../../../../../../context/navigation';
import { useModal } from '../../../../../../../hooks/context/useModal';
import { useTranslation } from '../../../../../../../hooks/context/useTranslation';
import { useQueryAndSubscribe } from '../../../../../../../hooks/apollo/useQueryAndSubscribe';
import { download } from '../../../../../../../utils/download-file';

import { GetFinancesDocument, OrderBy } from '@okampus/shared/graphql';
import { Align } from '@okampus/shared/enums';
import { ActionType } from '@okampus/shared/types';
import { getColorHexFromData, isNotNull, toCsv } from '@okampus/shared/utils';

import { IconChevronRight, IconDownload, IconPlus, IconSearch } from '@tabler/icons-react';

import { useAtom } from 'jotai';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import type { GetFinancesQuery, GetFinancesQueryVariables } from '@okampus/shared/graphql';
import type { FinanceMinimalInfo } from '../../../../../../../types/features/finance.info';

export default function TeamManageTransactionsPage({ params }: { params: { slug: string } }) {
  const [, setIsSidePanelOpen] = useAtom(isSidePanelOpenAtom);

  const { teamManage } = useTeamManage(params.slug);
  const { openModal } = useModal();

  const { t, format } = useTranslation();

  const [search, setSearch] = useState('');
  const [selectedFinance, setSelectedFinance] = useState<FinanceMinimalInfo | null>(null);

  const where = useMemo(() => ({ team: { id: { _eq: teamManage?.id } } }), [teamManage?.id]);

  const variables = { where, orderBy: [{ payedAt: OrderBy.Desc }] };
  const { data } = useQueryAndSubscribe<GetFinancesQuery, GetFinancesQueryVariables>({
    query: GetFinancesDocument,
    variables,
  });

  const bankAccount = teamManage?.bankAccounts?.[0];
  if (!bankAccount) return null;

  const finances = data?.finance;

  const columns = [
    {
      data: (value: FinanceMinimalInfo) => {
        const actor = value.receivedBy.id === teamManage?.actor?.id ? value.payedBy : value.receivedBy;
        return actor.name;
      },
      label: 'Transaction',
      render: (value: FinanceMinimalInfo) => {
        const actor = value.receivedBy.id === teamManage?.actor?.id ? value.payedBy : value.receivedBy;
        const projectLabel = value.project?.name ?? 'Dépense générale';

        const labels = [projectLabel, t(`enums.FinanceCategory.${value.category}`)].filter(isNotNull);

        return (
          <div className="flex text-0 gap-4 items-start max-w-[28rem]">
            <AvatarImage actor={actor} className="h-12 w-12 rounded-2xl" type="team" />
            <div className="flex flex-col gap-0.5">
              <div className="flex gap-2 items-center text-base text-0 font-medium">{actor?.name}</div>
              <span className="flex gap-2 line-clamp-1 flex-wrap">
                {labels.map((label, idx) => (
                  <TextBadge key={idx} label={label} color={getColorHexFromData(label)} />
                ))}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      data: (value: FinanceMinimalInfo) => t(`enums.PaymentMethod.${value.method}`),
      label: 'Méthode',
      align: Align.Left,
      render: (value: FinanceMinimalInfo) => {
        return <div className="text-1 font-medium">{t(`enums.PaymentMethod.${value.method}`)}</div>;
      },
    },
    {
      data: (value: FinanceMinimalInfo) => value.initiatedBy?.actor.name ?? '',
      label: 'Payé par',
      align: Align.Left,
      render: (value: FinanceMinimalInfo) => {
        return value.initiatedBy ? (
          <UserLabeled user={value.initiatedBy} />
        ) : (
          <TextBadge color="grey" label="Inconnu" />
        );
      },
    },
    {
      data: (value: FinanceMinimalInfo) => value.payedAt,
      label: 'Date',
      render: (value: FinanceMinimalInfo) => {
        const date = value.payedAt;
        if (!date) return null;
        return <div className="text-1 font-medium">{format('weekDay', new Date(date))}</div>;
      },
    },
    {
      data: (value: FinanceMinimalInfo) => {
        const attachment = value.financeAttachments.map(({ attachment }) => attachment);
        return attachment.length;
      },
      label: 'Justificatif',
      render: (value: FinanceMinimalInfo) => {
        const attachments = value.financeAttachments.map(({ attachment }) => attachment);
        return attachments.length > 0 ? <FileGroup files={attachments} /> : <TextBadge color="grey" label="Manquant" />;
      },
    },
    {
      data: (value: FinanceMinimalInfo) => value.amount,
      align: Align.Right,
      label: 'Montant',
      render: (value: FinanceMinimalInfo) => <IMoney amount={value.amount} />,
    },
  ];

  return (
    <>
      <ViewLayout
        sidePanelIcon={null}
        scrollable={false}
        bottomPadded={false}
        innerClassName="h-full flex flex-col"
        header={format('euro', bankAccount.financesAggregate.aggregate?.sum?.amount ?? 0)}
        actions={
          data?.finance
            ? [
                <ActionButton
                  key="export"
                  action={{
                    iconOrSwitch: <IconDownload />,
                    label: 'Exporter la trésorerie',
                    linkOrActionOrMenu: () => {
                      const csv = toCsv(data.finance, columns);
                      download(
                        URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })),
                        `tresorerie-${new Date().toISOString()}.csv`,
                      );
                    },
                    type: ActionType.Action,
                  }}
                />,
              ]
            : []
        }
      >
        {bankAccount.childrenAccounts.length > 0 && (
          <div className="shrink-0 flex gap-4 items-center mb-6 overflow-y-hidden overflow-x-scroll scrollbar">
            {bankAccount.childrenAccounts.map((child) => (
              <Link
                href={`/manage/team/${child.team.slug}/finances`}
                key={child.id}
                className="p-3 shrink-0 flex gap-6 items-center rounded-2xl cursor-pointer border border-[var(--border-2)] bg-[var(--bg-main)] hover:bg-[var(--bg-3)] "
              >
                <TeamLabeled
                  team={child.team}
                  showCardOnClick={false}
                  content={
                    <IMoney
                      className="whitespace-nowrap"
                      amount={child.financesAggregate.aggregate?.sum?.amount || 0}
                    />
                  }
                />
                <IconChevronRight className="w-12 aspect-square shrink-0" />
              </Link>
            ))}
          </div>
        )}
        <div className="flex gap-6 px-content pb-6">
          <TextInput
            name="search"
            startContent={<IconSearch className="mr-2" />}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher une transaction"
          />
          <ActionButton
            action={{
              label: 'Ajouter une transaction',
              linkOrActionOrMenu: () => openModal({ node: <FinanceForm teamManage={teamManage} /> }),
              iconOrSwitch: <IconPlus />,
              type: ActionType.Primary,
            }}
          />
        </div>
        <Dashboard
          className="h-full overflow-y-scroll scrollbar"
          columns={columns}
          data={finances}
          onElementClick={(data) => {
            setSelectedFinance(data);
            setIsSidePanelOpen(true);
          }}
        />
      </ViewLayout>
      {selectedFinance && (
        <FinanceSidePanel
          finance={selectedFinance}
          teamManageActorId={teamManage.actor.id}
          onClose={() => setSelectedFinance(null)}
        />
      )}
    </>
  );
}
