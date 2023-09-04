'use client';

import TransactionCompanyStep from './TransactionCompanyStep';
import TransactionDetailsStep from './TransactionDetailsStep';
import TransactionPayedByStep from './TransactionPayedByStep';
import TransactionReceiptStep from './TransactionReceiptStep';
import TransactionSummaryStep from './TransactionSummaryStep';
import BannerImage from '../../../atoms/Image/BannerImage';
import ActionButton from '../../../molecules/Button/ActionButton';
import MultiStepForm from '../../../organisms/Form/MultiStepForm';
import DocumentInput from '../../../molecules/Input/File/DocumentInput';
import ChoiceList from '../../../molecules/List/ChoiceList';

import { useModal } from '../../../../hooks/context/useModal';
import { mergeCache } from '../../../../utils/apollo/merge-cache';

import {
  BankAccountType,
  BucketNames,
  EntityName,
  TransactionCategory,
  TransactionState,
  LocationType,
  PayedByType,
  PaymentMethod,
} from '@okampus/shared/enums';
import { useInsertTransactionMutation } from '@okampus/shared/graphql';
import { ActionType, geocodeAddressSchema } from '@okampus/shared/types';
import { parsePositiveNumber } from '@okampus/shared/utils';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import type { FormStepContext } from '../../../organisms/Form/MultiStepForm';
import type { LegalUnitMinimalInfo } from '../../../../types/features/legal-unit.info';
import type { TeamManageInfo } from '../../../../utils/apollo/fragments';

const transactionFormSchema = z.object({
  amount: z.string().refine((value) => parsePositiveNumber(value), {
    message: 'Le montant doit être supérieur à 0.',
  }),
  description: z.string().max(10_000, { message: 'La description ne peut pas dépasser 10 000 caractères.' }),
  projectId: z.string().nullable(),
  eventId: z.string().nullable(),
  fileUploadId: z.string().nullable(),
  attachments: z.array(z.instanceof(File)),
  isRevenue: z.boolean(),
  isOnline: z.boolean(),
  address: geocodeAddressSchema.nullable(),
  addressQuery: z.string(),
  legalUnit: z.any().nullable() as z.ZodType<LegalUnitMinimalInfo | null>,
  legalUnitQuery: z.string(),
  website: z.string().url({ message: 'Le site web doit être une URL valide.' }),
  initiatedById: z.string().nullable(),
  payedByType: z.nativeEnum(PayedByType),
  payedAt: z.date(),
  category: z.nativeEnum(TransactionCategory),
  method: z.nativeEnum(PaymentMethod),
});

type TransactionFormSchema = z.infer<typeof transactionFormSchema>;

const transactionFormDefaultValues: TransactionFormSchema = {
  amount: '0',
  description: '',
  projectId: null,
  eventId: null,
  fileUploadId: null,
  attachments: [],
  isRevenue: false,
  isOnline: false,
  address: null,
  addressQuery: '',
  legalUnit: null,
  legalUnitQuery: '',
  website: '',
  initiatedById: null,
  payedByType: PayedByType.Manual,
  payedAt: new Date(),
  category: TransactionCategory.Errands,
  method: PaymentMethod.CreditCard,
};

export type TransactionFormStepProps = FormStepContext<TransactionFormSchema, { teamManage: TeamManageInfo }>;

function TransactionTypeChoiceStep({ methods: { formMethods, goToStep } }: TransactionFormStepProps) {
  // const { setValue } = useFormContext<typeof transactionFormDefaultValues>();

  return (
    <ChoiceList
      items={[{ item: { label: 'Recette', value: true } }, { item: { label: 'Dépense', value: false } }]}
      onClick={(isRevenue) => {
        formMethods.setValue('isRevenue', isRevenue);
        goToStep('online');
      }}
    />
  );
}

function TransactionOnlineChoiceStep({ methods: { formMethods, goToStep } }: TransactionFormStepProps) {
  // const { setValue } = useFormContext<typeof transactionFormDefaultValues>();

  return (
    <ChoiceList
      items={[
        { item: { label: 'En ligne', value: true } },
        { item: { label: 'En personne / par chèque', value: false } },
      ]}
      onClick={(isOnline) => {
        formMethods.setValue('isOnline', isOnline);
        goToStep('receipt');
      }}
    />
  );
}

function TransactionProjectChoiceStep({
  methods: { formMethods, goToStep },
  context: { teamManage },
}: TransactionFormStepProps) {
  // const { setValue } = useFormContext<typeof transactionFormDefaultValues>();

  return (
    teamManage.projects && (
      <ChoiceList
        items={[
          { item: { label: 'Événément hors-projet', value: null } },
          ...teamManage.projects.map((project) => ({
            item: { label: project.name, value: project.id },
            prefix: <BannerImage name={project.name} src={project.banner?.url} className="h-14 rounded-xl" />,
          })),
        ]}
        onClick={(id) => {
          if (!id) {
            goToStep('details');
            return;
          }

          const project = teamManage.projects.find((project) => project.id === id);
          if (!project) return;
          formMethods.setValue('projectId', project.id);
          goToStep('details');
        }}
      />
    )
  );
}

