'use client';

import TransactionStepDetails from './TransactionStepDetails';
import TransactionStepEvent from './TransactionStepEvent';
import StepProjectChoice from '../StepProjectChoice';
import MultiStepFormView from '../../../_components/templates/MultiStepFormView';

import { CalendarPlus, ChartDonut, Receipt } from '@phosphor-icons/react';
import { z } from 'zod';

import type { TeamWithMoneyAccounts } from '../../../../types/prisma/Team/team-with-money-accounts';

export type CreateTransactionFormProps = { domain: string; team: TeamWithMoneyAccounts };
export default function CreateTransactionForm({ domain, team }: CreateTransactionFormProps) {
  return (
    <MultiStepFormView
      context={team}
      id={`${domain}/team/${team.slug}/events/new`}
      title="Créer un événement"
      onSubmit={(data) => console.log(data)}
      steps={[
        {
          icon: <ChartDonut />,
          title: 'Projet lié à la transaction',
          render: StepProjectChoice,
          zodSchema: z.object({}),
        },
        {
          icon: <CalendarPlus />,
          title: 'Événement lié à la transaction',
          render: TransactionStepEvent,
          zodSchema: z.object({}),
        },
        {
          icon: <Receipt />,
          title: 'Détails de la transaction',
          render: TransactionStepDetails,
          zodSchema: z.object({}),
        },
      ]}
    />
  );
}
