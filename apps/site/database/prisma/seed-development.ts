import prisma from './db';

import { fakeEvent } from './fakers/fake-event';
import { fakeEventApproval } from './fakers/fake-event-approval';
import { fakeFormSubmission } from './fakers/fake-submission';
import { fakeMission } from './fakers/fake-mission';
import { fakeUser } from './fakers/fake-user';
import { fakeApproval, fakeText, getPresencePayload } from './fakers/faker-utils';
import { seedCategories } from './seeders/seed-categories';
import { seedTeams } from './seeders/seed-teams';
import { seedTenantLocation } from './seeders/seed-tenant-location';

import {
  DEFAULT_TEAM_ROLES,
  DEFAULT_TEAM_JOIN_FORM_SCHEMA,
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
  N_DEFAULT_MIN_EVENT_JOINS,
  N_DEFAULT_MAX_EVENT_JOINS,
} from './seeders/defaults';

import { s3Client } from '../../server/secrets';
import { createTransaction } from '../../server/queries/createTransaction';

import rootPath from '../../server/root';

import { getGoCardLessBanks } from '../../server/services/bank';
import { getSireneCompanies } from '../../server/services/legalUnit';
import {
  pickWithRemainder,
  pickRandom,
  pickOneRandom,
  randomEnum,
  range,
  randomInt,
  uniqueSlug,
  includes,
  toSlug,
} from '@okampus/shared/utils';
import { ApprovalState, Colors, EventState, TransactionType, PaymentMethod, CountryCode } from '@prisma/client';

import { faker } from '@faker-js/faker';

import debug from 'debug';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';

import type { AuthContextMaybeUser } from '../../server/utils/withAuth';
import type { TenantWithProcesses } from '../../types/prisma/Tenant/tenant-with-processes';

async function fakeUsers(nUsers: number, tenant: { id: bigint; domain: string }) {
  return await Promise.all(Array.from({ length: nUsers }, async () => await fakeUser({ tenant })));
}

async function fakeEvents(
  nEvents: number,
  tenantLocation: { id: bigint }[],
  project: { id: bigint },
  team: { id: bigint; actorId: bigint },
  tenant: TenantWithProcesses,
  managers: { id: bigint }[],
) {
  return await Promise.all(
    Array.from(
      { length: nEvents },
      async () => await fakeEvent({ tenantLocations: tenantLocation, project, team, tenant, managers }),
    ),
  );
}

type SeedDevelopmentOptions = {
  tenant: TenantWithProcesses;
};

