import { prisma } from './db';
import { fakeAction } from './fakers/fake-action';
import { fakeEvent } from './fakers/fake-event';
import { fakeEventApproval } from './fakers/fake-event-approval';
import { fakeFormSubmission } from './fakers/fake-submission';
import { fakeMission } from './fakers/fake-mission';
import { fakeUser } from './fakers/fake-user';
import { fakeApproval, fakeText, getPresencePayload } from './fakers/faker-utils';
import { seedBanks } from './seeders/seed-banks';
import { seedCampus } from './seeders/seed-campus';
import { DEFAULT_TEAM_ROLES } from './seeders/default-roles';
import { seedCategories } from './seeders/seed-categories';
import { seedLegalUnits } from './seeders/seed-legal-units';
import { seedTeams } from './seeders/seed-teams';
import {
  N_DEFAULT_TENANT_ADMINS,
  N_DEFAULT_TENANT_MEMBERS,
  N_DEFAULT_MAX_TEAM_MEMBERS,
  N_DEFAULT_MIN_TEAM_JOINS,
  N_DEFAULT_MAX_TEAM_JOINS,
  N_DEFAULT_MIN_TEAM_PROJECTS,
  N_DEFAULT_MAX_TEAM_PROJECTS,
  N_DEFAULT_MIN_PROJECT_EVENTS,
  N_DEFAULT_MAX_PROJECT_EVENTS,
  N_DEFAULT_MIN_TEAM_MEMBERS,
  DEFAULT_EVENT_JOIN_FORM_SCHEMA,
  DEFAULT_TEAM_JOIN_FORM_SCHEMA,
  N_DEFAULT_MIN_PROJECT_ACTIONS,
  N_DEFAULT_MAX_PROJECT_ACTIONS,
  N_DEFAULT_MIN_EVENT_JOINS,
  N_DEFAULT_MAX_EVENT_JOINS,
} from './seeders/defaults';

import {} from './services/upload';

import { s3Client } from '../../config/secrets';
import { createTransaction } from '../../server/queries/createTransaction';
import { rootPath } from '../../server/root';

import {
  pickWithRemainder,
  pickRandom,
  pickOneRandom,
  randomEnum,
  range,
  randomInt,
  uniqueSlug,
  includes,
} from '@okampus/shared/utils';
import { ApprovalState, Colors, EventState, TransactionType, PaymentMethod } from '@prisma/client';

import { faker } from '@faker-js/faker';

import { join } from 'node:path';
import { readFile } from 'node:fs/promises';

import type { SeedTeamsOptions } from './seeders/seed-teams';
import type { FakeEventTenant } from './fakers/fake-event';
import type { AuthContextMaybeUser } from '../../server/actions/utils/withAuth';
import type { Prisma } from '@prisma/client';

async function fakeUsers(nUsers: number, tenant: { id: bigint; domain: string }) {
  return await Promise.all(Array.from({ length: nUsers }, async () => await fakeUser({ tenant })));
}

async function fakeEvents(
  nEvents: number,
  campus: { id: bigint }[],
  project: { id: bigint },
  team: { id: bigint; actorId: bigint },
  tenant: FakeEventTenant,
  managers: { id: bigint }[],
) {
  return await Promise.all(
    Array.from({ length: nEvents }, async () => await fakeEvent({ campus, project, team, tenant, managers })),
  );
}

type SeedDevelopmentOptions = {
  tenant: {
    id: bigint;
    actorId: bigint;
    domain: string;
    scopedEventApprovalSteps: { id: bigint }[];
    eventValidationForm?: { id: bigint; schema: Prisma.JsonValue; tenantScopeId: bigint };
  };
};

