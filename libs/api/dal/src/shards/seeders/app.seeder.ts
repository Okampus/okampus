/* eslint-disable object-curly-newline */
import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import {
  Colors,
  JoinKind,
  JoinState,
  MembershipKind,
  RoleKind,
  ScopeRole,
  TeamPermissions,
  TeamRoleCategory,
} from '@okampus/shared/enums';
import { pickOneFromArray, randomFromArray, randomFromArrayWithRemainder } from '@okampus/shared/utils';
import { hash } from 'argon2';
import { randomInt } from 'node:crypto';
import { Individual } from '../../resources/actor/individual/individual.entity';
import { User } from '../../resources/actor/user/user.entity';
// import { EventJoin } from '../../resources/join/event-join/event-join.entity';
import { TeamJoin } from '../../resources/join/team-join/team-join.entity';
import { EventApprovalStep } from '../../resources/manage-tenant/event-approval-step/event-approval-step.entity';
import { TeamMember } from '../../resources/membership/team-member/team-member.entity';
import { Team } from '../../resources/org/team/team.entity';
import { Tenant } from '../../resources/org/tenant/tenant.entity';
import { TeamRole } from '../../resources/role/team-role/team-role.entity';
import { EventApprovalStepSeeder } from './factories/approval-step.seeder';
import { EventSeeder } from './factories/event.seeder';
import { TeamSeeder } from './factories/team.seeder';
import { TenantSeeder } from './factories/tenant.seeder';
import { UserSeeder } from './factories/user.seeder';

const seedingConfig = {
  N_ADMINS: 10,
  N_STUDENTS: 100,
  N_TEACHERS: 10,

  N_APPROVAL_STEPS: 3,
  N_TEAMS: 10,

  MIN_ADMINS_BY_STEP: 1,
  MAX_ADMINS_BY_STEP: 3,

  MIN_MEMBERS: 5,
  MAX_MEMBERS: 10,

  MIN_REQUESTS: 3,
  MAX_REQUESTS: 10,

  MIN_EVENTS_BY_CLUB: 5,
  MAX_EVENTS_BY_CLUB: 10,

  EXAMPLE_RECEIPT_URL: 'https://bucket-team-receipts.okampus.fr/facture_exemple.pdf',
};

async function createEventApprovalStep(
  em: EntityManager,
  validators: User[],
  tenant: Tenant,
  order: number,
  createdBy: Individual
): Promise<EventApprovalStep> {
  const step = await new EventApprovalStepSeeder(em, tenant, order, createdBy).createOne();
  step.validators.add(validators);
  return step;
}

function createTeamRole(
  em: EntityManager,
  team: Team,
  name: string,
  category: TeamRoleCategory,
  tenant: Tenant
): TeamRole {
  return em.create(TeamRole, {
    createdAt: new Date(),
    updatedAt: new Date(),
    tenant,
    team,
    roleKind: RoleKind.TeamRole,
    required: category === TeamRoleCategory.Directors,
    name,
    color: Colors.Blue,
    category,
    permissions:
      category === TeamRoleCategory.Directors
        ? [TeamPermissions.Admin]
        : category === TeamRoleCategory.Managers
        ? [
            TeamPermissions.ManageEvents,
            TeamPermissions.ViewRequests,
            TeamPermissions.ManageRequests,
            TeamPermissions.ViewDraftEvents,
          ]
        : [],
  });
}

function createTeamMember(em: EntityManager, team: Team, user: User, roles: TeamRole[]) {
  return em.create(TeamMember, {
    createdAt: new Date(),
    updatedAt: new Date(),
    tenant: team.tenant,
    team,
    roles,
    membershipKind: MembershipKind.TeamMember,
    startDate: new Date(),
    user,
  });
}

