/* eslint-disable object-curly-newline */
import { EventApprovalStepSeeder } from './factories/approval-step.seeder';
import { EventSeeder } from './factories/event.seeder';
import { TeamSeeder } from './factories/team.seeder';
import { UserSeeder } from './factories/user.seeder';
import { clubDefaultRoles } from '../../defaults/default-team-roles';
import { Shortcut } from '../../resources/actor/shortcut/shortcut.entity';
import { TeamMember } from '../../resources/membership/team-member/team-member.entity';
import { Tenant } from '../../resources/org/tenant/tenant.entity';
import { TeamRole } from '../../resources/role/team-role/team-role.entity';
import { TeamJoin } from '../../resources/join/team-join/team-join.entity';
import { EventJoin } from '../../resources/join/event-join/event-join.entity';
import { TeamAction } from '../../resources/manage-team/team-action/team-action.entity';

import {
  ApprovalState,
  JoinKind,
  JoinState,
  MembershipKind,
  RegistrationStatus,
  ScopeRole,
  ShortcutType,
} from '@okampus/shared/enums';
import { pickOneFromArray, randomEnum, randomFromArray, randomFromArrayWithRemainder } from '@okampus/shared/utils';

import { Seeder } from '@mikro-orm/seeder';
import { ConsoleLogger } from '@nestjs/common';
import { hash } from 'argon2';
import { randomInt } from 'node:crypto';

import type { EntityManager } from '@mikro-orm/core';
import type { Individual } from '../../resources/actor/individual/individual.entity';
import type { User } from '../../resources/actor/user/user.entity';
import type { EventApprovalStep } from '../../resources/manage-tenant/event-approval-step/event-approval-step.entity';
import type { Team } from '../../resources/org/team/team.entity';

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

// TODO: add custom TeamRole for testing
// function createTeamRole(
//   em: EntityManager,
//   team: Team,
//   name: string,
//   category: TeamRoleCategory,
//   tenant: Tenant
// ): TeamRole {
//   return em.create(TeamRole, {
//     createdAt,
//     updatedAt: createdAt,
//     tenant,
//     team,
//     roleKind: RoleKind.TeamRole,
//     required: category === TeamRoleCategory.Directors,
//     name,
//     color: Colors.Blue,
//     category,
//     permissions:
//       category === TeamRoleCategory.Directors
//         ? [TeamPermissions.Admin]
//         : category === TeamRoleCategory.Managers
//         ? [
//             TeamPermissions.ManageEvents,
//             TeamPermissions.ViewRequests,
//             TeamPermissions.ManageRequests,
//             TeamPermissions.ViewDraftEvents,
//           ]
//         : [],
//   });
// }

