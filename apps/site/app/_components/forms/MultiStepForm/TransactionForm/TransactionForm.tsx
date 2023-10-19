'use client';

import TransactionCompanyStep from './TransactionCompanyStep';
import TransactionPayedByStep from './TransactionPayedByStep';
import TransactionSummaryStep from './TransactionSummaryStep';
import BannerImage from '../../../atoms/Image/BannerImage';
import ChoiceList from '../../../molecules/List/ChoiceList';
import MultiStepForm from '../../../organisms/Form/MultiStepForm';
import FormStep from '../../../organisms/Form/FormStep';

import { useModal } from '../../../../_hooks/context/useModal';
import { mergeCache } from '../../../../../utils/apollo/merge-cache';

import { useInsertTransactionMutation } from '@okampus/shared/graphql';
import { geocodeAddressSchema } from '@okampus/shared/types';
import { parsePositiveNumber } from '@okampus/shared/utils';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  BankAccountType,
  TransactionType,
  ApprovalState,
  LocationType,
  ProcessedByType,
  PaymentMethod,
} from '@prisma/client';
import * as z from 'zod';

import type { FormStepContext } from '../../../organisms/Form/MultiStepForm';
import type { LegalUnitMinimalInfo } from '../../../../../types/features/legal-unit.info';
import type { TeamManageInfo } from '../../../../../utils/apollo/fragments';

const transactionFormSchema = z.object({
  amount: z.string().refine((value) => parsePositiveNumber(value), {
    message: 'Le montant doit être supérieur à 0.',
  }),
  description: z.string().max(10_000, { message: 'La description ne peut pas dépasser 10 000 caractères.' }),
  projectId: z.string().nullable(),
  eventId: z.string().nullable(),
  receipt: z.object({ fileUploadId: z.string(), key: z.string() }).nullable(),
  attachments: z.array(z.custom<File>()),
  isRevenue: z.boolean(),
  isOnline: z.boolean(),
  address: geocodeAddressSchema.nullable(),
  addressQuery: z.string(),
  legalUnit: z.any().nullable() as z.ZodType<LegalUnitMinimalInfo | null>,
  legalUnitQuery: z.string(),
  website: z.string().url({ message: 'Le site web doit être une URL valide.' }),
  processedById: z.string().nullable(),
  processedByType: z.nativeEnum(ProcessedByType),
  payedAt: z.date(),
  category: z.nativeEnum(TransactionType),
  method: z.nativeEnum(PaymentMethod),
});

type TransactionFormSchema = z.infer<typeof transactionFormSchema>;

const transactionFormDefaultValues: TransactionFormSchema = {
  amount: '0',
  description: '',
  projectId: null,
  eventId: null,
  receipt: null,
  attachments: [],
  isRevenue: false,
  isOnline: false,
  address: null,
  addressQuery: '',
  legalUnit: null,
  legalUnitQuery: '',
  website: '',
  processedById: null,
  processedByType: ProcessedByType.Manual,
  payedAt: new Date(),
  category: TransactionType.Other,
  method: PaymentMethod.CreditCard,
};

export type TransactionFormStepProps = FormStepContext<TransactionFormSchema, { teamManage: TeamManageInfo }>;

function TransactionTypeChoiceStep(context: TransactionFormStepProps) {
  return (
    <FormStep context={context} header="Type de transaction">
      <ChoiceList
        items={[{ item: { label: 'Recette', value: true } }, { item: { label: 'Dépense', value: false } }]}
        onClick={(isRevenue) => {
          context.formMethods.setValue('isRevenue', isRevenue);
          context.goToStep('online');
        }}
      />
    </FormStep>
  );
}

function TransactionOnlineChoiceStep(context: TransactionFormStepProps) {
  const header = context.formMethods.getValues().isRevenue ? 'Recette reçue en ligne ?' : 'Dépense faite en ligne ?';
  return (
    <FormStep context={context} header={header}>
      <ChoiceList
        items={[
          { item: { label: 'En ligne', value: true } },
          { item: { label: 'En personne / par chèque', value: false } },
        ]}
        onClick={(isOnline) => {
          context.formMethods.setValue('isOnline', isOnline);
          context.goToStep('receipt');
        }}
      />
    </FormStep>
  );
}

