import { fakeMission } from './fake-mission';
import { fakeFormSubmission } from './fake-submission';
import { fakeText } from './faker-utils';
import { prisma } from '../db';
import {
  DEFAULT_ADDRESSES,
  N_DEFAULT_MAX_EVENT_MISSIONS,
  N_DEFAULT_MIN_EVENT_MISSIONS,
  DEFAULT_EVENT_JOIN_FORM_SCHEMA as schema,
} from '../seeders/defaults';
import { getAddress } from '../services/geoapify';

import { getRoundedDate, pickOneRandom, randomInt, uniqueSlug } from '@okampus/shared/utils';

import { faker } from '@faker-js/faker';
import { EventState, LocationType } from '@prisma/client';

import type { Prisma } from '@prisma/client';

export type FakeEventTenant = {
  id: bigint;
  eventValidationForm?: { id: bigint; schema: Prisma.JsonValue; tenantScopeId: bigint };
  scopedEventApprovalSteps: { id: bigint }[];
};

type FakeEventOptions = {
  campus: { id: bigint }[];
  project: { id: bigint };
  team: { id: bigint; actorId: bigint };
  tenant: FakeEventTenant;
  managers: { id: bigint }[];
};
export async function fakeEvent({ campus, project, team, tenant, managers }: FakeEventOptions) {
  const start = getRoundedDate(30, faker.date.between({ from: new Date('2022-09-01'), to: new Date('2024-09-01') }));
  const end = new Date(start.getTime() + 1000 * 60 * 60 * randomInt(1, 48));

  let state: EventState = EventState.Draft;

  let nextApprovalStepId: bigint | undefined;
  if (Math.random() > 0.5) {
    nextApprovalStepId = tenant.scopedEventApprovalSteps[0].id; // Draft
  } else if (Math.random() > 0.35) {
    state = Math.random() > 0.25 ? EventState.Published : EventState.Approved;
  } else {
    nextApprovalStepId = tenant.scopedEventApprovalSteps[randomInt(0, tenant.scopedEventApprovalSteps.length - 1)].id;
    state = Math.random() > 0.5 ? EventState.Rejected : EventState.Submitted;
  }

  const createdById = pickOneRandom(managers).id;
  const name = faker.commerce.productName();

  const payedEvent = Math.random() > 0.5;

  let joinForm;
  if (payedEvent) joinForm = await prisma.form.create({ data: { schema, createdById, tenantScopeId: tenant.id } });

  const eventApprovalSubmission = tenant.eventValidationForm
    ? await fakeFormSubmission({ form: tenant.eventValidationForm, createdById })
    : undefined;

  let geoapifyId: string | null = null;

  const isOnline = Math.random() > 0.5;
  if (!isOnline) {
    const address = await getAddress(pickOneRandom(DEFAULT_ADDRESSES));
    geoapifyId = address.geoapifyId;
  }

  const location = geoapifyId
    ? await prisma.location.create({
        data: {
          type: LocationType.Address,
          geoapifyId,
          details: fakeText(),
          actorId: team.actorId,
          tenantScopeId: tenant.id,
        },
      })
    : await prisma.location.create({
        data: {
          type: LocationType.Online,
          link: faker.internet.url(),
          details: fakeText(),
          actorId: team.actorId,
          tenantScopeId: tenant.id,
        },
      });

  const missions = await Promise.all(
    Array.from({ length: randomInt(N_DEFAULT_MIN_EVENT_MISSIONS, N_DEFAULT_MAX_EVENT_MISSIONS) }).map(() =>
      fakeMission({ teamId: team.id, createdById, tenantScopeId: tenant.id }),
    ),
  );

  const event = await prisma.event.create({
    data: {
      name,
      slug: uniqueSlug(name),
      description: fakeText(),
      start,
      end,
      state,
      pointsAwardedForAttendance: Math.random() > 0.5 ? 1 : 0.25,
      price: payedEvent ? randomInt(1, 50) : 0,
      locationId: location.id,
      nextApprovalStepId,
      eventOrganizes: {
        create: {
          teamId: team.id,
          projectId: project.id,
          createdById,
          tenantScopeId: tenant.id,
          missions: { connect: missions.map((mission) => ({ id: mission.id })) },
          eventSupervisors: { create: [{ userId: createdById, createdById, tenantScopeId: tenant.id }] },
        },
      },
      ...(eventApprovalSubmission && { eventApprovalSubmissionId: eventApprovalSubmission.id }),
      ...(joinForm && { joinFormId: joinForm.id }),
      createdById,
      tenantScopeId: tenant.id,
    },
  });

  return [event, missions] as const;
}
