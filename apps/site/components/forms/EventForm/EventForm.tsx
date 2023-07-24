import EventDetailsStep from './EventDetailsStep';
import EventPresentationStep from './EventPresentationStep';
import EventSupervisorsStep from './EventSupervisorsStep';
import EventSummaryStep from './EventSummaryStep';
import BannerImage from '../../atoms/Image/BannerImage';
import ActionButton from '../../molecules/Button/ActionButton';
import MultiStepForm from '../../molecules/Form/MultiStepForm';
import ChoiceList from '../../molecules/List/ChoiceList';

import { useMe } from '../../../context/navigation';
import { useModal } from '../../../hooks/context/useModal';
import { mergeCache } from '../../../utils/apollo/merge-cache';

import { LocationType } from '@okampus/shared/enums';
import { useTypedQuery, projectBaseInfo, insertEventMutation } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';
import { isNotNull, randomId, toSlug } from '@okampus/shared/utils';

import { useMutation } from '@apollo/client';

import type { TeamManageInfo } from '@okampus/shared/graphql';
import type { FormSchema, GeocodeAddress, Submission } from '@okampus/shared/types';

export const eventFormDefaultValues = {
  isOnline: false as boolean,
  projectId: null as string | null,
  description: '' as string,
  eventId: null as string | null,
  supervisorIds: [null] as (string | null)[],
  name: '',
  startDate: new Date(),
  startTime: '00:00',
  endDate: new Date(),
  endTime: '00:00',
  bannerFileUploadId: null as string | null,
  address: null as GeocodeAddress | null,
  addressQuery: '' as string,
  website: '' as string,
  locationDetails: '' as string,
  formSubmission: null as Submission<FormSchema> | null,
};

export type EventFormProps = { teamManage: TeamManageInfo };
export default function EventForm({ teamManage }: EventFormProps) {
  const { closeModal } = useModal();
  const me = useMe();

  // @ts-ignore
  const [insertEvent] = useMutation(insertEventMutation);

  const { data } = useTypedQuery({ project: [{ where: { team: { id: { _eq: teamManage?.id } } } }, projectBaseInfo] });
  const projects = data?.project;

  if (!projects || !me?.user.tenant) return null;

  return (
    <MultiStepForm
      defaultValues={eventFormDefaultValues}
      steps={{
        initial: {
          header: 'Événement en ligne ?',
          content: ({ values, setValues, goToStep }) => {
            return (
              <ChoiceList
                items={[{ item: { label: 'En ligne', value: true } }, { item: { label: 'En personne', value: false } }]}
                onClick={(isOnline) => {
                  setValues({ ...values, isOnline });
                  goToStep('project');
                }}
              />
            );
          },
        },
        project: {
          header: 'Projet lié',
          onEnter: ({ values, setValues }) => setValues({ ...values, projectId: null }),
          content: ({ values, setValues, goToStep }) => (
            <ChoiceList
              items={[
                { item: { label: 'Événément hors-projet', value: null } },
                ...projects.map((project) => ({
                  item: { label: project.name, value: project.id as string },
                  prefix: <BannerImage name={project.name} src={project.banner?.url} className="h-14 rounded-lg" />,
                })),
              ]}
              onClick={(id) => {
                if (!id) {
                  goToStep('details');
                  return;
                }

                const project = projects.find((project) => project.id === id);
                if (!project) return;
                setValues({ ...values, projectId: project.id as string });
                goToStep('details');
              }}
            />
          ),
        },
        details: {
          header: "Détails de l'événement",
          content: ({ values, setValues }) => <EventDetailsStep values={values} setValues={setValues} />,
          footer: ({ goToStep }) => (
            <ActionButton
              action={{
                type: ActionType.Success,
                label: 'Continuer',
                linkOrActionOrMenu: () => goToStep('presentation'),
              }}
            />
          ),
        },
        presentation: {
          header: "Présentation de l'événement",
          content: ({ values, setValues }) => <EventPresentationStep values={values} setValues={setValues} />,
          footer: ({ goToStep }) => (
            <ActionButton
              action={{
                type: ActionType.Success,
                label: 'Continuer',
                linkOrActionOrMenu: () => goToStep('supervisors'),
              }}
            />
          ),
        },
        supervisors: {
          header: "Responsables de l'événement",
          content: ({ values, setValues }) => (
            <EventSupervisorsStep teamManage={teamManage} values={values} setValues={setValues} />
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
            <EventSummaryStep teamManage={teamManage} values={values} setValues={setValues} />
          ),
          footer: ({ values, onSubmit }) => (
            <ActionButton
              action={{
                type: ActionType.Success,
                label: "Créer l'événement",
                linkOrActionOrMenu: () => onSubmit(values),
              }}
            />
          ),
        },
      }}
      onSubmit={(data) => {
        if (teamManage) {
          const location = data.isOnline
            ? { type: LocationType.Online, onlineLink: data.website }
            : { type: LocationType.Address, address: data.address };

          const start = new Date(`${data.startDate.toISOString().split('T')[0]}T${data.startTime}`);
          const end = new Date(`${data.endDate.toISOString().split('T')[0]}T${data.endTime}`);

          const variables = {
            object: {
              eventOrganizes: {
                data: [
                  {
                    teamId: teamManage.id,
                    projectId: data.projectId,
                    supervisors: {
                      data: data.supervisorIds.filter(isNotNull).map((id) => ({ teamMemberId: id })),
                    },
                  },
                ],
              },
              ...(data.formSubmission
                ? {
                    eventApprovalSubmission: {
                      data: {
                        formId: me.user.tenant.eventValidationForm?.id,
                        formSubmission: { data: { submission: data.formSubmission } },
                      },
                    },
                  }
                : {}),
              start,
              nextEventApprovalStepId: me.user.tenant.eventApprovalSteps[0].id,
              end,
              name: data.name,
              slug: `${toSlug(data.name)}-${randomId()}`,
              location: { data: { ...location, actorId: teamManage.actor.id, locationDetails: data.addressQuery } },
              content: { data: { text: data.description } },
            },
          };

          insertEvent({
            // @ts-ignore
            variables,
            onCompleted: ({ insertEventOne: data }) => {
              const id = teamManage.id as string;
              const eventManage = data?.eventOrganizes?.[0];
              mergeCache(
                { __typename: 'Team', id },
                { fieldName: 'eventOrganizes', fragmentOn: 'EventOrganize', data: eventManage }
              );
              closeModal();
            },
          });
        }
      }}
    />
  );
}
