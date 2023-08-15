import TransactionCompanyStep from './TransactionCompanyStep';
import TransactionDetailsStep from './TransactionDetailsStep';
import TransactionPayedByStep from './TrasactionPayedByStep';
import TransactionReceiptStep from './TransactionReceiptStep';
import TransactionSummaryStep from './TransactionSummaryStep';
import BannerImage from '../../atoms/Image/BannerImage';
import ActionButton from '../../molecules/Button/ActionButton';
import MultiStepForm from '../../organisms/Form/MultiStepForm';
import DocumentInput from '../../molecules/Input/File/DocumentInput';
import ChoiceList from '../../molecules/List/ChoiceList';

import { useModal } from '../../../hooks/context/useModal';
import { mergeCache } from '../../../utils/apollo/merge-cache';

import { useGetProjectsSelectQuery, useInsertFinanceMutation } from '@okampus/shared/graphql';
import {
  AccountType,
  Buckets,
  EntityName,
  FinanceCategory,
  FinanceState,
  LocationType,
  PayedByType,
  PaymentMethod,
} from '@okampus/shared/enums';
import { ActionType } from '@okampus/shared/types';
import { extractPositiveNumber } from '@okampus/shared/utils';

import type { TeamManageInfo } from '../../../context/navigation';
import type { LegalUnitMinimalInfo } from '../../../types/features/legal-unit.info';

import type { GeocodeAddress } from '@okampus/shared/types';

export const transactionFormDefaultValues = {
  amount: '0',
  description: '',
  projectId: null as string | null,
  eventId: null as string | null,
  fileUploadId: null as string | null,
  attachments: [] as File[],
  isRevenue: false,
  isOnline: false,
  address: null as GeocodeAddress | null,
  addressQuery: '',
  legalUnit: null as LegalUnitMinimalInfo | null,
  legalUnitQuery: '',
  website: '',
  initiatedById: null as string | null,
  payedByType: PayedByType.Manual,
  payedAt: new Date().toISOString(),
  category: FinanceCategory.Errands,
  method: PaymentMethod.CreditCard,
};