export async function seedDevelopment({ tenant }: SeedDevelopmentOptions) {
  console.log(`Seeding launched for tenant ${tenant.domain}...`);
  if (!tenant.actorId) throw new Error(`Tenant ${tenant.domain} has no admin team`);
  const authContext: AuthContextMaybeUser = { tenant, role: 'admin' };

  console.log('Seeding legal units..');
  const legalUnits = await seedLegalUnits({ s3Client, useFaker: true });

  console.log('Seeding banks..');
  const banks = await seedBanks({ s3Client, useFaker: true });
  const banksWithCode = banks.filter((bank) => bank.bankCode) as SeedTeamsOptions['banks'];

  console.log('Seeding categories..');
  const categories = await seedCategories({ s3Client, tenant: tenant, useFaker: true });

  console.log('Seeding campus..');
  const { campus } = await seedCampus({ s3Client, tenant: tenant, useFaker: true });

  console.log('Seeding teams..');
  const teams = await seedTeams({ s3Client, categories, tenant: tenant, banks: banksWithCode, useFaker: true });

  console.log('Teams created, base tenant initialization complete! Generating fake data...');
  const tenantAdmins = await fakeUsers(N_DEFAULT_TENANT_ADMINS, tenant);
  const tenantMembers = await fakeUsers(N_DEFAULT_TENANT_MEMBERS, tenant);

  const teamPromises = [];

  const receiptPath = join(rootPath, 'libs/assets/src/sample/receipt.pdf');
  console.log(`Receipt example path: ${receiptPath}`);

  // const receipt = new File([await readFile(receiptPath)], 'receipt.pdf', { type: 'application/pdf' });
  const receipt = new Blob([await readFile(receiptPath)], { type: 'application/pdf' });

  for (const [team, bankAccount] of teams) {
    const N_MEMBERS = randomInt(N_DEFAULT_MIN_TEAM_MEMBERS, N_DEFAULT_MAX_TEAM_MEMBERS);
    const N_TEAM_JOINS = randomInt(N_DEFAULT_MIN_TEAM_JOINS, N_DEFAULT_MAX_TEAM_JOINS);

    const [memberRole, ...managerRoles] = await Promise.all(
      DEFAULT_TEAM_ROLES.map(
        async (role) => await prisma.teamRole.create({ data: { ...role, teamId: team.id, tenantScopeId: tenant.id } }),
      ),
    );

    const [managers, rest] = pickWithRemainder(tenantMembers, 5);
    const [members, others] = pickWithRemainder(rest, N_MEMBERS);

    // Add team managers
    teamPromises.push(
      Promise.all(
        managers.map(async (user, idx) => {
          const teamMemberRoles = { create: [{ teamRoleId: managerRoles[idx].id }] };
          return await prisma.teamMember.create({
            data: { userId: user.id, teamId: team.id, createdById: user.id, teamMemberRoles, tenantScopeId: tenant.id },
          });
        }),
      ),
    );

    // Add team members
    teamPromises.push(
      Promise.all(
        members.map(async (user) => {
          const teamMemberRoles = { create: [{ teamRoleId: memberRole.id }] };
          return await prisma.teamMember.create({
            data: { userId: user.id, teamId: team.id, createdById: user.id, teamMemberRoles, tenantScopeId: tenant.id },
          });
        }),
      ),
    );

    const teamJoinForm = await prisma.form.create({
      data: {
        schema: DEFAULT_TEAM_JOIN_FORM_SCHEMA,
        joinFormOfTeam: { connect: { id: team.id } },
        isAllowingEditingAnswers: true,
        isAllowingMultipleAnswers: false,
        tenantScopeId: tenant.id,
      },
    });

    // Add team joins
    teamPromises.push(
      Promise.all(
        pickRandom(others, N_TEAM_JOINS).flatMap(async (user) => {
          if (!user) return;

          const manager = pickOneRandom(managers);
          const [createdBy, processedBy] = Math.random() > 0.5 ? [manager, user] : [user, manager];

          const createdById = createdBy.id;
          const formSubmission = await fakeFormSubmission({ form: teamJoinForm, authContext });

          const teamJoin = { joinedById: user.id, joinFormSubmissionId: formSubmission.id, teamId: team.id };
          const teamJoinData = { processedAt: new Date(), processedById: processedBy.id, state: ApprovalState.Pending };
          await prisma.teamJoin.create({
            data: { ...teamJoin, ...teamJoinData, createdById, tenantScopeId: tenant.id },
          });
        }),
      ),
    );

    const projectNames = ['Activité hebdomadaire', 'Échanges & rencontres', 'Séances de découverte'];

    const N_PROJECTS = randomInt(N_DEFAULT_MIN_TEAM_PROJECTS, N_DEFAULT_MAX_TEAM_PROJECTS);
    for (const i of Array.from({ length: N_PROJECTS }, (_, i) => i)) {
      const name = projectNames[i % projectNames.length];
      const projectData = { budget: randomInt(500, 1000) / 10, description: fakeText(), name, slug: uniqueSlug(name) };
      const color = randomEnum(Colors);
      const isPrivate = Math.random() > 0.5;

      const createdById = pickOneRandom(managers).id;

      const project = await prisma.project.create({
        data: { ...projectData, color, isPrivate, teamId: team.id, createdById, tenantScopeId: tenant.id },
      });

      // Add project missions
      teamPromises.push(
        Promise.all(
          Array.from({ length: randomInt(0, 5) }).map(async () => {
            const createdById = pickOneRandom(managers).id;
            return await fakeMission({ projectId: project.id, teamId: team.id, createdById, tenantScopeId: tenant.id });
          }),
        ),
      ); // TODO: attribute those missions?

      // Add project actions
      const N_ACTIONS = randomInt(N_DEFAULT_MIN_PROJECT_ACTIONS, N_DEFAULT_MAX_PROJECT_ACTIONS);
      teamPromises.push(
        Promise.all(
          Array.from({ length: N_ACTIONS }).map(async () => {
            const userId = pickOneRandom(members).id;
            await fakeAction({ managers, projectId: project.id, teamId: team.id, userId, tenantScopeId: tenant.id });
          }),
        ),
      );

      // Add events
      const N_EVENTS = randomInt(N_DEFAULT_MIN_PROJECT_EVENTS, N_DEFAULT_MAX_PROJECT_EVENTS);
      const events = await fakeEvents(N_EVENTS, campus, project, team, tenant, tenantMembers);

      for (const [event, missions] of events) {
        const { state, start, joinFormId } = event;

        // Add event approvals
        if (includes(state, [EventState.Rejected, EventState.Approved, EventState.Published, EventState.Submitted])) {
          const lastStepIdx = tenant.scopedEventApprovalSteps.findIndex(({ id }) => id === event.nextApprovalStepId);

          // Add event approval for the rejected step (if applicable)
          if (state === EventState.Rejected && event.nextApprovalStepId) {
            const tenantAdminId = pickOneRandom(tenantAdmins).id;
            await fakeEventApproval({ event, stepId: event.nextApprovalStepId, isApproved: false, tenantAdminId });
          }

          // Add event approval for approved steps
          for (const idx of range({ to: lastStepIdx })) {
            const stepId = tenant.scopedEventApprovalSteps[idx].id;
            const tenantAdminId = pickOneRandom(tenantAdmins).id;
            await fakeEventApproval({ event, stepId, isApproved: false, tenantAdminId });
          }
        }

        // Count missions to distribute mission joins
        const remainingMissions: { mission: { id: bigint }; quantity: number }[] = missions.map((mission) => ({
          mission,
          quantity: mission.quantity,
        }));

        // Add event joins
        teamPromises.push(
          Promise.all(
            pickRandom(tenantMembers, N_DEFAULT_MIN_EVENT_JOINS, N_DEFAULT_MAX_EVENT_JOINS).flatMap(
              async ({ id: joinedById }) => {
                const isPresent = Math.random() > 0.5 ? Math.random() > 0.75 : null;
                const state = fakeApproval(isPresent !== null);

                let action;
                if (isPresent && Math.random() > 0.5) {
                  action = await fakeAction({
                    managers,
                    teamId: team.id,
                    userId: joinedById,
                    tenantScopeId: tenant.id,
                  });
                }

                const participationData = getPresencePayload(isPresent, pickOneRandom(managers).id);

                let submission;
                if (joinFormId) {
                  const form = { id: joinFormId, schema: DEFAULT_EVENT_JOIN_FORM_SCHEMA, tenantScopeId: tenant.id };
                  const formSubmission = await fakeFormSubmission({ form, authContext });
                  submission = { joinFormSubmissionId: formSubmission.id };
                }

                const actions = action ? { connect: [{ id: action.id }] } : undefined;
                const eventJoinData = { isPresent, state, ...participationData, ...submission };
                const eventJoin = await prisma.eventJoin.create({
                  data: {
                    ...eventJoinData,
                    actions,
                    eventId: event.id,
                    joinedById,
                    createdById: joinedById,
                    tenantScopeId: tenant.id,
                  },
                });

                // Add mission registrations
                if (Math.random() > 0.25) {
                  const remainingMission = remainingMissions.find(({ quantity }) => quantity > 0);
                  if (remainingMission) {
                    remainingMission.quantity--;
                    const isCompleted = Math.random() > 0.5;

                    const state = fakeApproval(isCompleted);
                    const pointsData =
                      state === ApprovalState.Approved
                        ? {
                            points: randomInt(1, 3),
                            pointsProcessedAt: new Date(),
                            pointsProcessedById: pickOneRandom(managers).id,
                          }
                        : {};

                    const joinData = { eventJoinId: eventJoin.id, state, joinedById, processedAt: start };
                    const missionId = remainingMission.mission.id;
                    const processedById = state === ApprovalState.Approved ? pickOneRandom(managers).id : undefined;

                    await prisma.missionJoin.create({
                      data: { ...joinData, missionId, processedById, ...pointsData, tenantScopeId: tenant.id },
                    });
                  }
                }
              },
            ),
          ),
        );

        // Add transactions
        if (bankAccount) {
          teamPromises.push(
            Promise.all(
              Array.from({ length: randomInt(4, 10) }).map(async () => {
                const amount = randomInt(500, 20_000) / 100;
                const type = randomEnum(TransactionType);

                const create = {
                  amount: -amount,
                  projectId: project.id,
                  eventId: event.id,
                  bankAccountId: bankAccount.id,
                  payedAt: faker.date.between({ from: start, to: new Date() }),
                  payedById: pickOneRandom(members).actorId,
                  receivedById: pickOneRandom(legalUnits).actorId,
                  createdById: pickOneRandom(managers).actorId,
                  method: randomEnum(PaymentMethod),
                  state: ApprovalState.Approved,
                  type: type === TransactionType.Subvention ? TransactionType.Other : type,
                  tenantScopeId: tenant.id,
                };

                await createTransaction({
                  data: create,
                  attachments: Math.random() > 0.85 ? [receipt] : [],
                  authContext,
                });
              }),
            ),
          );
        }
      }

      teamPromises.push(events);
    }
  }

  await Promise.all(teamPromises);
}
