'use client';

import TransactionForm from '../Form/TransactionForm';

import TextBadge from '../../_components/atoms/Badge/TextBadge';
import AvatarImage from '../../_components/atoms/Image/AvatarImage';
import IMoney from '../../_components/atoms/Inline/IMoney';

import FileStack from '../../_components/molecules/Stack/FileStack';
import SearchInput from '../../_components/molecules/Input/Other/SearchInput';
import UserLabeled from '../../_components/molecules/Labeled/UserLabeled';

import Datagrid from '../../_components/organisms/Datagrid';
import BaseView from '../../_components/templates/BaseView';

import { useModal } from '../../_hooks/context/useModal';

import { dateFormatters } from '../../../utils/format/format';
import { Align } from '@okampus/shared/enums';
import { isNotNull, getColorHexFromData } from '@okampus/shared/utils';

import { PaperclipHorizontal, WarningCircle } from '@phosphor-icons/react';
import { ActorType } from '@prisma/client';
import { useState } from 'react';

import { useFormatter, useTranslations } from 'next-intl';
import type { TeamManageTransactions } from '../../../types/prisma/Team/team-manage-transactions';
import type { TransactionMinimal } from '../../../types/prisma/Transaction/transaction-minimal';

export type TransactionDashboardProps = {
  team: TeamManageTransactions;
  // actor: ActorWithTags;
  header?: React.ReactNode;
  searchBarButtons?: React.ReactNode;
  transactions: TransactionMinimal[];
};
export default function TransactionDashboard({
  team,
  // actor,
  header,
  searchBarButtons,
  transactions,
}: TransactionDashboardProps) {
  const { openModal } = useModal();

  const t = useTranslations();
  const format = useFormatter();

  const [search, setSearch] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionMinimal | null>(null);

  // const { data } = useQueryAndSubscribe<GetTransactionsQuery, GetTransactionsQueryVariables>({
  //   query: GetTransactionsDocument,
  //   variables: {
  //     where: { _or: [{ payedById: { _eq: actor.id } }, { receivedById: { _eq: actor.id } }] },
  //     orderBy: [{ payedAt: OrderBy.Desc }],
  //   },
  // });

  const columns = [
    {
      data: (value: TransactionMinimal) => value.payedAt,
      label: 'Date',
      render: (value: TransactionMinimal) => {
        const date = value.payedAt;
        if (!date) return null;
        return <div className="text-1 font-medium">{format.dateTime(new Date(date), dateFormatters.dayShort)}</div>;
      },
    },
    {
      data: (value: TransactionMinimal) => {
        return value.counterPartyActor?.name ?? value.counterPartyName ?? 'Inconnu';
      },
      label: 'Transaction',
      render: (value: TransactionMinimal) => {
        const counterPartyName = value.counterPartyActor?.name ?? value.counterPartyName ?? 'Inconnu';
        const projectLabel = value.project?.name ?? 'Dépense générale';
        const labels = [projectLabel, t(`Enums.TransactionType.${value.transactionType}`)].filter(isNotNull);

        if (!value.counterPartyActor) return null;

        return (
          <div className="flex text-0 gap-4 items-start max-w-[28rem]">
            <AvatarImage actor={value.counterPartyActor} className="h-12 w-12" type={ActorType.User} />
            <div className="flex flex-col gap-0.5">
              <div className="flex gap-2 items-center text-base text-0 font-medium">{counterPartyName}</div>
              <span className="flex gap-2 line-clamp-1 flex-wrap">
                {labels.map((label, idx) => (
                  <TextBadge key={idx} color={getColorHexFromData(label)}>
                    {label}
                  </TextBadge>
                ))}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      data: (value: TransactionMinimal) => t(`Enums.PaymentMethod.${value.paymentMethod}`),
      label: 'Méthode',
      align: Align.Left,
      render: (value: TransactionMinimal) => {
        return <div className="text-1 font-medium">{t(`Enums.PaymentMethod.${value.paymentMethod}`)}</div>;
      },
    },
    {
      data: (value: TransactionMinimal) => value.liableTeamMember?.user?.actor.name ?? '',
      label: 'Payé par',
      align: Align.Left,
      render: (value: TransactionMinimal) => {
        return value.liableTeamMember?.user ? (
          <UserLabeled user={value.liableTeamMember.user} />
        ) : (
          <TextBadge color="grey">Inconnu</TextBadge>
        );
      },
    },
    {
      data: (value: TransactionMinimal) => value.attachments.length,
      label: <PaperclipHorizontal className="w-6 h-6 inline" />,
      classes: 'w-12',
      render: (value: TransactionMinimal) => {
        return value.attachments.length > 0 ? (
          <FileStack files={value.attachments} />
        ) : (
          <WarningCircle weight="fill" className="w-6 h-6 text-[var(--danger)]" />
        );
      },
    },
    {
      data: (value: TransactionMinimal) => value.amount,
      align: Align.Right,
      label: 'Montant',
      render: (value: TransactionMinimal) => <IMoney amount={value.amount} />,
    },
  ];

  return (
    <>
      <BaseView
        sidePanelButton={null}
        unscrollable={true}
        paddingMode="none"
        innerClassName="h-full flex flex-col"
        header={header}
        // actions={
        //   data?.transaction
        //     ? [
        //         <ActionButton
        //           key="export"
        //           action={{
        //             iconOrSwitch: <Download />,
        //             label: 'Exporter la trésorerie',
        //             linkOrActionOrMenu: () => {
        //               console.log('TODO');
        //               // const csv = toCsv(data.transaction, columns);
        //               // download(
        //               //   URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })),
        //               //   `tresorerie-${getDateTimeString(new Date())}.csv`,
        //               // );
        //             },
        //             type={ActionType.Action}

        //           }}
        //         />,
        //       ]
        //     : []
        // }
      >
        <div className="flex gap-6 px-[var(--px-content)] pb-6">
          <SearchInput value={search} onChange={setSearch} />
          {/* <TextInput
            name="search"
            start={<MagnifyingGlass className="mr-2" />}
            // onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher une transaction"
          /> */}
          {searchBarButtons}
        </div>
        <Datagrid
          className="h-full overflow-y-scroll scrollbar"
          columns={columns}
          data={transactions}
          renderSelectedElement={(transaction) => <TransactionForm team={team} transaction={transaction} />}
        />
      </BaseView>
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