function TransactionProjectChoiceStep(context: TransactionFormStepProps) {
  context.formMethods.setValue('projectId', null);

  return (
    <FormStep context={context} header="Projet lié">
      <ChoiceList
        items={[
          { item: { label: 'Nouveau projet', value: null } },
          ...context.data.teamManage.projects.map((project) => ({
            item: { label: project.name, value: project.id },
            prefix: <BannerImage name={project.name} src={project.banner?.url} className="h-14 rounded-xl" />,
          })),
        ]}
        onClick={(id) => {
          if (!id) {
            context.goToStep('details');
            return;
          }

          const project = context.data.teamManage.projects.find((project) => project.id === id);
          if (!project) return;
          context.formMethods.setValue('projectId', project.id);
          context.goToStep('details');
        }}
      />
    </FormStep>
  );
}

function TransactionEventChoiceStep(context: TransactionFormStepProps) {
  const projectId = context.formMethods.watch('projectId');
  const events =
    context.data.teamManage.projects.find(({ id }) => id === projectId)?.eventOrganizes.map(({ event }) => event) ?? [];

  return (
    // TODO: should also allow for secondary label
    <FormStep context={context} header="Événement lié">
      <ChoiceList
        items={[
          { item: { label: 'Dépenses hors événement', value: null } },
          ...events.map((event) => ({
            item: { label: event?.name, value: event.id },
            prefix: <BannerImage name={event?.name} src={event.banner?.url} className="h-14 rounded-xl" />,
          })),
        ]}
        onClick={(id) => {
          if (!id) {
            context.goToStep('online');
            return;
          }

          const event = context.data.teamManage.projects
            .find((project) => project.id === projectId)
            ?.eventOrganizes.find(({ event }) => event.id === id)?.event;
          if (!event) return;

          context.formMethods.setValue('eventId', id);
          context.goToStep('online');
        }}
      />
    </FormStep>
  );
}

export type TransactionFormProps = { teamManage: TeamManageInfo };
export default function TransactionForm({ teamManage }: TransactionFormProps) {
  const { closeModal } = useModal();
  const [insertTransaction] = useInsertTransactionMutation();

  return (
    <MultiStepForm
      data={{ teamManage }}
      defaultValues={transactionFormDefaultValues}
      resolver={zodResolver(transactionFormSchema)}
      steps={{
        initial: TransactionTypeChoiceStep,
        online: TransactionOnlineChoiceStep,
        project: TransactionProjectChoiceStep,
        event: TransactionEventChoiceStep,
        company: TransactionCompanyStep,
        payedBy: TransactionPayedByStep,
        summary: TransactionSummaryStep,
      }}
      onSubmit={(data) => {
        if (teamManage) {
          const receivedById = data.isRevenue ? teamManage.actor.id : data.legalUnit?.actor.id;
          const payedById = data.isRevenue ? data.legalUnit?.actor.id : teamManage.actor.id;
          const amount = parsePositiveNumber(data.amount) || 0;

          insertTransaction({
            variables: {
              object: {
                amount: data.isRevenue ? amount : -amount,
                description: data.description,
                category: data.category,
                state: ApprovalState.Approved,
                method: data.method,
                payedAt: data.payedAt.toISOString(),
                payedById: payedById?.toString(),
                receivedById: receivedById?.toString(),
                processedByType: data.processedByType,
                processedById: data.processedById,
                ...(data.receipt && {
                  transactionAttachments: { data: [{ fileUploadId: data.receipt.fileUploadId }] },
                }),
                ...(data.website && {
                  location: { data: { link: data.website, type: LocationType.Online, actorId: teamManage.actor.id } },
                }),
                bankAccountId: teamManage.bankAccounts.find(
                  (bankAccount) => bankAccount.type === BankAccountType.Primary,
                )?.id,
                // ...(data.address && {
                //   address: {
                //     data: {
                //       actorId: teamManage.actor?.id as string,
                //       name: data.address.name,
                //       state: data.address.state,
                //       street: data.address.street,
                //       city: data.address.city,
                //       zip: data.address.zip,
                //       country: 'FR',
                //       latitude: data.address.latitude,
                //       longitude: data.address.longitude,
                //     },
                //   },
                // }),
                isOnline: data.isOnline,
                eventId: data.eventId,
                projectId: data.projectId,
              },
            },
            onCompleted: ({ insertTransactionOne: data }) => {
              mergeCache(
                { __typename: 'Team', id: teamManage.id },
                { fieldName: 'transactions', fragmentOn: 'Transaction', data },
              );
              closeModal();
            },
          });
        }
      }}
    />
  );
}
