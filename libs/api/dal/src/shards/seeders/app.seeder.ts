/* eslint-disable object-curly-newline */
import { EventApprovalStepSeeder } from './factories/approval-step.seeder';
import { EventSeeder } from './factories/event.seeder';
import { UserSeeder } from './factories/user.seeder';
import { TagSeeder } from './factories/tag.seeder';
import { clubDefaultRoles } from '../../defaults/default-team-roles';
import { Shortcut } from '../../resources/actor/shortcut/shortcut.entity';
import { TeamMember } from '../../resources/membership/team-member/team-member.entity';
import { Tenant } from '../../resources/org/tenant/tenant.entity';
import { TeamRole } from '../../resources/role/team-role/team-role.entity';
import { getTeamJoinDescription, TeamJoin } from '../../resources/join/team-join/team-join.entity';
import { EventJoin, getEventJoinDescription } from '../../resources/join/event-join/event-join.entity';
import { TeamAction } from '../../resources/manage-team/team-action/team-action.entity';
import { TeamCategory } from '../../resources/label/team-category/team-category.entity';

import { FormSubmission } from '../../resources/ugc/form-submission/form-submission.entity';
import { defaultTeamJoinForm } from '../../resources/org/team/team.entity';
import { Team } from '../../resources/org/team/team.entity';
import { Project } from '../../resources/manage-team/project/project.entity';
import { ProjectRole } from '../../resources/role/project-role/project-role.entity';
import { EventRole } from '../../resources/role/event-role/event-role.entity';
import {
  Colors,
  ControlType,
  JoinKind,
  ApprovalState,
  MembershipKind,
  RegistrationStatus,
  ScopeRole,
  ShortcutType,
  TeamType,
} from '@okampus/shared/enums';
import {
  pickOneFromArray,
  randomEnum,
  randomFromArray,
  randomFromArrayWithRemainder,
  randomInt,
  toSlug,
} from '@okampus/shared/utils';

import { faker } from '@faker-js/faker';
import { Seeder } from '@mikro-orm/seeder';
import { ConsoleLogger } from '@nestjs/common';
import { hash } from 'argon2';

import type { FormEdit } from '../../resources/edit/form-edit/form-edit.entity';
import type { EntityManager } from '@mikro-orm/core';
import type { EventApprovalStep } from '../../resources/manage-tenant/event-approval-step/event-approval-step.entity';
import type { Individual } from '../../resources/actor/individual/individual.entity';
import type { User } from '../../resources/actor/user/user.entity';
import type { TenantCore } from '../../resources/org/tenant/tenant-core.entity';

const seedingConfig = {
  N_ADMINS: 10,
  N_STUDENTS: 100,
  N_TEACHERS: 10,

  N_TEAMS: 30,

  N_APPROVAL_STEPS: 3,
  MIN_ADMINS_BY_STEP: 1,
  MAX_ADMINS_BY_STEP: 3,

  MIN_MEMBERS: 5,
  MAX_MEMBERS: 10,

  MIN_REQUESTS: 3,
  MAX_REQUESTS: 10,

  MIN_PROJECTS_BY_TEAM: 1,
  MAX_PROJECTS_BY_TEAM: 3,

  MIN_EVENTS_BY_PROJECT: 1,
  MAX_EVENTS_BY_PROJECT: 4,

  DEFAULT_CATEGORIES: [
    { name: 'Art/Savoir-faire', slug: 'arts', color: Colors.DarkPurple },
    { name: 'Sport', slug: 'sports', color: Colors.DeepRed },
    { name: 'Jeux', slug: 'games', color: Colors.Black },
    { name: 'Compétition inter-école', slug: 'competition', color: Colors.LightPurple },
    { name: 'Événementiel', slug: 'events', color: Colors.Lime },
    { name: 'Projets encadrés', slug: 'projects', color: Colors.Turquoise },
    { name: 'Formation', slug: 'learning', color: Colors.DeepGreen },
    { name: 'Solidarité', slug: 'solidarity', color: Colors.LightGreen },
  ],

  MIN_TAGS: 6,
  MAX_TAGS: 20,

  EXAMPLE_RECEIPT_URL: 'https://bucket-team-receipts.okampus.fr/facture_exemple.pdf',
};