function TransactionEventChoiceStep({
  methods: { formMethods, goToStep },
  context: { teamManage },
}: TransactionFormStepProps) {
  // const { watch, setValue } = useFormContext<TransactionFormSchema>();
  const projectId = formMethods.watch('projectId');

  const events =
    teamManage.projects.find((project) => project.id === projectId)?.eventOrganizes.map(({ event }) => event) ?? [];
  return (
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
          goToStep('online');
          return;
        }

        const event = teamManage.projects
          .find((project) => project.id === projectId)
          ?.eventOrganizes.find(({ event }) => event.id === id)?.event;
        if (!event) return;

        formMethods.setValue('eventId', id);
        goToStep('online');
      }}
    />
  );
}

function TransactionReceiptInputStep({ methods: { formMethods, goToStep } }: TransactionFormStepProps) {
  // const { setValue } = useFormContext<typeof transactionFormDefaultValues>();

  return (
    <DocumentInput
      uploadContext={{ bucket: BucketNames.Receipts, entityName: EntityName.Transaction }}
      onChange={(id, attachment) => {
        if (attachment) {
          formMethods.setValue('fileUploadId', id);
          formMethods.setValue('attachments', [attachment]);
        } else {
          formMethods.setValue('fileUploadId', null);
          formMethods.setValue('attachments', []);
        }
        goToStep('details');
      }}
    />
  );
}

function TransactionReceiptInputSkip({ methods: { goToStep } }: TransactionFormStepProps) {
  return (
    <ActionButton
      action={{
        type: ActionType.Action,
        label: "Je n'ai pas de justificatif",
        linkOrActionOrMenu: () => goToStep('detailsNoReceipt'),
      }}
    />
  );
}

export type TransactionFormProps = { teamManage: TeamManageInfo };
export default function TransactionForm({ teamManage }: TransactionFormProps) {
  const { closeModal } = useModal();
  const [insertTransaction] = useInsertTransactionMutation();

  return (
    <MultiStepForm
      context={{ teamManage }}
      defaultValues={transactionFormDefaultValues}
      resolver={zodResolver(transactionFormSchema)}
      steps={{
        initial: {
          header: 'Type de transaction',
          onEnter: ({ methods: { formMethods } }) => formMethods.setValue('projectId', null),
          content: TransactionOnlineChoiceStep,
        },
        online: {
          header: ({ methods: { formMethods } }) =>
            formMethods.getValues().isRevenue ? 'Recette reçue en ligne ?' : 'Dépense faite en ligne ?',
          content: TransactionOnlineChoiceStep,
        },
        project: {
          header: 'Projet lié',
          onEnter: ({ methods: { formMethods } }) => formMethods.setValue('projectId', null),
          content: TransactionProjectChoiceStep,
        },
        event: {
          header: 'Événement lié',
          content: TransactionEventChoiceStep,
        },
        receipt: {
          header: 'Justificatif de paiement',
          onEnter: ({ methods: { formMethods } }) => formMethods.setValue('fileUploadId', null),
          content: TransactionReceiptInputStep,
          footer: TransactionReceiptInputSkip,
        },
        details: {
          nextStep: 'company',
          header: 'Détails de la transaction',
          content: TransactionReceiptStep,
          validateFields: ['amount', 'payedAt', 'description'],
        },
        detailsNoReceipt: {
          nextStep: 'company',
          header: 'Détails de la transaction',
          content: TransactionDetailsStep,
          validateFields: ['amount', 'payedAt', 'description'],
        },
        company: {
          header: 'Entreprise',
          content: TransactionCompanyStep,
          nextStep: 'payedBy',
          validateFields: ['legalUnit'],
        },
        payedBy: {
          header: 'Responsable de la transaction',
          content: TransactionPayedByStep,
          nextStep: 'summary',
          validateFields: ['payedByType'],
        },
        summary: {
          header: 'Récapitulatif',
          content: TransactionSummaryStep,
          submit: 'Créer la transaction',
        },
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
                state: TransactionState.Completed,
                method: data.method,
                payedAt: data.payedAt.toISOString(),
                payedById,
                receivedById,
                payedByType: data.payedByType,
                initiatedById: data.initiatedById,
                ...(data.fileUploadId && { transactionAttachments: { data: [{ fileUploadId: data.fileUploadId }] } }),
                ...(data.website && {
                  location: {
                    data: { link: data.website, type: LocationType.Online, actorId: teamManage.actor.id },
                  },
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