function createTeamMember(createdAt: Date, em: EntityManager, team: Team, user: User, roles: TeamRole[]) {
  return em.create(TeamMember, {
    createdAt,
    updatedAt: createdAt,
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
  public static pepper: Buffer;
  public static targetTenant: string;

  private readonly logger = new ConsoleLogger('Seeder');

  public async run(em: EntityManager): Promise<void> {
    const createdAt = new Date();
    const passwordHash = await hash('root', { secret: DatabaseSeeder.pepper });

    const tenant = await em.findOneOrFail(
      Tenant,
      { tenant: { domain: DatabaseSeeder.targetTenant } },
      { populate: ['actor', 'tenant'] }
    );
    this.logger.log(`Seeding tenant ${tenant.actor.name}`);

    const admins = await new UserSeeder(em, tenant, ScopeRole.Admin, passwordHash).create(seedingConfig.N_ADMINS);
    const students = await new UserSeeder(em, tenant, ScopeRole.Student, passwordHash).create(seedingConfig.N_STUDENTS);

    let restAdmins = admins;
    let stepAdmins: User[];

    const approvalStepsPromises = [];
    for (let i = 0; i < seedingConfig.N_APPROVAL_STEPS; i++) {
      const nStepAdmins = randomInt(seedingConfig.MIN_ADMINS_BY_STEP, seedingConfig.MAX_ADMINS_BY_STEP);
      [stepAdmins, restAdmins] = randomFromArrayWithRemainder(restAdmins, nStepAdmins);
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

      const roles = clubDefaultRoles.map((role) => new TeamRole({ ...role, team, tenant: team.tenant }));

      const [managers, rest] = randomFromArrayWithRemainder(students, 5);
      const [president, treasurer, secretary, eventManager, staffManager] = managers;

      const [members, others] = randomFromArrayWithRemainder(rest, N_MEMBERS);

      const teamMembers = {
        [president.id]: createTeamMember(createdAt, em, team, president, [roles[0]]),
        [treasurer.id]: createTeamMember(createdAt, em, team, treasurer, [roles[1]]),
        [secretary.id]: createTeamMember(createdAt, em, team, secretary, [roles[2]]),
        [eventManager.id]: createTeamMember(createdAt, em, team, eventManager, [roles[3]]),
        [staffManager.id]: createTeamMember(createdAt, em, team, staffManager, [roles[4]]),
        ...Object.fromEntries(
          members.map((user) => [user.id, createTeamMember(createdAt, em, team, user, [roles[5]])])
        ),
      };

      for (const member of Object.values(teamMembers)) {
        member.user.shortcuts.add(
          new Shortcut({ type: ShortcutType.TeamManage, targetActor: team.actor, user: member.user })
        );
      }

      const requesters = randomFromArray(others, N_REQUESTERS);
      const requesterInstances = requesters.map((user) =>
        em.create(TeamJoin, {
          createdAt,
          updatedAt: createdAt,
          tenant: team.tenant,
          team,
          joinKind: JoinKind.TeamJoin,
          askedRole: roles[5],
          joiner: user,
          issuer: Math.random() > 0.5 ? pickOneFromArray(managers) : undefined,
          state: JoinState.Pending,
        })
      );

      // eslint-disable-next-line no-await-in-loop
      const N_EVENTS = randomInt(seedingConfig.MIN_EVENTS_BY_CLUB, seedingConfig.MAX_EVENTS_BY_CLUB);
      const events = new EventSeeder(em, team, approvalSteps, Object.values(teamMembers))
        .create(N_EVENTS)
        .then((events) => {
          const eventJoins: EventJoin[] = [];
          for (const event of events) {
            // Generate Registrations
            eventJoins.push(
              ...randomFromArray(students, 4, Math.min(students.length, 50)).map((user) => {
                const status = randomEnum(RegistrationStatus);
                const participated =
                  status === RegistrationStatus.Maybe || status === RegistrationStatus.Sure
                    ? Math.random() > 0.5
                    : false;
                const teamAction = participated
                  ? new TeamAction({
                      createdBy: event.supervisor,
                      name: `Participation à l'événement ${event.title}`,
                      score: randomInt(1, 10),
                      team: event.rootContent.representingOrg as Team,
                      tenant: team.tenant,
                      user,
                      teamMember: teamMembers[user.id] ?? null,
                      validatedBy: teamMembers[event.supervisor.id],
                      state: ApprovalState.Approved,
                    })
                  : null;

                return em.create(EventJoin, {
                  createdAt,
                  updatedAt: createdAt,
                  event,
                  issuer: user,
                  joiner: user,
                  presenceStatus: status,
                  participated,
                  teamAction,
                  joinKind: JoinKind.EventJoin,
                  state: JoinState.Approved,
                  tenant: team.tenant,
                });
              })
            );
          }

          return em.persistAndFlush([...events, ...eventJoins]);
        });

      teamPromises.push(
        em.persistAndFlush([...roles, ...Object.values(teamMembers)]),
        em.persistAndFlush(requesterInstances),
        events
      );

      // TODO: add transactions w/ receipts
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
      //       updatedAt: createdAt,
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