// TODO: refactor awaits out of loops
export class DatabaseSeeder extends Seeder {
  public async run(em: EntityManager): Promise<void> {
    const passwordHash = await hash('password');

    const tenant = await new TenantSeeder(em).createOne();
    const admins = await new UserSeeder(em, tenant, ScopeRole.Admin, passwordHash).create(seedingConfig.N_ADMINS);
    // const _teachers = await new UserFactory(em, tenant, ScopeRole.Teacher).create(
    //   seedingConfig.N_TEACHERS
    // );
    const students = await new UserSeeder(em, tenant, ScopeRole.Student, passwordHash).create(seedingConfig.N_STUDENTS);

    let restAdmins = admins;
    let stepAdmins: User[];

    const approvalStepsPromises = [];
    for (let i = 0; i < seedingConfig.N_APPROVAL_STEPS; i++) {
      [stepAdmins, restAdmins] = randomFromArrayWithRemainder(
        restAdmins,
        randomInt(seedingConfig.MIN_ADMINS_BY_STEP, seedingConfig.MAX_ADMINS_BY_STEP)
      );
      approvalStepsPromises.push(createEventApprovalStep(em, stepAdmins, tenant, i + 1, stepAdmins[0]));
    }

    const approvalSteps = await Promise.all(approvalStepsPromises);

    const MAX_MEMBERS = Math.min(students.length - 4, seedingConfig.MAX_MEMBERS);

    const teams = await new TeamSeeder(em, tenant).create(seedingConfig.N_TEAMS);
    const teamPromises = [];

    for (const team of teams) {
      const N_MEMBERS = randomInt(seedingConfig.MIN_MEMBERS, MAX_MEMBERS);
      const MAX_REQUESTERS = Math.min(students.length - 4 - N_MEMBERS, seedingConfig.MAX_REQUESTS);
      const N_REQUESTERS = randomInt(seedingConfig.MIN_REQUESTS, MAX_REQUESTERS);

      const presidentRole = createTeamRole(em, team, 'President', TeamRoleCategory.Directors, tenant);
      const treasurerRole = createTeamRole(em, team, 'Treasurer', TeamRoleCategory.Directors, tenant);
      const secretaryRole = createTeamRole(em, team, 'Secretary', TeamRoleCategory.Directors, tenant);
      const managerRole = createTeamRole(em, team, 'Manager', TeamRoleCategory.Managers, tenant);
      const memberRole = createTeamRole(em, team, 'Member', TeamRoleCategory.Members, tenant);

      const [managers, rest] = randomFromArrayWithRemainder(students, 4);
      const [president, treasurer, secretary, manager] = managers;

      const [members, others] = randomFromArrayWithRemainder(rest, N_MEMBERS);

      const teamMembers = [
        createTeamMember(em, team, president, [presidentRole]),
        createTeamMember(em, team, treasurer, [treasurerRole]),
        createTeamMember(em, team, secretary, [secretaryRole]),
        createTeamMember(em, team, manager, [managerRole]),
        ...members.map((user) => createTeamMember(em, team, user, [memberRole])),
      ];

      const requesters = randomFromArray(others, N_REQUESTERS);
      const requesterInstances = requesters.map((user) =>
        em.create(TeamJoin, {
          createdAt: new Date(),
          updatedAt: new Date(),
          tenant: team.tenant,
          team,
          joinKind: JoinKind.TeamJoin,
          askedRole: memberRole,
          joiner: user,
          issuer: Math.random() > 0.5 ? pickOneFromArray(managers) : undefined,
          state: JoinState.Pending,
        })
      );

      // eslint-disable-next-line no-await-in-loop
      const N_EVENTS = randomInt(seedingConfig.MIN_EVENTS_BY_CLUB, seedingConfig.MAX_EVENTS_BY_CLUB);
      const events = new EventSeeder(em, team, approvalSteps, teamMembers).create(N_EVENTS);

      teamPromises.push(
        em.persistAndFlush([...teamMembers, presidentRole, treasurerRole, secretaryRole, managerRole, memberRole]),
        em.persistAndFlush(requesterInstances),
        events
      );
      // const eventRegistrations: Record<number, EventJoin[]> = {};
      // Generate Registrations
      // for (const event of events) {
      //   eventRegistrations[event.id] = randomFromArray(students, 4, Math.min(students.length, 50)).map((user) => {
      //     const status = randomEnum(EventRegistrationStatus);
      //     const present =
      //       status === EventRegistrationStatus.Maybe || status === EventRegistrationStatus.Sure
      //         ? Math.random() > 0.5
      //         : false;
      //     const activityScore = present ? randomInt(0, 10) : 0;
      //     return em.create(EventRegistration, {
      //       createdAt,
      //       updatedAt,
      //       event,
      //       user,
      //       status,
      //       present,
      //       activityScore,
      //     });
      //   });
      // }
      // // eslint-disable-next-line no-await-in-loop
      // const transactions = await new TeamFinanceFactory(em, team, events, teamMembers, eventRegistrations).create(
      //   randomInt(5, 100)
      // );
      // for (const transaction of transactions) {
      //   if (Math.random() > 0.5) {
      //     const url = seedingConfig.EXAMPLE_RECEIPT_URL;
      //     const file = em.create(FileUpload, {
      //       id: nanoid(64),
      //       createdAt,
      //       updatedAt,
      //       name: 'exemple_facture',
      //       fileLastModifiedAt: createdAt,
      //       kind: FileKind.TeamReceipt,
      //       mimeType: 'application/pdf',
      //       size: 2000,
      //       url,
      //       user: transaction.createdBy,
      //       height: null,
      //       width: null,
      //     });
      //     transaction.receipt = file;
      //   }
      // }
    }

    await Promise.all(teamPromises);
  }
}