const debugLog = debug('okampus:seed:development');
export async function seedDevelopment({ tenant }: SeedDevelopmentOptions) {
  debugLog(`Seeding launched for tenant ${tenant.domain}...`);
  if (!tenant.actorId) throw new Error(`Tenant ${tenant.domain} has no admin team`);
  const authContext: AuthContextMaybeUser = { tenant, role: 'admin' };

  // TODO: offline fallback
  debugLog('Seeding legal units..');
  const legalUnits = await getSireneCompanies();

  debugLog('Seeding banks..');
  const banks = await getGoCardLessBanks(CountryCode.FR);

  debugLog('Seeding categories..');
  const categories = await seedCategories({ s3Client, tenant: tenant, useFaker: true });

  debugLog('Seeding tenant locations..');
  const { tenantLocation, tenantLocationClusters } = await seedTenantLocation({
    s3Client,
    tenant: tenant,
    useFaker: true,
  });

  debugLog('Seeding teams..');
  const teams = await seedTeams({ s3Client, categories, tenant, tenantLocationClusters, banks, useFaker: true });

  debugLog('Teams created, base tenant initialization complete! Generating fake data...');
  const tenantAdmins = await fakeUsers(N_DEFAULT_TENANT_ADMINS, tenant);
  const tenantMembers = await fakeUsers(N_DEFAULT_TENANT_MEMBERS, tenant);

  const teamPromises = [];

  const receiptPath = join(rootPath, 'libs/assets/src/sample/receipt.pdf');
  debugLog(`Receipt example path: ${receiptPath}`);

  // const receipt = new File([await readFile(receiptPath)], 'receipt.pdf', { type: 'application/pdf' });
  const receipt = new Blob([await readFile(receiptPath)], { type: 'application/pdf' });

  for (const [team, moneyAccount] of teams) {
    const N_MEMBERS = randomInt(N_DEFAULT_MIN_TEAM_MEMBERS, N_DEFAULT_MAX_TEAM_MEMBERS);
    const N_TEAM_JOINS = randomInt(N_DEFAULT_MIN_TEAM_JOINS, N_DEFAULT_MAX_TEAM_JOINS);

    const [memberRole, ...managerRoles] = await Promise.all(
      DEFAULT_TEAM_ROLES.map(
        async (role) => await prisma.teamRole.create({ data: { ...role, slug: toSlug(role.name), teamId: team.id } }),
      ),
    );

    const [directors, rest] = pickWithRemainder(tenantMembers, 6);
    const [members, others] = pickWithRemainder(rest, N_MEMBERS);

    // Add team directors
    teamPromises.push(
      Promise.all(
        directors.map(async (user, idx) => {
          const teamMemberRoles = { create: [{ teamRoleId: managerRoles[idx].id }] };
          return await prisma.teamMember.create({
            data: { userId: user.id, teamId: team.id, createdById: user.id, teamMemberRoles },
          });
        }),
      ),
    );

    // Add team members
    const teamMembers = await Promise.all(
      members.map(async (user) => {
        const teamMemberRoles = { create: [{ teamRoleId: memberRole.id }] };
        return await prisma.teamMember.create({
          data: { userId: user.id, teamId: team.id, createdById: user.id, teamMemberRoles },
        });
      }),
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

          const manager = pickOneRandom(directors);
          const [createdBy, processedBy] = Math.random() > 0.5 ? [manager, user] : [user, manager];

          const createdById = createdBy.id;
          const formSubmission = await fakeFormSubmission({ form: teamJoinForm, authContext });

          const teamJoin = { joinedById: user.id, joinFormSubmissionId: formSubmission.id, teamId: team.id };
          const teamJoinData = { processedAt: new Date(), processedById: processedBy.id, state: ApprovalState.Pending };
          await prisma.teamJoin.create({ data: { ...teamJoin, ...teamJoinData, createdById } });
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

      const createdById = pickOneRandom(directors).id;

      const project = await prisma.project.create({
        data: { ...projectData, color, isPrivate, teamId: team.id, createdById, tenantScopeId: tenant.id },
      });

      // Add project missions
      teamPromises.push(
        Promise.all(
          Array.from({ length: randomInt(0, 5) }).map(async () => {
            const createdById = pickOneRandom(directors).id;
            return await fakeMission({ projectId: project.id, teamId: team.id, createdById, tenantScopeId: tenant.id });
          }),
        ),
      ); // TODO: attribute those missions?

      // TODO: improve faking to include actions, project & event missions, jobs, etc..
      // const N_ACTIONS = randomInt(N_DEFAULT_MIN_PROJECT_ACTIONS, N_DEFAULT_MAX_PROJECT_ACTIONS);
      // teamPromises.push(
      //   Promise.all(
      //     Array.from({ length: N_ACTIONS }).map(async () => {
      //       const userId = pickOneRandom(members).id;
      //       await fakeAction({
      //         managers: directors,
      //         projectId: project.id,
      //         teamId: team.id,
      //         userId,
      //         tenantScopeId: tenant.id,
      //       });
      //     }),
      //   ),
      // );

      // Add events
      const N_EVENTS = randomInt(N_DEFAULT_MIN_PROJECT_EVENTS, N_DEFAULT_MAX_PROJECT_EVENTS);
      const events = await fakeEvents(N_EVENTS, tenantLocation, project, team, tenant, tenantMembers);

      for (const [event, missions] of events) {
        const { state, end, start, joinForm } = event;

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

                // let action;
                // if (isPresent && Math.random() > 0.5) {
                //   action = await fakeAction({
                //     managers: directors,
                //     teamId: team.id,
                //     userId: joinedById,
                //     tenantScopeId: tenant.id,
                //   });
                // }

                const participationData = getPresencePayload(isPresent, pickOneRandom(directors).id);

                let submission;
                if (joinForm) {
                  const formSubmission = await fakeFormSubmission({ form: joinForm, authContext });
                  submission = { joinFormSubmissionId: formSubmission.id };
                }

                // const actions = action ? { connect: [{ id: action.id }] } : undefined;
                const eventJoinData = { isPresent, state, ...participationData, ...submission };
                const eventJoin = await prisma.eventJoin.create({
                  data: { ...eventJoinData, eventId: event.id, joinedById, createdById: joinedById },
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
                            pointsProcessedById: pickOneRandom(directors).id,
                          }
                        : {};

                    const joinData = { eventJoinId: eventJoin.id, state, joinedById, processedAt: start };
                    const missionId = remainingMission.mission.id;
                    const processedById = state === ApprovalState.Approved ? pickOneRandom(directors).id : undefined;

                    await prisma.missionJoin.create({ data: { ...joinData, missionId, processedById, ...pointsData } });
                  }
                }
              },
            ),
          ),
        );

        // Add transactions
        if (moneyAccount) {
          teamPromises.push(
            Promise.all(
              Array.from({ length: randomInt(4, 10) }).map(async () => {
                const amount = randomInt(500, 20_000) / 100;
                const type = randomEnum(TransactionType);

                const attachments = Math.random() > 0.85 ? [{ key: 'receipt', blob: receipt }] : [];
                await createTransaction({
                  data: {
                    amount: -amount,
                    teamId: team.id,
                    counterPartyActorId: pickOneRandom(legalUnits).legalUnit.actor.id,
                    projectId: project.id,
                    wording: faker.lorem.words(3),
                    eventId: event.id,
                    liableTeamMemberId: pickOneRandom(teamMembers).id,
                    moneyAccountId: moneyAccount.id,
                    payedAt: faker.date.between({ from: start, to: end ?? new Date(2025, 1, 1) }),
                    paymentMethod: randomEnum(PaymentMethod),
                    transactionType: type,
                  },
                  attachments,
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
