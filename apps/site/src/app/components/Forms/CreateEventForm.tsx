import { ControlType, EventState } from '@okampus/shared/enums';
import { createEventMutation, eventFragment, getFragmentData } from '@okampus/shared/graphql';

import { DynamicForm } from '@okampus/ui/organisms';
import { useTeamManage } from '@okampus/ui/hooks';

import { useMutation } from '@apollo/client';
import { z } from 'zod';

import type { DynamicFieldData } from '@okampus/ui/organisms';
import type { Address } from '@okampus/shared/dtos';
import type { EventInfoFragment } from '@okampus/shared/graphql';

type CreateEventFormData = {
  title: string;
  start: Date;
  end: Date;
  supervisorId: string;
  description: string;
  // location: string;
  private: boolean;
};

// TODO: fix schema with custom DynamicFrom
const _schema = z
  .object({
    title: z.string().min(3, { message: "Le nom de l'événement doit faire au moins 3 caractères." }),
    start: z.string().refine((date) => new Date(Date.parse(date)) > new Date(), {
      message: "La date de début d'événement doit être dans le futur.",
      path: ['start'],
    }),
    end: z.string().refine((date) => new Date(Date.parse(date)) > new Date(), {
      message: "La date de début d'événement doit être dans le futur.",
      path: ['start'],
    }),
    description: z.string().min(10, { message: "Une description d'événement est nécessaire." }),
    supervisorId: z.string(),
    // location: string,
    private: z.boolean(),
  })
  .refine((data) => data.start < data.end, {
    message: "La date de fin d'événement doit être après la date de début.",
    path: ['end'],
  });

type CreateEventFormProps = {
  onSubmit: (data?: EventInfoFragment) => void;
};

const location: Address = {
  name: 'Efrei République',
  city: 'Villejuif',
  country: 'France',
  street: '30-32 Avenue de la République',
  state: 'IDF',
  zip: 94_800,
  latitude: 48.7949,
  longitude: 2.3849,
};

export function CreateEventForm({ onSubmit }: CreateEventFormProps) {
  const { teamManage } = useTeamManage();

  const [createEvent] = useMutation(createEventMutation, {
    onCompleted: (data) => {
      const event = getFragmentData(eventFragment, data.createEvent);
      onSubmit(event);
    },
  });

  if (!teamManage) return <p className="text-red-500">Aucune organisation n'est chargée.</p>;
  const onCreateEvent = (event: CreateEventFormData) => {
    createEvent({
      variables: { event: { ...event, orgId: teamManage.id, location, state: EventState.Submitted } },
    });
  };

  const members = teamManage.members.map((member) => ({
    value: member.id,
    label: `${member.user?.actor?.name}`,
  }));

  const fields: DynamicFieldData[] = [
    {
      fieldName: 'title',
      inputType: ControlType.Text,
      label: "Nom de l'événement",
      defaultValue: '',
      placeholder: "Nom de l'événement",
    },
    {
      fieldName: 'supervisorId',
      inputType: ControlType.Select,
      label: 'Superviseur',
      options: members,
      fullWidth: true,
      placeholder: 'Superviseur',
    },
    {
      fieldName: 'start',
      inputType: ControlType.DatetimeLocal,
      label: "Début de l'événement",
      placeholder: 'Date et heure de début',
    },
    {
      fieldName: 'end',
      inputType: ControlType.DatetimeLocal,
      label: "Fin de l'événement",
      placeholder: 'Date et heure de fin',
    },
    {
      fieldName: 'private',
      inputType: ControlType.Checkbox,
      label: 'Événement privé ?',
    },
    {
      fieldName: 'description',
      inputType: ControlType.Text,
      label: 'Description',
      placeholder: 'Description',
    },
  ];

  return <DynamicForm onSubmit={onCreateEvent} fields={fields} />;
}
