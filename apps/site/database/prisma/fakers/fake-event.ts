import { fakeMission } from './fake-mission';
import { fakeFormSubmission } from './fake-submission';
import { fakeText } from './faker-utils';
import prisma from '../db';
import {
  DEFAULT_ADDRESSES,
  N_DEFAULT_MAX_EVENT_MISSIONS,
  N_DEFAULT_MIN_EVENT_MISSIONS,
  DEFAULT_EVENT_JOIN_FORM_SCHEMA as schema,
} from '../seeders/defaults';

import { getAddress } from '../../../server/services/address';

import { getRoundedDate, pickOneRandom, randomInt, uniqueSlug } from '@okampus/shared/utils';

import { faker } from '@faker-js/faker';
import { EventState, EventType, PostType } from '@prisma/client';
import type { TenantWithProcesses } from '../../../types/prisma/Tenant/tenant-with-processes';

const onlinePlatforms = ['Zoom', 'Google Meet', 'Microsoft Teams', 'Discord'];

type FakeEventOptions = {
  tenant: TenantWithProcesses;
  team: { id: bigint; actorId: bigint };
  tenantLocations: { id: bigint }[];
  project: { id: bigint };
  managers: { id: bigint }[];
};

export async function getLocation(tenantLocations: { id: bigint }[], type: EventType) {
  let locationName: string | undefined;

  let locationLinkId: bigint | undefined;
  if (type === EventType.Online || type === EventType.Hybrid || type === EventType.HybridCampus) {
    const locationLink = await prisma.link.create({
      data: { url: faker.internet.url(), name: pickOneRandom(onlinePlatforms), description: 'Accès public' },
    });
    locationLinkId = locationLink.id;
  }

  let tenantLocationId: bigint | undefined;
  if (type === EventType.Campus || type === EventType.HybridCampus) {
    if (Math.random() > 0.5) locationName = `Salle ${faker.string.alphanumeric(4)}`;
    tenantLocationId = pickOneRandom(tenantLocations).id;
  }

  let geoapifyAddressId: string | undefined;
  if (type === EventType.Physical || type === EventType.Hybrid) {
    if (Math.random() > 0.5) locationName = faker.company.name();
    const address = await getAddress(pickOneRandom(DEFAULT_ADDRESSES));
    geoapifyAddressId = address ? address.geoapifyId : undefined;
  }

  return {
    locationName,
    ...(locationLinkId && { locationLink: { connect: { id: locationLinkId } } }),
    ...(tenantLocationId && { tenantLocation: { connect: { id: tenantLocationId } } }),
    ...(geoapifyAddressId && { address: { connect: { geoapifyId: geoapifyAddressId } } }),
  };
}

export async function fakeEvent({ tenantLocations, project, team, tenant, managers }: FakeEventOptions) {
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
    ? await fakeFormSubmission({ form: tenant.eventValidationForm, authContext: { tenant, role: 'admin' } })
    : undefined;

  const eventLocationType = pickOneRandom(Object.values(EventType));
  const location = await getLocation(tenantLocations, eventLocationType);

  const missions = await Promise.all(
    Array.from({ length: randomInt(N_DEFAULT_MIN_EVENT_MISSIONS, N_DEFAULT_MAX_EVENT_MISSIONS) }).map(() =>
      fakeMission({ teamId: team.id, createdById, tenantScopeId: tenant.id }),
    ),
  );

  const event = await prisma.event.create({
    data: {
      name,
      slug: uniqueSlug(name),
      summary: fakeText(),
      state,
      start,
      end,
      pointsAwardedForAttendance: Math.random() > 0.5 ? 1 : 0.25,
      price: payedEvent ? randomInt(1, 50) : 0,
      announcementPost: { create: { content: fakeText(), type: PostType.Event, createdById } },
      eventOrganizes: {
        create: {
          teamId: team.id,
          projectId: project.id,
          createdById,
          missions: { connect: missions.map((mission) => ({ id: mission.id })) },
          eventSupervisors: { create: [{ userId: createdById, createdById }] },
        },
      },
      ...location,
      ...(eventApprovalSubmission && { eventApprovalSubmission: { connect: { id: eventApprovalSubmission.id } } }),
      ...(joinForm && { joinForm: { connect: { id: joinForm.id } } }),
      ...(nextApprovalStepId && { nextApprovalStep: { connect: { id: nextApprovalStepId } } }),
      createdBy: { connect: { id: createdById } },
      tenantScope: { connect: { id: tenant.id } },
    },
    select: {
      id: true,
      state: true,
      start: true,
      end: true,
      nextApprovalStepId: true,
      tenantScopeId: true,
      joinForm: true,
    },
  });

  if (!event) throw new Error('Event not found');

  return [event, missions] as const;
}
