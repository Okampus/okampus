'use client';

import ViewLayout from '../../../../../../../components/atoms/Layout/ViewLayout';
import IMoney from '../../../../../../../components/atoms/Inline/IMoney';
import TextBadge from '../../../../../../../components/atoms/Badge/TextBadge';
import FileGroup from '../../../../../../../components/molecules/Group/FileGroup';
import AvatarImage from '../../../../../../../components/atoms/Image/AvatarImage';
import TransactionForm from '../../../../../../../components/forms/TransactionForm/TransactionForm';
import FinanceSidePanel from '../../../../../../../components/layouts/SidePanel/FinanceSidePanel/FinanceSidePanel';
import ActionButton from '../../../../../../../components/molecules/Button/ActionButton';
import TextInput from '../../../../../../../components/molecules/Input/TextInput';
import TeamLabeled from '../../../../../../../components/molecules/Labeled/TeamLabeled';
import UserLabeled from '../../../../../../../components/molecules/Labeled/UserLabeled';
import Dashboard from '../../../../../../../components/organisms/Dashboard';

import { useTeamManage } from '../../../../../../../context/navigation';
import { useModal } from '../../../../../../../hooks/context/useModal';
import { useTranslation } from '../../../../../../../hooks/context/useTranslation';
import { useTypedQueryAndSubscribe } from '../../../../../../../hooks/apollo/useTypedQueryAndSubscribe';
import { download } from '../../../../../../../utils/download-file';

import { Align } from '@okampus/shared/enums';
import { financeBaseInfo, OrderBy } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';
import { getColorHexFromData, isNotNull, toCsv } from '@okampus/shared/utils';

import { IconChevronRight, IconPlus, IconSearch } from '@tabler/icons-react';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import type { FinanceBaseInfo } from '@okampus/shared/graphql';

export default function TeamManageTransactionsPage({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);
  const { openModal } = useModal();

  const { t, format } = useTranslation();

  const [search, setSearch] = useState('');
  const [selectedFinance, setSelectedFinance] = useState<FinanceBaseInfo | null>(null);

  const where = useMemo(() => ({ team: { id: { _eq: teamManage?.id } } }), [teamManage?.id]);
  const variables = { where, orderBy: [{ payedAt: OrderBy.DESC }] };
  const { data } = useTypedQueryAndSubscribe({ queryName: 'finance', selector: [variables, financeBaseInfo] });

  const account = teamManage?.accounts?.[0];
  if (!account) return null;

  const columns = [
    {
      data: (value: FinanceBaseInfo) => {
        const actor = value.receivedBy.id === teamManage?.actor?.id ? value.payedBy : value.receivedBy;
        return actor.name;
      },
      label: 'Transaction',
      render: (value: FinanceBaseInfo) => {
        const actor = value.receivedBy.id === teamManage?.actor?.id ? value.payedBy : value.receivedBy;

        const projectLabel = value.project?.name ?? 'Dépense générale';
        // const eventLabel = value.event?.name ?? value.category;

        const labels = [projectLabel, t(`enums.FinanceCategory.${value.category}`)].filter(isNotNull);

        return (
          <div className="flex text-0 gap-4 items-start max-w-[28rem]">
            <AvatarImage actor={actor} className="h-12 w-12 rounded-2xl" type="team" />
            {/* <div className="h-12 w-12 rounded-2xl" style={{ backgroundColor: getColorHexFromData(value.category) }} /> */}
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
      data: (value: FinanceBaseInfo) => t(`enums.PaymentMethod.${value.method}`),
      label: 'Méthode',
      align: Align.Left,
      render: (value: FinanceBaseInfo) => {
        return <div className="text-1 font-medium">{t(`enums.PaymentMethod.${value.method}`)}</div>;
      },
    },
    {
      data: (value: FinanceBaseInfo) => value.initiatedBy?.actor.name ?? '',
      label: 'Payé par',
      align: Align.Left,
      render: (value: FinanceBaseInfo) => {
        return value.initiatedBy?.user ? (
          <UserLabeled individual={value.initiatedBy} id={value.initiatedBy.user.id} />
        ) : (
          <TextBadge color="grey" label="Inconnu" />
        );
      },
    },
    {
      data: (value: FinanceBaseInfo) => value.payedAt,
      label: 'Date',
      render: (value: FinanceBaseInfo) => {
        const date = value.payedAt;
        if (!date) return null;
        return <div className="text-1 font-medium">{format('weekDay', new Date(date))}</div>;
      },
    },
    {
      data: (value: FinanceBaseInfo) => {
        const attachment = value.financeAttachments.map((attachment) => attachment.fileUpload).filter(isNotNull);
        return attachment.length;
      },
      label: 'Justificatif',
      render: (value: FinanceBaseInfo) => {
        const attachments = value.financeAttachments.map((attachment) => attachment.fileUpload).filter(isNotNull);
        return attachments.length > 0 ? <FileGroup files={attachments} /> : <TextBadge color="grey" label="Manquant" />;
      },
    },
    {
      data: (value: FinanceBaseInfo) => value.amount,
      align: Align.Right,
      label: 'Montant',
      render: (value: FinanceBaseInfo) => <IMoney amount={value.amount} />,
    },
  ];

  return (
    <>
      <ViewLayout
        sidePanelIcon={null}
        scrollable={false}
        bottomPadded={false}
        className="h-full flex flex-col"
        header={
          <div>
            <b className="page-title">{format('euro', account.financesAggregate.aggregate?.sum?.amount ?? 0)}</b>
            <div className="text-1 text-lg font-medium">Total restant</div>
          </div>
        }
        actions={
          data?.finance
            ? [
                <ActionButton
                  key="export"
                  action={{
                    label: 'Exporter la trésorerie',
                    linkOrActionOrMenu: () => {
                      const csv = toCsv(data.finance, columns);
                      download(
                        URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })),
                        `tresorerie-${new Date().toISOString()}.csv`
                      );
                    },
                    type: ActionType.Action,
                  }}
                />,
              ]
            : []
        }
      >
        {account.children.length > 0 && (
          <div className="shrink-0 flex gap-4 items-center mb-6 overflow-y-hidden overflow-x-scroll scrollbar">
            {account.children.map((child) => (
              <Link
                href={`/manage/team/${child.team.actor?.slug}/transactions`}
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
            startContent={<IconSearch className="text-[var(--text-2)]" />}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={'Rechercher une transaction'}
          />
          <ActionButton
            action={{
              label: 'Ajouter une transaction',
              linkOrActionOrMenu: () => openModal({ node: <TransactionForm teamManage={teamManage} /> }),
              iconOrSwitch: <IconPlus />,
              type: ActionType.Primary,
            }}
          />
        </div>
        <Dashboard
          className="h-full overflow-y-scroll scrollbar"
          columns={columns}
          data={data?.finance}
          onElementClick={(data) => setSelectedFinance(data)}
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
