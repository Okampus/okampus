'use client';

import EventStepDetails from './EventStepDetails';
import EventStepPresentation from './EventStepPresentation';
import StepProjectChoice from '../StepProjectChoice';
import MultiStepFormView from '../../../_components/templates/MultiStepFormView';

import { CalendarPlus, ChartDonut } from '@phosphor-icons/react';
import { z } from 'zod';

import type { TeamWithProjects } from '../../../../types/prisma/Team/team-with-projects';

export type CreateEventFormProps = { domain: string; team: TeamWithProjects };

export default function CreateEventForm({ domain, team }: CreateEventFormProps) {
  return (
    <MultiStepFormView
      context={team}
      id={`${domain}/team/${team.slug}/events/new`}
      title="Créer un événement"
      onSubmit={(data) => console.log(data)}
      steps={[
        {
          icon: <ChartDonut />,
          title: "Projet de l'événement",
          render: StepProjectChoice,
          zodSchema: z.object({}),
        },
        {
          icon: <CalendarPlus />,
          title: "Détails de l'événement",
          render: EventStepDetails,
          zodSchema: z.object({}),
        },
        {
          icon: <CalendarPlus />,
          title: "Présentation de l'événement",
          render: EventStepPresentation,
          zodSchema: z.object({}),
        },
      ]}
    />
  );
}
