'use client';

import EventDetailsStep from './EventDetailsStep';
import EventPresentationStep from './EventPresentationStep';
import EventSupervisorsStep from './EventSupervisorsStep';
import EventSummaryStep from './EventSummaryStep';
import BannerImage from '../../../atoms/Image/BannerImage';
import ChoiceList from '../../../molecules/List/ChoiceList';
import MultiStepForm from '../../../organisms/Form/MultiStepForm';

import { useTenant } from '../../../../context/navigation';
import { useModal } from '../../../../hooks/context/useModal';
import { mergeCache } from '../../../../utils/apollo/merge-cache';

import { LocationType } from '@okampus/shared/enums';
import { useInsertEventMutation } from '@okampus/shared/graphql';
import { geocodeAddressSchema } from '@okampus/shared/types';
import { isNotNull } from '@okampus/shared/utils';

import * as z from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import type { FormStepContext } from '../../../organisms/Form/MultiStepForm';
import type { TeamManageInfo } from '../../../../context/navigation';
import type { useFormContext } from 'react-hook-form';

const eventFormSchema = z
  .object({
    isOnline: z.boolean(),
    projectId: z.string().nullable(),
    description: z.string().max(10_000, { message: 'La description ne peut pas dépasser 10 000 caractères.' }),
    supervisorIds: z.array(z.string().nullable()).min(1, { message: 'Au moins un superviseur est requis.' }),
    name: z
      .string({ required_error: "Nom de l'événement requis." })
      .min(3, { message: "Le nom de l'événement doit faire au moins 3 caractères." })
      .max(100, { message: "Le nom de l'événement ne peut pas dépasser 100 caractères." }),
    start: z
      .date({ required_error: 'Date de début requise.' })
      .min(new Date(), { message: "L'événement ne peut pas commencer dans le passé." }),
    end: z.date({ required_error: 'Date de fin requise.' }),
    bannerId: z.string().nullable(),
    address: geocodeAddressSchema.nullable(),
    website: z.string().url({ message: 'Le lien doit être une URL valide.' }).optional().or(z.literal('')),
    locationDetails: z
      .string()
      .max(1000, { message: "Les détails de l'emplacement de l'événement ne peuvent pas dépasser 1000 caractères." }),
    formSubmission: z.record(z.string(), z.union([z.boolean(), z.string(), z.instanceof(FileList)])).nullable(),
  })
  .refine((data) => data.end > data.start, {
    message: "La date et heure de fin de l'événement doit être après sa date et heure de début.",
    path: ['endDate'],
  })
  .refine((data) => !data.isOnline && !data.address, {
    message: "L'adresse est requise pour les événements en personne.",
    path: ['address'],
  })
  .refine((data) => data.isOnline && !data.website, {
    message: "Le lien de l'événement est requis pour les événements en ligne.",
    path: ['address'],
  });

type EventFormSchema = z.infer<typeof eventFormSchema>;

const eventFormDefaultValues: EventFormSchema = {
  isOnline: false,
  projectId: null,
  description: '',
  supervisorIds: [null],
  name: '',
  start: new Date(),
  end: new Date(),
  bannerId: null,
  address: null,
  website: '',
  locationDetails: '',
  formSubmission: null,
};

export type EventFormStepProps = FormStepContext<EventFormSchema, { teamManage: TeamManageInfo }>;
export type ChoiceStepProps = {
  goToStep: (step: string) => void;
  formMethods: ReturnType<typeof useFormContext<EventFormSchema>>;
};

function EventOnlineChoiceStep({ methods: { formMethods, goToStep } }: EventFormStepProps) {
  return (
    <ChoiceList
      items={[{ item: { label: 'En ligne', value: true } }, { item: { label: 'En personne', value: false } }]}
      onClick={(isOnline) => {
        formMethods.setValue('isOnline', isOnline);
        goToStep('project');
      }}
    />
  );
}

function EventProjectChoiceStep({ methods: { formMethods, goToStep }, context: { teamManage } }: EventFormStepProps) {
  return (
    teamManage.projects && (
      <ChoiceList
        items={[
          { item: { label: 'Événément hors-projet', value: null } },
          ...teamManage.projects.map((project) => ({
            item: { label: project.name, value: project.id },
            prefix: <BannerImage name={project.name} src={project.banner?.url} className="h-14 rounded-lg" />,
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

export type EventFormProps = { teamManage: TeamManageInfo };
export default function EventForm({ teamManage }: EventFormProps) {
  const { closeModal } = useModal();
  const { tenant } = useTenant();

  const [insertEvent] = useInsertEventMutation();

  if (!tenant) return null;

  return (
    <MultiStepForm
      context={{ teamManage }}
      defaultValues={eventFormDefaultValues}
      resolver={zodResolver(eventFormSchema)}
      steps={{
        initial: {
          header: 'Événement en ligne ?',
          content: EventOnlineChoiceStep,
        },
        project: {
          onEnter: ({ methods: { formMethods } }) => formMethods.setValue('projectId', null),
          header: 'Projet lié',
          content: EventProjectChoiceStep,
        },
        details: {
          nextStep: 'presentation',
          header: "Détails de l'événement",
          content: EventDetailsStep,
          validateFields: ['name', 'start', 'end', 'address', 'website'],
        },
        presentation: {
          nextStep: 'supervisors',
          header: "Présentation de l'événement",
          content: EventPresentationStep,
          validateFields: ['description'],
        },
        supervisors: {
          nextStep: 'summary',
          header: "Responsables de l'événement",
          content: EventSupervisorsStep,
          validateFields: ['supervisorIds'],
        },
        summary: {
          submit: "Créer l'événement",
          header: 'Récapitulatif',
          content: EventSummaryStep,
        },
      }}
      onSubmit={(data) => {
        if (teamManage) {
          const location =
            data.isOnline || !data.address
              ? { type: LocationType.Online, onlineLink: data.website }
              : { type: LocationType.Address, address: { data: data.address } };

          const formSubmission = data.formSubmission
            ? {
                eventApprovalSubmission: {
                  data: {
                    formId: tenant.eventValidationForm?.id,
                    formSubmission: { data: { submission: data.formSubmission } },
                  },
                },
              }
            : {};

          const variables = {
            object: {
              ...formSubmission,
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
              start: data.start.toISOString(),
              end: data.end.toISOString(),
              name: data.name,
              location: { data: { ...location, actorId: teamManage.actor.id, locationDetails: data.locationDetails } },
              content: { data: { text: data.description } },
              nextEventApprovalStepId: tenant.eventApprovalSteps[0].id,
            },
          };

          insertEvent({
            variables,
            onCompleted: ({ insertEventOne: data }) => {
              const id = teamManage.id;
              const eventManage = data?.eventOrganizes?.[0];
              const field = { fieldName: 'eventOrganizes', fragmentOn: 'EventOrganize', data: eventManage };
              mergeCache({ __typename: 'Team', id }, field);

              closeModal();
            },
          });
        }
      }}
    />
  );
}