async function createEventApprovalStep(
  em: EntityManager,
  validators: User[],
  tenant: Tenant,
  order: number,
  createdBy: Individual | null
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

function randomProjectRole(project: Project, tenant: TenantCore): ProjectRole {
  return new ProjectRole({
    name: faker.name.jobTitle(),
    color: randomEnum(Colors),
    description: faker.lorem.paragraph(),
    rewardMinimum: 1,
    rewardMaximum: 10,
    project,
    createdBy: project.createdBy,
    tenant,
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

    const tenantOrg = await em.findOneOrFail(
      Tenant,
      { tenant: { domain: DatabaseSeeder.targetTenant } },
      { populate: ['actor', 'tenant'] }
    );
    const tenant = tenantOrg.tenant;

    this.logger.log(`Seeding tenant ${tenant.name}`);

    const admins = await new UserSeeder(em, tenantOrg, ScopeRole.Admin, passwordHash).create(seedingConfig.N_ADMINS);
    const students = await new UserSeeder(em, tenantOrg, ScopeRole.Student, passwordHash).create(
      seedingConfig.N_STUDENTS
    );

    let restAdmins = admins;
    let stepAdmins: User[];

    const approvalStepsPromises = [];
    for (let i = 0; i < seedingConfig.N_APPROVAL_STEPS; i++) {
      const nStepAdmins = randomInt(seedingConfig.MIN_ADMINS_BY_STEP, seedingConfig.MAX_ADMINS_BY_STEP);
      [stepAdmins, restAdmins] = randomFromArrayWithRemainder(restAdmins, nStepAdmins);
      approvalStepsPromises.push(createEventApprovalStep(em, stepAdmins, tenantOrg, i + 1, stepAdmins[0]));
    }

    const approvalSteps = await Promise.all(approvalStepsPromises);

    const categories = seedingConfig.DEFAULT_CATEGORIES.map(
      (category) => new TeamCategory({ ...category, tenant, createdBy: null })
    );

    const tags = await new TagSeeder(em, tenantOrg).create(randomInt(seedingConfig.MIN_TAGS, seedingConfig.MAX_TAGS));

    const createTeams = [];
    for (const _ of Array.from({ length: seedingConfig.N_TEAMS })) {
      const name = faker.company.name();
      const joinForm = defaultTeamJoinForm(name, tenant, null); // TODO: find alternative to flushing in advance
      await em.persistAndFlush(joinForm);

      createTeams.push(async () => {
        // TODO: reuse TeamSeeder
        const team = new Team({
          name,
          joinForm,
          bio: faker.lorem.paragraph(randomInt(2, 12)),
          categories: randomFromArray(categories, 1, 3),
          currentFinance: 0,
          primaryEmail: `${toSlug(name)}@${tenant.domain}.fr`,
          slug: toSlug(name),
          tagline: faker.company.catchPhrase(),
          tags: randomFromArray(tags, 2, 10),
          type: TeamType.Club,
          createdBy: null,
          tenant,
        });
        await em.persistAndFlush(team);
        return team;
      });
    }

    const teams = await Promise.all(createTeams.map((createTeam) => createTeam()));
    const teamPromises = [];

    const MAX_MEMBERS = Math.min(students.length - 4, seedingConfig.MAX_MEMBERS);
    for (const team of teams) {
      const N_MEMBERS = randomInt(seedingConfig.MIN_MEMBERS, MAX_MEMBERS);
      const MAX_REQUESTERS = Math.min(students.length - 4 - N_MEMBERS, seedingConfig.MAX_REQUESTS);
      const N_REQUESTERS = randomInt(seedingConfig.MIN_REQUESTS, MAX_REQUESTERS);

      const roles = clubDefaultRoles.map(
        (role) => new TeamRole({ ...role, team, tenant: team.tenant, createdBy: null })
      );

      const [managers, rest] = randomFromArrayWithRemainder(students, 5);
      const [president, treasurer, secretary, eventManager, staffManager] = managers;

      const [members, others] = randomFromArrayWithRemainder(rest, N_MEMBERS);

      const teamMembersMap = {
        [president.id]: createTeamMember(createdAt, em, team, president, [roles[0]]),
        [treasurer.id]: createTeamMember(createdAt, em, team, treasurer, [roles[1]]),
        [secretary.id]: createTeamMember(createdAt, em, team, secretary, [roles[2]]),
        [eventManager.id]: createTeamMember(createdAt, em, team, eventManager, [roles[3]]),
        [staffManager.id]: createTeamMember(createdAt, em, team, staffManager, [roles[4]]),
        ...Object.fromEntries(
          members.map((user) => [user.id, createTeamMember(createdAt, em, team, user, [roles[5]])])
        ),
      };

      const teamMembers = Object.values(teamMembersMap);

      for (const member of teamMembers) {
        const shortcut = new Shortcut({
          type: ShortcutType.Team,
          targetActor: team.actor,
          user: member.user,
          createdBy: null,
          tenant,
        });
        member.user.shortcuts.add(shortcut);
      }

      const requesters = randomFromArray(others, N_REQUESTERS);

      const linkedFormEdit = team.joinForm.edits.getItems()[0] as FormEdit;
      const teamJoins = requesters.map((user) =>
        em.create(TeamJoin, {
          createdAt,
          updatedAt: createdAt,
          team,
          joinKind: JoinKind.TeamJoin,
          askedRole: roles[5],
          joiner: user,
          state: ApprovalState.Pending,
          formSubmission: new FormSubmission({
            description: getTeamJoinDescription(null, user, roles[5], team),
            submission: [
              {
                label: 'Motivation',
                fieldName: 'motivation',
                inputType: ControlType.Text,
                value: faker.lorem.lines(4),
              },
            ],
            linkedFormEdit,
            createdBy: user,
            tenant,
          }),
          createdBy: Math.random() > 0.5 ? pickOneFromArray(managers) : user,
          tenant,
        })
      );

      teamPromises.push(em.persistAndFlush([...roles, ...teamMembers]), em.persistAndFlush(teamJoins));

      const N_PROJECTS = randomInt(seedingConfig.MIN_PROJECTS_BY_TEAM, seedingConfig.MAX_PROJECTS_BY_TEAM);
      for (const _ of Array.from({ length: N_PROJECTS })) {
        const project = new Project({
          name: faker.company.catchPhrase(),
          description: faker.lorem.paragraph(randomInt(2, 12)),
          supervisors: randomFromArray(teamMembers, 1, 3),
          expectedBudget: randomInt(100, 1000),
          isPrivate: Math.random() > 0.5,
          team,
          createdBy: pickOneFromArray(managers),
          tenant,
        });

        project.roles.add(Array.from({ length: randomInt(0, 3) }).map(() => randomProjectRole(project, tenant)));

        const N_EVENTS = randomInt(seedingConfig.MIN_EVENTS_BY_PROJECT, seedingConfig.MAX_EVENTS_BY_PROJECT);
        const events = new EventSeeder(em, team, project, approvalSteps, teamMembers)
          .create(N_EVENTS)
          .then((events) => {
            const eventJoins: EventJoin[] = [];
            for (const event of events) {
              event.roles.add(
                project.roles.getItems().map(
                  (projectRole) =>
                    new EventRole({
                      name: projectRole.name,
                      description: projectRole.description,
                      color: projectRole.color,
                      createdBy: projectRole.createdBy,
                      event,
                      linkedProjectRole: projectRole,
                      rewardMinimum: projectRole.rewardMinimum,
                      rewardMaximum: projectRole.rewardMaximum,
                      autoAccept: projectRole.autoAccept,
                      tenant,
                    })
                )
              );

              // Generate event registrations
              eventJoins.push(
                ...randomFromArray(students, 4, Math.min(students.length, 5)).map((user) => {
                  const status = randomEnum(RegistrationStatus);
                  const participated =
                    status === RegistrationStatus.Maybe || status === RegistrationStatus.Sure
                      ? Math.random() > 0.5
                      : false;

                  const teamAction =
                    participated && event.rootContent.representingOrgs
                      ? new TeamAction({
                          createdBy: event.supervisor,
                          name: `Participation à l'événement ${event.title}`,
                          score: randomInt(1, 10),
                          team,
                          tenant: team.tenant,
                          user,
                          teamMember: teamMembersMap[user.id] ?? null,
                          validatedBy: teamMembersMap[event.supervisor.id],
                          state: ApprovalState.Approved,
                        })
                      : null;

                  const linkedFormEdit = event.joinForm.edits.getItems()[0] as FormEdit;
                  return em.create(EventJoin, {
                    createdAt,
                    updatedAt: createdAt,
                    linkedEvent: event,
                    formSubmission: new FormSubmission({
                      description: getEventJoinDescription(null, user, event),
                      submission: [
                        {
                          label: 'Motivation',
                          fieldName: 'motivation',
                          inputType: ControlType.Text,
                          value: faker.lorem.lines(4),
                        },
                      ],
                      linkedFormEdit,
                      createdBy: user,
                      tenant: team.tenant,
                    }),
                    joiner: user,
                    presenceStatus: status,
                    participated,
                    teamAction,
                    joinKind: JoinKind.EventJoin,
                    state: ApprovalState.Approved,
                    createdBy: user,
                    tenant: team.tenant,
                  });
                })
              );

              for (const eventRole of event.roles.getItems()) {
                if (Math.random() > 0.5) {
                  const eventJoin = pickOneFromArray(eventJoins);
                  if (!eventJoin.eventRole) {
                    eventRole.user = eventJoin.joiner;
                    eventJoin.eventRole = eventRole;
                  }
                }
              }
            }

            return em.persistAndFlush([...events, ...eventJoins]);
          });

        teamPromises.push(events);
      }

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
