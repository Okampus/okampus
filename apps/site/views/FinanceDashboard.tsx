import TextBadge from '../components/atoms/Badge/TextBadge';
import AvatarImage from '../components/atoms/Image/AvatarImage';
import IMoney from '../components/atoms/Inline/IMoney';
import ViewLayout from '../components/atoms/Layout/ViewLayout';

import FinanceSidePanel from '../components/layouts/SidePanel/FinanceSidePanel/FinanceSidePanel';

import ActionButton from '../components/molecules/Button/ActionButton';
import FileGroup from '../components/molecules/Group/FileGroup';
import TextInput from '../components/molecules/Input/TextInput';
import UserLabeled from '../components/molecules/Labeled/UserLabeled';

import Dashboard from '../components/organisms/Dashboard';

import { useQueryAndSubscribe } from '../hooks/apollo/useQueryAndSubscribe';
import { useTranslation } from '../hooks/context/useTranslation';

import { isSidePanelOpenAtom } from '../context/global';
import { download } from '../utils/download-file';
import { useModal } from '../hooks/context/useModal';
import { ActionType } from '@okampus/shared/types';
import { Align } from '@okampus/shared/enums';
import { OrderBy, GetFinancesDocument } from '@okampus/shared/graphql';
import { isNotNull, getColorHexFromData, toCsv } from '@okampus/shared/utils';

import { IconDownload, IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import { useAtom } from 'jotai';

import type { GetFinancesQuery, GetFinancesQueryVariables } from '@okampus/shared/graphql';
import type { FinanceMinimalInfo } from '../types/features/finance.info';

export type FinanceDashboardProps = {
  actor: { id: string; name: string };
  header?: string;
  searchBarButtons?: React.ReactNode;
  onData?: (data: FinanceMinimalInfo[]) => void;
};
export default function FinanceDashboard({ actor, header, searchBarButtons }: FinanceDashboardProps) {
  const [, setIsSidePanelOpen] = useAtom(isSidePanelOpenAtom);
  const { openModal } = useModal();

  const { t, format } = useTranslation();

  const [search, setSearch] = useState('');
  const [selectedFinance, setSelectedFinance] = useState<FinanceMinimalInfo | null>(null);

  const { data } = useQueryAndSubscribe<GetFinancesQuery, GetFinancesQueryVariables>({
    query: GetFinancesDocument,
    variables: {
      where: { _or: [{ payedById: { _eq: actor.id } }, { receivedById: { _eq: actor.id } }] },
      orderBy: [{ payedAt: OrderBy.Desc }],
    },
  });

  const columns = [
    {
      data: (value: FinanceMinimalInfo) => {
        const targetActor = value.receivedBy.id === actor.id ? value.payedBy : value.receivedBy;
        return targetActor.name;
      },
      label: 'Transaction',
      render: (value: FinanceMinimalInfo) => {
        const targetActor = value.receivedBy.id === actor.id ? value.payedBy : value.receivedBy;
        const projectLabel = value.project?.name ?? 'Dépense générale';

        const labels = [projectLabel, t(`enums.FinanceCategory.${value.category}`)].filter(isNotNull);

        return (
          <div className="flex text-0 gap-4 items-start max-w-[28rem]">
            <AvatarImage actor={targetActor} className="h-12 w-12 rounded-2xl" type="team" />
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
        header={header}
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
        <div className="flex gap-6 px-content pb-6">
          <TextInput
            name="search"
            startContent={<IconSearch className="mr-2" />}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher une transaction"
          />
          {searchBarButtons}
        </div>
        <Dashboard
          className="h-full overflow-y-scroll scrollbar"
          columns={columns}
          data={data?.finance}
          onElementClick={(data) => {
            setSelectedFinance(data);
            setIsSidePanelOpen(true);
          }}
        />
      </ViewLayout>
      {selectedFinance && (
        <FinanceSidePanel finance={selectedFinance} actorId={actor.id} onClose={() => setSelectedFinance(null)} />
      )}
    </>
  );
}
