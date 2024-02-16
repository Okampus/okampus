'use client';

import TransactionForm from '../Form/TransactionForm/TransactionForm';

import TextBadge from '../../_components/atoms/Badge/TextBadge';
import AvatarImage from '../../_components/atoms/Image/AvatarImage';
import IMoney from '../../_components/atoms/Inline/IMoney';

// import Button from '../../_components/molecules/Button/Button';
import FileStack from '../../_components/molecules/Stack/FileStack';
import SearchInput from '../../_components/molecules/Input/Other/SearchInput';
import UserLabeled from '../../_components/molecules/Labeled/UserLabeled';

import Datagrid from '../../_components/organisms/Datagrid';
import BaseView from '../../_components/templates/BaseView';

import { useModal } from '../../_hooks/context/useModal';

import { dateFormatters } from '../../../utils/format/format';
import { FallbackAvatar } from '../../_components/atoms/Image/FallbackAvatar';
import CTAButton from '../../_components/molecules/Button/CTAButton';
import { ActionType, Align } from '@okampus/shared/enums';

import { PaperclipHorizontal, Plus, WarningCircle } from '@phosphor-icons/react';
import { ActorType } from '@prisma/client';

import { useFormatter, useTranslations } from 'next-intl';
import { useState } from 'react';

import type { TeamManageTransactions } from '../../../types/prisma/Team/team-manage-transactions';
import type { TransactionMinimal } from '../../../types/prisma/Transaction/transaction-minimal';

export type TransactionsViewProps = {
  team: TeamManageTransactions;
  // actor: ActorWithTags;
  header?: React.ReactNode;
  transactions: TransactionMinimal[];
};
export default function TransactionsView({
  team,
  // actor,
  header,
  transactions,
}: TransactionsViewProps) {
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
      classes: 'w-28',
      render: (value: TransactionMinimal) => {
        const counterPartyName = value.counterPartyActor?.name ?? value.counterPartyName ?? (
          <>
            Inconnu
            <WarningCircle className="w-4 h-4 text-[var(--danger)]" />
          </>
        );

        return (
          <div className="flex text-0 gap-4 items-start">
            {value.counterPartyActor ? (
              <AvatarImage actor={value.counterPartyActor} className="h-12 w-12" type={ActorType.User} />
            ) : (
              <FallbackAvatar actorType={value.counterPartyActorType} className="h-12 w-12" />
            )}
            <div className="flex flex-col w-full">
              <div className="flex gap-2 items-center text-base text-0 font-medium">{counterPartyName}</div>
              <span className="line-clamp-1 text-2 text-sm">{value.wording}</span>
            </div>
          </div>
        );
      },
    },
    {
      data: (value: TransactionMinimal) => value.liableTeamMember?.user?.actor.name ?? '',
      label: 'Projet lié',
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
      data: (value: TransactionMinimal) => value.liableTeamMember?.user?.actor.name ?? '',
      label: 'Catégorie',
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
      data: (value: TransactionMinimal) =>
        value.paymentMethod
          ? t(`Enums.PaymentMethod.${value.paymentMethod}`)
          : value.teamPaymentMethod
          ? value.teamPaymentMethod.name
          : t('Common.Missing'),
      label: 'Méthode',
      align: Align.Left,
      render: (value: TransactionMinimal) => {
        return <div className="text-1 font-medium">{t(`Enums.PaymentMethod.${value.paymentMethod}`)}</div>;
      },
    },
    {
      data: (value: TransactionMinimal) => value.attachments.length,
      label: <PaperclipHorizontal className="w-6 h-6 inline" />,
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
        innerClassName="overflow-hidden"
        header={header}
        hasCta={true}
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

          <CTAButton type={ActionType.Primary} action={`/manage/team/${team.slug}/transactions/new`}>
            <Plus className="w-7 h-7" />
            Ajouter une transaction
          </CTAButton>
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
