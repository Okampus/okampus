import TextBadge from '../_components/atoms/Badge/TextBadge';
import AvatarImage from '../_components/atoms/Image/AvatarImage';
import IMoney from '../_components/atoms/Inline/IMoney';
import ViewLayout from '../_components/atoms/Layout/ViewLayout';

import ActionButton from '../_components/molecules/Button/ActionButton';
import FileGroup from '../_components/molecules/Group/FileGroup';
import TextInput from '../_components/molecules/Input/TextInput';
import UserLabeled from '../_components/molecules/Labeled/UserLabeled';

import { useQueryAndSubscribe } from '../_hooks/apollo/useQueryAndSubscribe';
import { useTranslation } from '../_hooks/context/useTranslation';

import { isSidePanelOpenAtom } from '../_context/global';
import { useModal } from '../_hooks/context/useModal';

import { Align } from '@okampus/shared/enums';
import { ActionType } from '@okampus/shared/types';
import { OrderBy, GetTransactionsDocument } from '@okampus/shared/graphql';
import { isNotNull, getColorHexFromData } from '@okampus/shared/utils';

import { Download, MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';
import { useState } from 'react';
import { useAtom } from 'jotai';

import type { TransactionWithContext } from '../../types/features/transaction.info';
import type { GetTransactionsQuery, GetTransactionsQueryVariables } from '@okampus/shared/graphql';

export type TransactionDashboardProps = {
  actor: { id: string; name: string };
  header?: string;
  searchBarButtons?: React.ReactNode;
  onData?: (data: TransactionWithContext[]) => void;
};
export default function TransactionDashboard({ actor, header, searchBarButtons }: TransactionDashboardProps) {
  const [, setIsSidePanelOpen] = useAtom(isSidePanelOpenAtom);
  const { openModal } = useModal();

  const { t, format } = useTranslation();

  const [search, setSearch] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithContext | null>(null);

  const { data } = useQueryAndSubscribe<GetTransactionsQuery, GetTransactionsQueryVariables>({
    query: GetTransactionsDocument,
    variables: {
      where: { _or: [{ payedById: { _eq: actor.id } }, { receivedById: { _eq: actor.id } }] },
      orderBy: [{ payedAt: OrderBy.Desc }],
    },
  });

  const columns = [
    {
      data: (value: TransactionWithContext) => {
        const targetActor = value.receivedBy.id.toString() === actor.id ? value.payedBy : value.receivedBy;
        return targetActor.name;
      },
      label: 'Transaction',
      render: (value: TransactionWithContext) => {
        const targetActor = value.receivedBy.id.toString() === actor.id ? value.payedBy : value.receivedBy;
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
      data: (value: TransactionWithContext) => t('enums', `PaymentMethod.${value.method}`),
      label: 'Méthode',
      align: Align.Left,
      render: (value: TransactionWithContext) => {
        return <div className="text-1 font-medium">{t('enums', `PaymentMethod.${value.method}`)}</div>;
      },
    },
    {
      data: (value: TransactionWithContext) => value.processedBy?.actor.name ?? '',
      label: 'Payé par',
      align: Align.Left,
      render: (value: TransactionWithContext) => {
        return value.processedBy ? (
          <UserLabeled user={value.processedBy} />
        ) : (
          <TextBadge color="grey" label="Inconnu" />
        );
      },
    },
    {
      data: (value: TransactionWithContext) => value.payedAt,
      label: 'Date',
      render: (value: TransactionWithContext) => {
        const date = value.payedAt;
        if (!date) return null;
        return <div className="text-1 font-medium">{format('weekDay', new Date(date))}</div>;
      },
    },
    {
      data: (value: TransactionWithContext) => value.attachments.length,
      label: 'Justificatif',
      render: (value: TransactionWithContext) => {
        return value.attachments.length > 0 ? (
          <FileGroup files={value.attachments} />
        ) : (
          <TextBadge color="grey" label="Manquant" />
        );
      },
    },
    {
      data: (value: TransactionWithContext) => value.amount,
      align: Align.Right,
      label: 'Montant',
      render: (value: TransactionWithContext) => <IMoney amount={value.amount} />,
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
                      console.log('TODO');
                      // const csv = toCsv(data.transaction, columns);
                      // download(
                      //   URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })),
                      //   `tresorerie-${getDateTimeString(new Date())}.csv`,
                      // );
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
        {/* <Dashboard
          className="h-full overflow-y-scroll scrollbar"
          columns={columns}
          data={data?.transaction}
          onElementClick={(data) => {
            setSelectedTransaction(data);
            setIsSidePanelOpen(true);
          }}
        /> */}
      </ViewLayout>
      {/* {selectedTransaction && (
        <TransactionSidePanel
          transaction={selectedTransaction}
          actorId={actor.id}
          onClose={() => setSelectedTransaction(null)}
        />
      )} */}
    </>
  );
}
