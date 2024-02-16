import BreadcrumbLink from '../../_components/atoms/BreadcrumbLink';
import BaseView from '../../_components/templates/BaseView';

import TabList from '../../_components/molecules/List/TabList';
import { useState } from 'react';

import type { TeamVendorMinimal } from '../../../types/prisma/TeamVendor/team-vendor-minimal';
import type { TeamManageTransactions } from '../../../types/prisma/Team/team-manage-transactions';
import type { TransactionMinimal } from '../../../types/prisma/Transaction/transaction-minimal';

export type TeamVendorViewProps = {
  team: TeamManageTransactions;
  teamVendor: TeamVendorMinimal;
  transactions: TransactionMinimal[];
};

const DETAILS = 'details';
const TRANSACTIONS = 'transactions';

export default function TeamVendorView({ team, teamVendor, transactions }: TeamVendorViewProps) {
  const [tab, setTab] = useState(DETAILS);

  return (
    <BaseView header={teamVendor.name}>
      <div className="flex items-center justify-between">
        <BreadcrumbLink href={`/manage/team/${team.slug}/vendors`}>Fournisseurs / Clients</BreadcrumbLink>
        {/* <CTAButton action={`/manage/team/${team.slug}/transactions/new`}>Ajouter une transaction</CTAButton> */}
      </div>
      <TabList
        tabs={[
          { label: 'Détails', key: DETAILS, onClick: () => setTab(DETAILS) },
          { label: 'Transactions', key: TRANSACTIONS, onClick: () => setTab(TRANSACTIONS) },
        ]}
        selected={tab}
      />
      {tab === DETAILS && (
        <div className="grid-layout">
          <div className="card-list">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gray-200"></div>
              <div>
                <div className="text-1 font-semibold text-lg mb-2">{teamVendor.name}</div>
                {teamVendor.legalUnit &&
                  teamVendor.legalUnit.uniqueCodes.map((code) => (
                    <div key={code.codeType} className="text-2 text-sm">
                      {code.codeType} : {code.code}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {tab === TRANSACTIONS && (
        <div className="grid-layout">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="card-list">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gray-200"></div>
                <div>
                  <div className="text-1 font-semibold text-lg mb-2">{transaction.wording}</div>
                  <div className="text-2 text-sm">{transaction.amount}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </BaseView>
  );
}
