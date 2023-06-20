// const fields = [
//   {
//     name: 'name',
//     type: ControlType.Text,
//     label: 'Nom de la transaction',
//     placeholder: 'Nom de la transaction',
//     isRequired: true,
//   },
//   {
//     name: 'payedById',
//     type: ControlType.Select,
//     label: 'Payé par',
//     options: teamManage.teamMembers.map(({ user }) => ({
//       label: (
//         <div className="flex items-center gap-2">
//           <AvatarImage
//             name={user.individual?.actor?.name}
//             size={7}
//             rounded={AVATAR_USER_ROUNDED}
//           />
//           <div>{user.individual?.actor?.name}</div>
//         </div>
//         // <LabeledUser
//         //   name={user.individual?.actor?.name ??}
//         //   // role={teamMemberRoles[0]?.role?.name}
//         // />
//       ),
//       value: user.individual?.actor?.id as string,
//     })),
//     isRequired: true,
//   },
//   {
//     name: 'payedAt',
//     type: ControlType.DatetimeLocal,
//     label: 'Date de paiement',
//     isRequired: true,
//   },
//   {
//     name: 'amount',
//     type: ControlType.Number,
//     label: 'Montant (en €)',
//     isRequired: true,
//   },
//   {
//     name: 'method',
//     type: ControlType.Select,
//     label: 'Méthode de paiement',
//     options: Object.entries(PaymentMethod).map(([value, label]) => ({ label, value })),
//     isRequired: true,
//   },
//   {
//     name: 'category',
//     type: ControlType.Select,
//     label: 'Catégorie de dépense',
//     options: Object.entries(FinanceCategory).map(([value, label]) => ({ label, value })),
//     placeholder: 'Catégorie de dépense',
//     isRequired: true,
//   },
//   {
//     name: 'eventId',
//     type: ControlType.Select,
//     label: 'Événement lié',
//     options:
//       projects?.flatMap((project) =>
//         project.eventsAggregate.nodes.map((event) => ({
//           label: event?.name ?? '',
//           value: event.id as string,
//         }))
//       ) ?? [],
//   },
// ] as const;

import { teamTransactionCreateDefaultValues } from './TeamTransactionCreateFormStep/default';
import { receiptUploadFormStep } from './TeamTransactionCreateFormStep/ReceiptUploadFormStep';
import { TeamProjectCreateForm } from './TeamProjectCreateForm';
import { FinanceState } from '@okampus/shared/enums';
import { useTypedQuery, projectBaseInfo, insertFinanceMutation } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';
import { BannerImage } from '@okampus/ui/atoms';
import { NavigationContext, useTeamManage } from '@okampus/ui/hooks';
import { ActionButton, ChoiceList } from '@okampus/ui/molecules';
import { MultiStepForm } from '@okampus/ui/organisms';
import { mergeCache } from '#site/app/utils/apollo/merge-cache';
import { useMutation } from '@apollo/client';
import { useContext } from 'react';

export function TeamTransactionCreateForm() {
  const { showOverlay, hideOverlay } = useContext(NavigationContext);
  const { teamManage } = useTeamManage();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [insertFinance] = useMutation(insertFinanceMutation);

  const { data } = useTypedQuery({ project: [{ where: { team: { id: { _eq: teamManage?.id } } } }, projectBaseInfo] });
  const projects = data?.project;

  if (!projects) return null;

  return (
    <MultiStepForm
      defaultValues={teamTransactionCreateDefaultValues}
      initialStep={{
        header: 'À quel projet correspond cette transaction ?',
        onEnter: ({ values, setValues }) => setValues({ ...values, projectId: null }),
        content: ({ values, setValues, goToNextStep }) => (
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
                goToNextStep(1);
                return;
              }

              const project = projects.find((project) => project.id === id);
              if (!project) return;
              setValues({ ...values, projectId: project.id as string });
              goToNextStep(0);
            }}
          />
        ),
        footer: () => (
          <div className="flex flex-col items-center gap-3">
            <div className="title-sm opacity-90 tracking-tight">Aucun projet correspondant ?</div>
            <ActionButton
              className="w-full"
              action={{
                type: ActionType.Action,
                label: 'Créer un nouveau projet',
                linkOrActionOrMenu: () => showOverlay(<TeamProjectCreateForm />),
              }}
            />
          </div>
        ),
        nextSteps: [
          {
            header: 'Événement lié',
            content: ({ values, setValues, goToNextStep }) => {
              const events = projects.find((project) => project.id === values.projectId)?.eventsAggregate.nodes ?? [];
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
                      goToNextStep(0);
                      return;
                    }

                    const event = projects
                      .find((project) => project.id === values.projectId)
                      ?.eventsAggregate.nodes.find((event) => event.id === id);
                    if (!event) return;
                    setValues({ ...values, eventId: id });
                    goToNextStep(0);
                  }}
                />
              );
            },
            nextSteps: [receiptUploadFormStep],
          },
          {
            header: 'Contexte de la transaction',
            content: ({ values, setValues, goToNextStep }) => {
              const events = projects.find((project) => project.id === values.projectId)?.eventsAggregate.nodes ?? [];
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
                      goToNextStep(0);
                      return;
                    }

                    const event = projects
                      .find((project) => project.id === values.projectId)
                      ?.eventsAggregate.nodes.find((event) => event.id === id);
                    if (!event) return;
                    setValues({ ...values, eventId: id });
                    goToNextStep(0);
                  }}
                />
              );
            },
            nextSteps: [receiptUploadFormStep],
          },
        ],
      }}
      onSubmit={({
        name,
        amount,
        description,
        category,
        method,
        payedAt,
        payedById,
        payedByType,
        addressItem,
        addressType,
        fileUploadId,
        projectId,
        eventId,
      }) => {
        console.log(addressItem);
        if (teamManage) {
          insertFinance({
            variables: {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              object: {
                name,
                amount: -amount,
                description,
                category,
                state: FinanceState.Completed,
                method,
                payedAt,
                payedById,
                payedByType,
                ...(addressItem?.value && {
                  address: {
                    data: {
                      actorId: teamManage.actor?.id as string,
                      name: addressItem.value.name,
                      state: addressItem.value.state,
                      street: addressItem.value.street,
                      city: addressItem.value.city,
                      zip: addressItem.value.zip,
                      country: 'FR',
                      latitude: addressItem.value.coordinates.latitude,
                      longitude: addressItem.value.coordinates.longitude,
                      public: true,
                    },
                  },
                }),
                addressType,
                receiptId: fileUploadId,
                eventId,
                projectId,
                teamId: teamManage.id,
              },
            },
            onCompleted: ({ insertFinanceOne: data }) => {
              const id = teamManage.id as string;
              mergeCache({ __typename: 'Team', id }, { fieldName: 'finances', fragmentOn: 'Finance', data });
              hideOverlay();
            },
          });
        }
      }}
    />
  );
}