export type TransactionFormProps = { teamManage: TeamManageInfo };
export default function TransactionForm({ teamManage }: TransactionFormProps) {
  const { closeModal } = useModal();

  const [insertFinance] = useInsertFinanceMutation();

  const { data } = useGetProjectsSelectQuery({ variables: { slug: teamManage.actor.slug } });
  const projects = data?.project;

  if (!projects) return null;

  return (
    <MultiStepForm
      defaultValues={transactionFormDefaultValues}
      steps={{
        initial: {
          header: 'Type de transaction',
          onEnter: ({ values, setValues }) => setValues({ ...values, projectId: null }),
          content: ({ values, setValues, goToStep }) => (
            <ChoiceList
              items={[{ item: { label: 'Recette', value: true } }, { item: { label: 'Dépense', value: false } }]}
              onClick={(isRevenue) => {
                setValues({ ...values, isRevenue });
                goToStep('project');
              }}
            />
          ),
        },
        project: {
          header: 'Projet lié',
          onEnter: ({ values, setValues }) => setValues({ ...values, projectId: null }),
          content: ({ values, setValues, goToStep }) => (
            <ChoiceList
              items={[
                { item: { label: 'Dépenses générales', value: null } },
                ...projects.map((project) => ({
                  item: { label: project.name, value: project.id as string },
                  prefix: <BannerImage name={project.name} src={project.banner?.url} className="h-14 rounded-lg" />,
                })),
              ]}
              onClick={(id) => {
                if (!id) {
                  goToStep('event');
                  return;
                }

                const project = projects.find((project) => project.id === id);
                if (!project) return;
                setValues({ ...values, projectId: project.id as string });
                goToStep('event');
              }}
            />
          ),
        },
        event: {
          header: 'Événement lié',
          content: ({ values, setValues, goToStep }) => {
            const events =
              projects.find((project) => project.id === values.projectId)?.eventOrganizes.map(({ event }) => event) ??
              [];
            return (
              <ChoiceList
                items={[
                  { item: { label: 'Dépenses hors événement', value: null } },
                  ...events.map((event) => ({
                    item: { label: event?.name, value: event.id as string },
                    prefix: <BannerImage name={event?.name} src={event.banner?.url} className="h-14 rounded-lg" />,
                  })),
                ]}
                onClick={(id) => {
                  if (!id) {
                    goToStep('online');
                    return;
                  }

                  const event = projects
                    .find((project) => project.id === values.projectId)
                    ?.eventOrganizes.find(({ event }) => event.id === id)?.event;
                  if (!event) return;
                  setValues({ ...values, eventId: id });
                  goToStep('online');
                }}
              />
            );
          },
        },
        online: {
          header: ({ values }) => (values.isRevenue ? 'Recette reçue en ligne ?' : 'Dépense faite en ligne ?'),
          content: ({ values, setValues, goToStep }) => {
            return (
              <ChoiceList
                items={[
                  { item: { label: 'En ligne', value: true } },
                  { item: { label: 'En personne / par chèque', value: false } },
                ]}
                onClick={(isOnline) => {
                  setValues({ ...values, isOnline });
                  goToStep('receipt');
                }}
              />
            );
          },
        },
        // context: {
        //   header: 'Contexte de la transaction',
        //   content: ({ values, setValues, goToStep }) => {
        //     const events =
        //       projects.find((project) => project.id === values.projectId)?.eventOrganizes.map(({ event }) => event) ?? [];
        //     return (
        //       <ChoiceList
        //         items={[
        //           { item: { label: 'Dépenses hors événement', value: null } },
        //           ...events.map((event) => ({
        //             item: { label: event?.name, value: event.id as string },
        //             prefix: <BannerImage name={event?.name} src={event.banner?.url} className="h-14 rounded-lg" />,
        //           })),
        //         ]}
        //         onClick={(id) => {
        //           if (!id) {
        //             goToStep('receipt');
        //             return;
        //           }

        //           const event = projects
        //             .find((project) => project.id === values.projectId)
        //             ?.eventOrganizes.find(({ event }) => event.id === id)?.event;
        //           if (!event) return;
        //           setValues({ ...values, eventId: id });
        //           goToStep('receipt');
        //         }}
        //       />
        //     );
        //   },
        // },
        receipt: {
          header: 'Justificatif de paiement',
          onEnter: ({ values, setValues }) => setValues({ ...values, fileUploadId: null }),
          content: ({ values, setValues, goToStep }) => (
            <DocumentInput
              uploadContext={{ bucket: Buckets.Receipts, entityName: EntityName.Finance }}
              onChange={(id, attachment) => {
                if (attachment) setValues({ ...values, fileUploadId: id, attachments: [attachment] });
                else setValues({ ...values, fileUploadId: id, attachments: [] });
                goToStep('details');
              }}
            />
          ),
          footer: ({ goToStep }) => (
            <ActionButton
              action={{
                type: ActionType.Action,
                label: "Je n'ai pas de justificatif de paiement",
                linkOrActionOrMenu: () => goToStep('detailsNoReceipt'),
              }}
            />
          ),
        },
        details: {
          header: 'Détails de la transaction',
          content: ({ values, setValues }) => (
            <TransactionReceiptStep teamManage={teamManage} values={values} setValues={setValues} />
          ),
          footer: ({ goToStep }) => (
            <ActionButton
              action={{ type: ActionType.Success, label: 'Continuer', linkOrActionOrMenu: () => goToStep('company') }}
            />
          ),
        },
        detailsNoReceipt: {
          header: 'Détails de la transaction',
          content: ({ values, setValues }) => <TransactionDetailsStep values={values} setValues={setValues} />,
          footer: ({ goToStep }) => (
            <ActionButton
              action={{ type: ActionType.Success, label: 'Continuer', linkOrActionOrMenu: () => goToStep('company') }}
            />
          ),
        },
        company: {
          header: 'Entreprise',
          content: ({ values, setValues }) => <TransactionCompanyStep values={values} setValues={setValues} />,
          footer: ({ goToStep }) => (
            <ActionButton
              action={{ type: ActionType.Success, label: 'Continuer', linkOrActionOrMenu: () => goToStep('payedBy') }}
            />
          ),
        },
        payedBy: {
          header: 'Responsable de la transaction',
          content: ({ values, setValues }) => (
            <TransactionPayedByStep teamManage={teamManage} values={values} setValues={setValues} />
          ),
          footer: ({ goToStep }) => (
            <ActionButton
              action={{ type: ActionType.Success, label: 'Continuer', linkOrActionOrMenu: () => goToStep('summary') }}
            />
          ),
        },
        summary: {
          header: 'Récapitulatif',
          content: ({ values, setValues }) => (
            <TransactionSummaryStep teamManage={teamManage} values={values} setValues={setValues} />
          ),
          footer: ({ values, onSubmit }) => (
            <ActionButton
              action={{
                type: ActionType.Success,
                label: 'Créer la transaction',
                linkOrActionOrMenu: () => onSubmit(values),
              }}
            />
          ),
        },
      }}
      onSubmit={(data) => {
        if (teamManage) {
          const receivedById = data.isRevenue ? teamManage.actor.id : data.legalUnit?.actor.id;
          const payedById = data.isRevenue ? data.legalUnit?.actor.id : teamManage.actor.id;
          const amount = extractPositiveNumber(data.amount) || 0;

          insertFinance({
            variables: {
              object: {
                amount: data.isRevenue ? amount : -amount,
                description: data.description,
                category: data.category,
                state: FinanceState.Completed,
                method: data.method,
                payedAt: data.payedAt,
                payedById,
                receivedById,
                payedByType: data.payedByType,
                initiatedById: data.initiatedById,
                ...(data.fileUploadId && { financeAttachments: { data: [{ fileUploadId: data.fileUploadId }] } }),
                ...(data.website && {
                  location: {
                    data: { onlineLink: data.website, type: LocationType.Online, actorId: teamManage.actor.id },
                  },
                }),
                accountId: teamManage.accounts.find((account) => account.type === AccountType.Primary)?.id,
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
                teamId: teamManage.id,
              },
            },
            onCompleted: ({ insertFinanceOne: data }) => {
              const id = teamManage.id as string;
              mergeCache({ __typename: 'Team', id }, { fieldName: 'finances', fragmentOn: 'Finance', data });
              closeModal();
            },
          });
        }
      }}
    />
  );
}
