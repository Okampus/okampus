import { TreasuryManageProjectView } from './TreasuryManage/TreasuryManageProjectView';
import { Align } from '@okampus/shared/enums';
import { financeBaseInfo, projectWithFinanceInfo, useTypedQuery, teamBaseInfo } from '@okampus/shared/graphql';
import { ReactComponent as UploadFilledIcon } from '@okampus/assets/svg/icons/material/filled/upload.svg';
import { ReactComponent as TuneFilledIcon } from '@okampus/assets/svg/icons/material/filled/tune.svg';
import { ReactComponent as SearchFilledIcon } from '@okampus/assets/svg/icons/material/filled/search.svg';
import { ReactComponent as AddFilledIcon } from '@okampus/assets/svg/icons/material/filled/add.svg';

import { ActionType } from '@okampus/shared/types';
import { formatCurrency, sum } from '@okampus/shared/utils';

import { Skeleton, TextFinance } from '@okampus/ui/atoms';
import { NavigationContext, useTeamManage } from '@okampus/ui/hooks';
import { ActionButton, TabsList } from '@okampus/ui/molecules';
import { Dashboard } from '@okampus/ui/organisms';

import { FinanceDashboard } from '#site/app/components/Dashboard/FinanceDashboard';
import { TeamTransactionCreateForm } from '#site/app/components/Form/MultiStepForm/TeamTransactionCreateForm';
import { memo, useContext, useState } from 'react';

import type { TeamManageInfo } from '@okampus/shared/graphql';

type BalanceSheetTransaction = {
  transaction: string;
  key?: string;
  amountExpected: number;
  amountPayed: number;
};

const HISTORY = 'history';
const BUDGET = 'budget';
const GENERAL = 'general';

function TreasuryManageViewWrapper({ teamManage }: { teamManage: TeamManageInfo }) {
  const { showOverlay } = useContext(NavigationContext);
  const [selectedTab, setSelectedTab] = useState<string | number>(HISTORY);

  const { data: financeDetails } = useTypedQuery({
    team: [
      { where: { id: { _eq: teamManage.id } }, limit: 1 },
      { ...teamBaseInfo, finances: [{}, financeBaseInfo] },
    ],
    // finance: [{ where: { team: { id: { _eq: teamManage.id } } } }, financeBaseInfo],
  });

  const { data } = useTypedQuery({
    project: [{ where: { team: { id: { _eq: teamManage.id } } } }, projectWithFinanceInfo],
  });

  const finances = financeDetails?.team[0].finances ?? [];

  const projects = data?.project ?? [];
  const balanceSheetColumns = [
    {
      label: 'Projet / Subvention',
      render: (value: BalanceSheetTransaction) => (
        <div
          onClick={() => value.key && setSelectedTab(value.key)}
          className={value.key ? 'cursor-pointer hover:underline' : 'text-0'}
        >
          {value.transaction}
        </div>
      ),
    },
    {
      label: 'Prévu',
      align: Align.Right,
      render: (value: BalanceSheetTransaction) => <div className="text-0">{formatCurrency(value.amountExpected)}</div>,
    },
    {
      label: 'Réel',
      align: Align.Right,
      render: (value: BalanceSheetTransaction) => <TextFinance amount={value.amountPayed} />,
    },
  ];

  const tabs = [
    {
      key: HISTORY,
      label: 'Historique',
      element: () => <FinanceDashboard finances={finances} />,
    },
    {
      key: BUDGET,
      label: 'Bilan',
      element: () => (
        <Dashboard
          columns={balanceSheetColumns}
          data={projects.map((project) => ({
            key: project.slug,
            transaction: project.name,
            amountExpected: project.budget,
            amountPayed: sum(project.finances.map((finance) => finance.amount ?? 0)),
          }))}
        />
      ),
    },
    {
      key: GENERAL,
      label: 'Général',
      element: () => (
        <div>
          <div className="px-12 text-4xl text-0 font-bold mt-6 mb-12">Dépenses/recettes générales</div>
          {finances && <FinanceDashboard finances={finances.filter((finance) => !finance.project)} />}
        </div>
      ),
      // onClick: () => setSelectedTab(GENERAL),
    },
    ...projects.map((project) => ({
      key: project.slug,
      label: project.name,
      element: () => <TreasuryManageProjectView project={project} />,
    })),
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="px-content py-content">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <div className="text-5xl font-semibold text-0 tracking-tight">
              {formatCurrency(teamManage.accounts[0]?.balance)}
            </div>
            <div className="text-1 text-lg">Total restant</div>
          </div>
          <div className="flex gap-4">
            <ActionButton
              action={{
                label: 'Importer un CSV',
                linkOrActionOrMenu: () => console.log('Import'),
                iconOrSwitch: <UploadFilledIcon />,
                type: ActionType.Action,
                active: true,
              }}
            />
            <ActionButton
              action={{
                label: 'Exporter la trésorerie',
                linkOrActionOrMenu: () => console.log('Import'),
                type: ActionType.Action,
              }}
            />
          </div>
        </div>
      </div>
      {/* <div className="grid grid-cols-3">
                  {projects.map((project) => (
                <Dashboard columns={columns} data={generalFinances.finance} />
                    // <>
                    //   <div className="text-2">{project.name}</div>
                    //   <div className="text-2">Budget prévu: {project.expected_budget} €</div>
                    //   <div className="text-2">
                    //     Dépenses réelles: {project.finances_aggregate.aggregate?.sum?.amount_due ?? 0} €
                    //   </div>
                    // </>
                  ))}
                </div> */}
      {/* <div className="h-full flex flex-col gap-6"> */}
      <div className="flex flex-col gap-6">
        <TabsList
          selected={selectedTab}
          tabClassName="text-lg"
          tabs={tabs.map((tab) => ({ ...tab, onClick: () => setSelectedTab(tab.key) }))}
        />
        <div className="flex gap-6 px-content">
          <div className="input text-lg font-medium !text-[var(--text-2)] w-full !bg-[var(--bg-1)]">
            <SearchFilledIcon className="h-full py-3 pr-3" />
            Rechercher
          </div>
          <div className="input text-lg font-medium">
            <TuneFilledIcon className="h-full py-3 pr-3" />
            Filtres
          </div>
          <ActionButton
            action={{
              label: 'Ajouter une transaction',
              linkOrActionOrMenu: () => showOverlay(<TeamTransactionCreateForm />),
              iconOrSwitch: <AddFilledIcon />,
              type: ActionType.Primary,
            }}
          />
        </div>
        {finances && projects ? (
          <div>
            {tabs.find((tab) => tab.key === selectedTab)?.element()}
            {/* <Dashboard
                columns={balanceSheetColumns}
                data={[
                  { transaction: "Subvention de l'année", amountExpected: 4000, amountPayed: 4000 },
                  ...projects.map((project) => ({
                    transaction: project.name,
                    key: project.slug,
                    amountExpected: project.expectedBudget,
                    amountPayed: sum(project.finances.map((finance) => finance.actorFinance?.amount ?? 0)),
                  })),
                ]}
              /> */}
          </div>
        ) : (
          <>
            <Skeleton height={24} width="full" />
            <FinanceDashboard finances={undefined} />
          </>
        )}
      </div>
    </div>
  );
}

const MemoizedTreasuryManageViewWrapper = memo(TreasuryManageViewWrapper);
export function TreasuryManageView() {
  const { teamManage } = useTeamManage();

  if (!teamManage) return null;
  return <MemoizedTreasuryManageViewWrapper teamManage={teamManage} />;
}
