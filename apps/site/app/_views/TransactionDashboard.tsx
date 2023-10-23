import TextBadge from '../_components/atoms/Badge/TextBadge';
import AvatarImage from '../_components/atoms/Image/AvatarImage';
import IMoney from '../_components/atoms/Inline/IMoney';
import ViewLayout from '../_components/atoms/Layout/ViewLayout';

import TransactionSidePanel from '../_components/layouts/SidePanel/TransactionSidePanel/TransactionSidePanel';

import ActionButton from '../_components/molecules/Button/ActionButton';
import FileGroup from '../_components/molecules/Group/FileGroup';
import TextInput from '../_components/molecules/Input/TextInput';
import UserLabeled from '../_components/molecules/Labeled/UserLabeled';

import Dashboard from '../_components/organisms/Dashboard';

import { useQueryAndSubscribe } from '../_hooks/apollo/useQueryAndSubscribe';
import { useTranslation } from '../_hooks/context/useTranslation';

import { isSidePanelOpenAtom } from '../_context/global';
import { useModal } from '../_hooks/context/useModal';
import { download } from '../../utils/download-file';

import { Align } from '@okampus/shared/enums';
import { ActionType } from '@okampus/shared/types';
import { OrderBy, GetTransactionsDocument } from '@okampus/shared/graphql';
import { isNotNull, getColorHexFromData, toCsv, getDateTimeString } from '@okampus/shared/utils';

import { Download, MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';
import { useState } from 'react';
import { useAtom } from 'jotai';

import type { GetTransactionsQuery, GetTransactionsQueryVariables } from '@okampus/shared/graphql';
import type { TransactionMinimalInfo } from '../../types/features/transaction.info';

export type TransactionDashboardProps = {
  actor: { id: string; name: string };
  header?: string;
  searchBarButtons?: React.ReactNode;
  onData?: (data: TransactionMinimalInfo[]) => void;
};
export default function TransactionDashboard({ actor, header, searchBarButtons }: TransactionDashboardProps) {
  const [, setIsSidePanelOpen] = useAtom(isSidePanelOpenAtom);
  const { openModal } = useModal();

  const { t, format } = useTranslation();

  const [search, setSearch] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionMinimalInfo | null>(null);

  const { data } = useQueryAndSubscribe<GetTransactionsQuery, GetTransactionsQueryVariables>({
    query: GetTransactionsDocument,
    variables: {
      where: { _or: [{ payedById: { _eq: actor.id } }, { receivedById: { _eq: actor.id } }] },
      orderBy: [{ payedAt: OrderBy.Desc }],
    },
  });

  const columns = [
    {
      data: (value: TransactionMinimalInfo) => {
        const targetActor = value.receivedBy.id === actor.id ? value.payedBy : value.receivedBy;
        return targetActor.name;
      },
      label: 'Transaction',
      render: (value: TransactionMinimalInfo) => {
        const targetActor = value.receivedBy.id === actor.id ? value.payedBy : value.receivedBy;
        const projectLabel = value.project?.name ?? 'Dépense générale';

        const labels = [projectLabel, t('enums', `TransactionType.${value.type}`)].filter(isNotNull);

        return (
          <div className="flex text-0 gap-4 items-start max-w-[28rem]">
            <AvatarImage actor={targetActor} className="h-12 w-12 rounded-2xl" />
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
      data: (value: TransactionMinimalInfo) => t('enums', `PaymentMethod.${value.method}`),
      label: 'Méthode',
      align: Align.Left,
      render: (value: TransactionMinimalInfo) => {
        return <div className="text-1 font-medium">{t('enums', `PaymentMethod.${value.method}`)}</div>;
      },
    },
    {
      data: (value: TransactionMinimalInfo) => value.processedBy?.actor.name ?? '',
      label: 'Payé par',
      align: Align.Left,
      render: (value: TransactionMinimalInfo) => {
        return value.processedBy ? (
          <UserLabeled user={value.processedBy} />
        ) : (
          <TextBadge color="grey" label="Inconnu" />
        );
      },
    },
    {
      data: (value: TransactionMinimalInfo) => value.payedAt,
      label: 'Date',
      render: (value: TransactionMinimalInfo) => {
        const date = value.payedAt;
        if (!date) return null;
        return <div className="text-1 font-medium">{format('weekDay', new Date(date))}</div>;
      },
    },
    {
      data: (value: TransactionMinimalInfo) => {
        const attachment = value.transactionAttachments.map(({ attachment }) => attachment);
        return attachment.length;
      },
      label: 'Justificatif',
      render: (value: TransactionMinimalInfo) => {
        const attachments = value.transactionAttachments.map(({ attachment }) => attachment);
        return attachments.length > 0 ? <FileGroup files={attachments} /> : <TextBadge color="grey" label="Manquant" />;
      },
    },
    {
      data: (value: TransactionMinimalInfo) => value.amount,
      align: Align.Right,
      label: 'Montant',
      render: (value: TransactionMinimalInfo) => <IMoney amount={value.amount} />,
    },
  ];

  return (
    <>
      <ViewLayout
        sidePanelIcon={null}
        scrollable={false}
        bottomPadded={false}
        innerClassName="h-full flex flex-col"
        header={header}
        actions={
          data?.transaction
            ? [
                <ActionButton
                  key="export"
                  action={{
                    iconOrSwitch: <Download />,
                    label: 'Exporter la trésorerie',
                    linkOrActionOrMenu: () => {
                      const csv = toCsv(data.transaction, columns);
                      download(
                        URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })),
                        `tresorerie-${getDateTimeString(new Date())}.csv`,
                      );
                    },
                    type: ActionType.Action,
                  }}
                />,
              ]
            : []
        }
      >
        <div className="flex gap-6 px-content pb-6">
          <TextInput
            name="search"
            startContent={<MagnifyingGlass className="mr-2" />}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher une transaction"
          />
          {searchBarButtons}
        </div>
        <Dashboard
          className="h-full overflow-y-scroll scrollbar"
          columns={columns}
          data={data?.transaction}
          onElementClick={(data) => {
            setSelectedTransaction(data);
            setIsSidePanelOpen(true);
          }}
        />
      </ViewLayout>
      {selectedTransaction && (
        <TransactionSidePanel
          transaction={selectedTransaction}
          actorId={actor.id}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </>
  );
}
