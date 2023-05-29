import '../../vite-imports.d.ts';

import { EventApprovalStepSeeder } from './factories/approval-step.seeder';
import { EventSeeder } from './factories/event.seeder';
import { UserSeeder } from './factories/user.seeder';

import {
  clubDefaultRoles,
  Campus,
  EventJoin,
  EventRole,
  FormSubmission,
  Project,
  ProjectRole,
  Shortcut,
  Team,
  Action,
  TeamJoin,
  TeamFinance,
  TeamMember,
  Role,
  Tenant,
  Tag,
  ChangeRole,
  Pole,
  EventChangeRole,
  ActorAddress,
  EventAttendance,
  Social,
  ActorImage,
} from '@okampus/api/dal';
import { Countries } from '@okampus/shared/consts';
import {
  Colors,
  ApprovalState,
  AttendanceStatus,
  ScopeRole,
  ShortcutType,
  TeamType,
  PaymentMethod,
  FinanceCategory,
  FinanceState,
  Buckets,
  TagType,
  PoleCategory,
  AttendanceConfirmedVia,
  ActorImageType,
} from '@okampus/shared/enums';
import {
  pickOneFromArray,
  randomEnum,
  randomFromArray,
  randomFromArrayWithRemainder,
  randomInt,
  toSlug,
} from '@okampus/shared/utils';

import { faker } from '@faker-js/faker/locale/fr';
import { Seeder } from '@mikro-orm/seeder';
import { ConsoleLogger } from '@nestjs/common';
import { hash } from 'argon2';
import { nanoid } from 'nanoid';
import YAML from 'yaml';

import { readFile as readFileAsync, stat } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { UploadsService } from '../../features/uploads/uploads.service.js';
import type { EntityManager } from '@mikro-orm/core';
import type { SocialType } from '@okampus/shared/enums';
import type { Individual, EventApprovalStep, FormEdit, UserInfo, BaseEntity, Actor } from '@okampus/api/dal';

const seederFolder = typeof __dirname === 'undefined' ? dirname(fileURLToPath(import.meta.url)) : __dirname;

const seedingConfig = {
  N_ADMINS: 10,
  N_STUDENTS: 150,
  N_TEACHERS: 10,

  N_TEAMS: 12,

  N_APPROVAL_STEPS: 3,
  MIN_ADMINS_BY_STEP: 1,
  MAX_ADMINS_BY_STEP: 3,

  MIN_MEMBERS: 3,
  MAX_MEMBERS: 7,

  MIN_REQUESTS: 2,
  MAX_REQUESTS: 5,

  MIN_PROJECTS_BY_TEAM: 1,
  MAX_PROJECTS_BY_TEAM: 2,

  MIN_EVENTS_BY_PROJECT: 1,
  MAX_EVENTS_BY_PROJECT: 3,

  DEFAULT_CATEGORIES: [
    { name: 'Arts', slug: 'arts', color: Colors.LightBlue, icon: 'arts.webp' }, //
    { name: 'Culture et loisirs', slug: 'culture', color: Colors.LightRed, icon: 'culture.webp' }, //
    { name: 'Événementiel', slug: 'events', color: Colors.Turquoise, icon: 'events.webp' }, //
    { name: 'Humanitaire', slug: 'humanitarian', color: Colors.Blue, icon: 'humanitarian.webp' }, //
    { name: 'International', slug: 'international', color: Colors.Indigo, icon: 'international.webp' }, //
    { name: 'Professionnel', slug: 'professional', color: Colors.Cyan, icon: 'professional.webp' }, //
    { name: 'Sport', slug: 'sports', color: Colors.Green, icon: 'sports.webp' }, //
    { name: 'Technologie', slug: 'technology', color: Colors.DarkPurple, icon: 'technology.webp' }, //
  ],

  MIN_TAGS: 6,
  MAX_TAGS: 20,
};

export async function readFile(path: string) {
  if (!(await stat(path).catch(() => false))) return null;
  return await readFileAsync(path);
}

export async function readYaml(path: string) {
  try {
    const data = await readFile(path);
    if (!data) return null;
    return YAML.parse(data.toString());
  } catch {
    return null;
  }
}

async function createEventApprovalStep(
  em: EntityManager,
  validators: Individual[],
  tenant: Tenant,
  order: number,
  createdBy: Individual | null
): Promise<EventApprovalStep> {
  const step = await new EventApprovalStepSeeder(em, tenant, order, createdBy).createOne();
  step.validators.add(validators);
  return step;
}

const potentialRoles = [
  'Responsable de vestiaire',
  'Responsable de la sécurité',
  "Responsable d'entrée",
  "Aide à l'organisation",
  "Aide à l'animation",
];
function randomProjectRole(project: Project, tenant: Tenant): ProjectRole {
  return new ProjectRole({
    name: pickOneFromArray(potentialRoles),
    color: randomEnum(Colors),
    description: faker.lorem.paragraph(),
    rewardMinimum: 1,
    rewardMaximum: 10,
    project: project,
    createdBy: project.createdBy,
    tenant,
  });
}

function randomAddress(actor: Actor, tenant: Tenant): ActorAddress {
  return new ActorAddress({
    actor,
    city: faker.address.city(),
    country: Countries.France,
    latitude: Number.parseFloat(faker.address.latitude()),
    longitude: Number.parseFloat(faker.address.longitude()),
    state: faker.address.state(),
    street: faker.address.streetAddress(),
    zip: faker.address.zipCode(),
    name: faker.company.name(),
    createdBy: null,
    tenant,
  });
}

async function readIcon(iconFileName: string) {
  const icon = await readFile(`${seederFolder}/../../../../../assets/src/images/team-category/${iconFileName}`);
  if (!icon) return await readFile(`${seederFolder}/custom/icons/${iconFileName}`);
  return icon;
}

type CategoryData = { name: string; color: Colors; slug?: string; icon?: string };
async function loadCategoriesFromYaml(): Promise<CategoryData[] | null> {
  let categories = await readYaml(`${seederFolder}/custom/categories.yaml`);
  if (!Array.isArray(categories)) return null;

  categories = categories.filter(({ name }) => typeof name === 'string' && name.length > 0);
  if (categories.length === 0) return null;

  return await Promise.all(
    categories.map(async (category: CategoryData) => {
      const color = category.color || randomEnum(Colors);
      const slug =
        typeof category.slug === 'string' && category.slug.length > 0 ? category.slug : toSlug(category.name);
      const icon = category.icon ?? `${slug}.webp`;
      return { name: category.name, slug, color, icon };
    })
  );
}

type SocialData = { pseudo: string; type: SocialType; url: string };
type TeamData = {
  name: string;
  type: TeamType;
  primaryEmail?: string;
  tagline?: string;
  bio?: string;
  categories?: string[];
  socials: SocialData[];
  slug?: string;
  avatar?: Buffer | null;
  parent?: string;
};
function fakeTeamsData(tenant: Tenant, categories: Tag[]): TeamData[] {
  return Array.from({ length: seedingConfig.N_TEAMS }).map(() => {
    const name = faker.company.name();
    return {
      name,
      primaryEmail: `${toSlug(name)}@${tenant.domain}.fr`,
      avatar: null,
      bio: faker.lorem.paragraph(randomInt(2, 12)),
      tags: randomFromArray(categories, 1, 3),
      socials: [],
      slug: toSlug(name),
      tagline: faker.company.catchPhrase(),
      type: TeamType.Association,
    };
  });
}

async function loadTeamsFromYaml(tenant: Tenant, categories: Tag[]): Promise<TeamData[] | null> {
  const seederFolder = typeof __dirname === 'undefined' ? dirname(fileURLToPath(import.meta.url)) : __dirname;

  let teams = await readYaml(`${seederFolder}/custom/teams.yaml`);
  if (!Array.isArray(teams)) return null;

  teams = teams.filter(({ name }) => typeof name === 'string' && name.length > 0);
  if (teams.length === 0) return null;

  return await Promise.all(
    teams.map(async (team: TeamData) => {
      const slug = typeof team.slug === 'string' && team.slug.length > 0 ? team.slug : toSlug(team.name);
      const avatar = await readFile(`${seederFolder}/custom/avatars/${team.name}.webp`);

      const categorySlugs = team.categories && Array.isArray(team.categories) ? team.categories : [];
      const tags = categorySlugs.map((slug) => categories.find((category) => category.slug === slug)).filter(Boolean);
      const tagline = team.tagline ?? '';
      const bio = team.bio ?? '';
      const primaryEmail = team.primaryEmail ?? `${slug}@${tenant.domain}.fr`;
      const socials = team.socials ?? [];
      const type = team.parent ? TeamType.Club : TeamType.Association;

      return { name: team.name, primaryEmail, avatar, bio, tags, slug, tagline, parent: team.parent, socials, type };
    })
  );
}

// TODO: refactor awaits out of loops
export class DatabaseSeeder extends Seeder {
  public static pepper: Buffer;
  public static targetTenant: string;
  public static upload: UploadsService;
  public static admin: Individual;

  private readonly logger = new ConsoleLogger('Seeder');

  public async run(em: EntityManager): Promise<void> {
    const createdAt = new Date();
    const start = new Date('2023-05-01T00:00:00.000Z');

    const password = await hash('root', { secret: DatabaseSeeder.pepper });

    const domain = { domain: DatabaseSeeder.targetTenant };
    const tenant = await em.findOneOrFail(Tenant, domain, { populate: ['team', 'team.actor'] });

    const scopedOptions = { tenant, createdBy: null };
    this.logger.log(`Seeding tenant ${tenant.name}`);

    if (tenant.team) {
      const address = randomAddress(tenant.team.actor, tenant);
      tenant.campus.add(new Campus({ name: 'Campus de Paris', address, ...scopedOptions }));
    }

    const admins = await new UserSeeder(em, tenant, ScopeRole.TenantAdmin, password).create(seedingConfig.N_ADMINS);
    const students = await new UserSeeder(em, tenant, ScopeRole.TenantUser, password).create(seedingConfig.N_STUDENTS);

    let restAdmins = admins;
    let stepAdmins: Individual[];

    const approvalSteps = [];
    for (let i = 0; i < seedingConfig.N_APPROVAL_STEPS; i++) {
      const nStepAdmins = randomInt(seedingConfig.MIN_ADMINS_BY_STEP, seedingConfig.MAX_ADMINS_BY_STEP);
      [stepAdmins, restAdmins] = randomFromArrayWithRemainder(restAdmins, nStepAdmins);
      approvalSteps.push(
        await createEventApprovalStep(em, [DatabaseSeeder.admin, ...stepAdmins], tenant, i + 1, DatabaseSeeder.admin)
      );
      if (i > 0) approvalSteps[i].previousStep = approvalSteps[i - 1];
    }

    const categoriesData = (await loadCategoriesFromYaml()) ?? seedingConfig.DEFAULT_CATEGORIES;
    const categories = await Promise.all(
      categoriesData.map(async ({ icon, name, color, slug }) => {
        const buffer = icon && (await readIcon(icon));

        let image;
        if (buffer) {
          const fileData = { buffer, size: buffer.length, filename: name, encoding: '7bit', mimetype: 'image/webp' };
          const upload = { ...fileData, fieldname: 'iconImage', fileLastModifiedAt: createdAt };

          image = await DatabaseSeeder.upload.createUpload(upload, Buckets.Tenants, scopedOptions);
          await em.persistAndFlush(image);
        }

        this.logger.log(`Uploaded ${name} icon`);
        return new Tag({ color, slug, type: TagType.TeamCategory, name, image, ...scopedOptions });
      })
    );

    this.logger.log('Seeding teams..');
    // const tags = await new TagSeeder(em, tenant).create(randomInt(seedingConfig.MIN_TAGS, seedingConfig.MAX_TAGS));

    const data = await loadTeamsFromYaml(tenant, categories);
    if (!data) throw new Error('No teams found');

    const teamsData = (await loadTeamsFromYaml(tenant, categories)) ?? fakeTeamsData(tenant, categories);
    const teamsWithParent = await Promise.all(
      teamsData.map(async (teamData) => {
        const team = new Team({
          currentFinance: 6000,
          ...teamData,
          managersCategoryName: 'Bureau étendu',
          directorsCategoryName: 'Bureau restreint',
          membersCategoryName: 'Membres',
          parent: null,
          ...scopedOptions,
        });
        team.actor.socials.add(
          teamData.socials.map((social) => new Social({ actor: team.actor, ...social, ...scopedOptions }))
        );

        const description = faker.lorem.paragraph();
        const category = PoleCategory.Administration;
        const pole = new Pole({ name: 'Bureau', description, team: team, required: true, category, ...scopedOptions });
        team.poles.add(pole);

        if (teamData.avatar) {
          const fileData = { buffer: teamData.avatar, size: teamData.avatar.length, filename: `${teamData.name}.webp` };
          const file = { ...fileData, encoding: '7bit', mimetype: 'image/webp', fieldname: teamData.name };
          const image = await DatabaseSeeder.upload.createUpload(file, Buckets.Teams, scopedOptions);

          const type = ActorImageType.Avatar;
          team.actor.actorImages.add(new ActorImage({ actor: team.actor, image, type, ...scopedOptions }));
        }

        const subvention = new TeamFinance({
          team: team,
          amount: 6000,
          address: randomAddress(team.actor, tenant),
          name: 'Subvention 2023',
          payedAt: start,
          method: PaymentMethod.Transfer,
          category: FinanceCategory.Subvention,
          payedBy: pickOneFromArray(admins).actor,
          createdBy: pickOneFromArray(admins),
          state: FinanceState.Completed,
          tenant,
        });

        team.teamFinances.add(subvention);
        // const subventionEdit = new TeamFinanceEdit({
        //   // TODO: automate from teamFinance arg
        //   teamFinance: subvention,
        //   amount: subvention.amount,
        //   name: subvention.name,
        //   payedAt: start,
        //   state: FinanceState.Completed,
        //   createdBy: subvention.createdBy,
        //   addedPayedBy: subvention.payedBy,
        //   addedAddress: subvention.address,
        //   method: subvention.method,
        //   payedByType: subvention.payedByType,
        //   tenant,
        // });

        await em.persistAndFlush([
          team,
          // subventionEdit
        ]);
        return { team, parent: teamData.parent };
      })
    );

    const teams = teamsWithParent.map(({ team, parent }) => {
      if (parent) {
        const parentTeam = teamsWithParent.find(({ team }) => team.actor.slug === parent);
        if (parentTeam) team.parent = parentTeam.team;
      }
      return team;
    });

    // for (const _ of Array.from({ length: seedingConfig.N_TEAMS })) {
    //   const name = faker.company.name();
    //   // const joinForm = defaultTeamJoinForm(name, tenant, null); // TODO: find alternative to flushing in advance
    //   // await em.persistAndFlush(joinForm);

    //   createTeams.push(async () => {
    //     // TODO: reuse TeamSeeder
    //     const team = new Team({
    //       name,
    //       bio: faker.lorem.paragraph(randomInt(2, 12)),
    //       tags: randomFromArray(categories, 1, 3),
    //       currentFinance: 0,
    //       primaryEmail: `${toSlug(name)}@${tenant.domain}.fr`,
    //       slug: toSlug(name),
    //       tagline: faker.company.catchPhrase(),
    //       type: TeamType.Club,
    //       ...tenantOptions,
    //     });

    //     team.poles.add(
    //       new Pole({
    //         name: 'Bureau',
    //         description: faker.lorem.paragraph(),
    //         team: team,
    //         required: true,
    //         category: PoleCategory.Administration,
    //         ...tenantOptions,
    //       })
    //     );

    //     team.currentFinance = 4000;
    //     team.teamFinances.add(
    //       new TeamFinance({
    //         team: team,
    //         amount: 4000,
    //         location: randomAddress(team.actor, tenant),
    //         name: 'Subvention 2023',
    //         payedAt: createdAt,
    //         method: PaymentMethod.Transfer,
    //         category: FinanceCategory.Other,
    //         payedBy: pickOneFromArray(admins).actor,
    //         createdBy: pickOneFromArray(admins),
    //         state: FinanceState.Completed,
    //         tenant,
    //       })
    //     );
    //     await em.persistAndFlush(team);
    //     return team;
    //   });
    // }

    // const teams = await Promise.all(createTeams.map((createTeam) => createTeam()));
    this.logger.log('Teams created...');
    const teamPromises = [];

    const filename = 'receipt-example.pdf';
    const sampleReceiptFile = await readFile(`${seederFolder}/../../../../../assets/src/documents/${filename}`);
    if (!sampleReceiptFile) throw new Error('No example receipt file found.');

    const receiptFileData = { buffer: sampleReceiptFile, size: sampleReceiptFile.length, filename, encoding: '7bit' };
    const sampleReceipt = { ...receiptFileData, mimetype: 'application/pdf', fieldname: 'receipt' };

    const MAX_MEMBERS = Math.min(students.length - 4, seedingConfig.MAX_MEMBERS);
    for (const team of teams) {
      const N_MEMBERS = randomInt(seedingConfig.MIN_MEMBERS, MAX_MEMBERS);
      const N_REQUESTERS = randomInt(
        seedingConfig.MIN_REQUESTS,
        Math.min(students.length - 4 - N_MEMBERS, seedingConfig.MAX_REQUESTS)
      );

      const roles = clubDefaultRoles.map((role) => new Role({ ...role, team, ...scopedOptions }));

      const [managers, rest] = randomFromArrayWithRemainder(students, 5);
      const [members, others] = randomFromArrayWithRemainder(rest, N_MEMBERS);

      const membersMap: { [x: string]: TeamMember } = {};
      const newMember = (user: UserInfo, i: number) =>
        new TeamMember({
          user,
          startDate: new Date(),
          team: team,
          roles: [roles[i]],
          permissions: 0,
          createdBy: user.individual,
          tenant: team.tenant,
        });

      for (const [i, member] of managers.entries()) if (member.user) membersMap[member.id] = newMember(member.user, i);
      for (const member of members) if (member.user) membersMap[member.id] = newMember(member.user, roles.length - 1);

      const teamMembers = Object.values(membersMap);

      for (const member of teamMembers) {
        const userInfo = member.user;
        if (userInfo) {
          userInfo.shortcuts.add(
            new Shortcut({
              type: ShortcutType.Team,
              targetActor: team.actor,
              userInfo,
              createdBy: member.user.individual,
              tenant,
            })
          );
        }
      }

      const requesters = randomFromArray(others, N_REQUESTERS);

      const formEdit = team.joinForm?.formEdits.getItems()[0] ?? null;
      const teamJoins = requesters.flatMap((individual) => {
        if (!individual.user) return [];

        let createdBy;
        let settledBy;
        if (Math.random() > 0.5) {
          createdBy = pickOneFromArray(managers);
          settledBy = individual;
        } else {
          createdBy = individual;
          settledBy = pickOneFromArray(managers);
        }

        const teamJoin = new TeamJoin({
          team: team,
          askedRole: roles[5],
          joiner: individual.user,
          state: ApprovalState.Pending,
          formSubmission: formEdit
            ? new FormSubmission({
                submission: { motivation: faker.lorem.lines(4) },
                formEdit,
                createdBy: individual,
                tenant,
              })
            : null,
          createdBy,
          tenant,
        });

        const changeRole = new ChangeRole({
          team: team,
          user: individual.user,
          teamJoin: teamJoin,
          receivedRole: roles[5],
          receivedPole: team.poles.getItems()[0],
          createdBy: settledBy,
          tenant,
        });

        return [teamJoin, changeRole];
      });

      teamPromises.push(em.persistAndFlush([...roles, ...teamMembers]), em.persistAndFlush(teamJoins));

      const projectNames = ['Activité hebdomadaire', 'Échanges & rencontres', 'Séances de découverte'];

      const N_PROJECTS = randomInt(seedingConfig.MIN_PROJECTS_BY_TEAM, seedingConfig.MAX_PROJECTS_BY_TEAM);
      for (const i of Array.from({ length: N_PROJECTS }, (_, i) => i)) {
        const projectName = projectNames[i];

        const project = new Project({
          name: projectName,
          slug: toSlug(`${projectName}-${nanoid(6)}`),
          description: faker.lorem.paragraph(randomInt(2, 12)),
          supervisors: randomFromArray(teamMembers, 1, 3),
          expectedBudget: randomInt(9000, 20_000) / 10,
          isPrivate: Math.random() > 0.5,
          team,
          createdBy: pickOneFromArray(managers),
          tenant,
        });

        project.roles.add(Array.from({ length: randomInt(0, 5) }).map(() => randomProjectRole(project, tenant)));

        // Add random project actions
        for (const _ of Array.from({ length: randomInt(2, 10) })) {
          const user = pickOneFromArray(teamMembers).user;
          const action = new Action({
            project,
            team,
            user,
            score: randomInt(1, 5),
            state: ApprovalState.Approved,
            validatedBy: pickOneFromArray(managers),
            name: pickOneFromArray(potentialRoles),
            description: faker.lorem.paragraph(randomInt(2, 12)),
            createdBy: user.individual,
            tenant,
          });

          teamPromises.push(em.persistAndFlush(action));
        }

        const N_EVENTS = randomInt(seedingConfig.MIN_EVENTS_BY_PROJECT, seedingConfig.MAX_EVENTS_BY_PROJECT);
        const events = new EventSeeder(em, team, project, approvalSteps, teamMembers)
          .create(N_EVENTS)
          .then(async (events) => {
            events = events.map((event, i) => {
              if (event.contentMaster) {
                event.contentMaster.name = `${project.name} #${i + 1}`;
                event.contentMaster.slug = toSlug(`${event.contentMaster.name}`);
              }
              return event;
            });

            team.events.add(events);

            const finances = await Promise.all(
              Array.from({ length: randomInt(4, 10) }).map(async () => {
                const amount = randomInt(500, 20_000) / 100;
                team.currentFinance -= amount;
                project.actualBudget -= amount;

                let upload;
                if (Math.random() > 0.92)
                  upload = await DatabaseSeeder.upload.createUpload(sampleReceipt, Buckets.Receipts, scopedOptions);

                const event = pickOneFromArray(events);
                const category = randomEnum(FinanceCategory);
                const teamFinance = new TeamFinance({
                  team,
                  event,
                  project,
                  address: randomAddress(team.actor, tenant),
                  amount: -amount,
                  name: faker.lorem.words(3),
                  category: category === FinanceCategory.Subvention ? FinanceCategory.Other : category,
                  payedBy: pickOneFromArray(teamMembers).user.individual.actor,
                  createdBy: pickOneFromArray(teamMembers).user.individual,
                  payedAt: faker.date.between(start, createdAt),
                  method: randomEnum(PaymentMethod),
                  state: FinanceState.Completed,
                  tenant,
                  receipt: upload ?? undefined,
                });

                // const teamFinanceEdit = new TeamFinanceEdit({
                //   teamFinance,
                //   name: teamFinance.name,
                //   method: teamFinance.method,
                //   addedAddress: teamFinance.address,
                //   addedEvent: teamFinance.event,
                //   addedProject: teamFinance.project,
                //   addedPayedBy: teamFinance.payedBy,
                //   addedReceipt: teamFinance.receipt,
                //   createdBy: teamFinance.createdBy,
                //   tenant,
                // });

                // await em.persistAndFlush(teamFinanceEdit);

                return teamFinance;
              })
            );

            teamPromises.push(em.persistAndFlush(finances));

            const eventJoins = [];
            for (const event of events) {
              event.roles.add(
                project.roles.getItems().map(
                  (projectRole) =>
                    new EventRole({
                      name: projectRole.name,
                      description: projectRole.description,
                      color: projectRole.color,
                      event: event,
                      projectRole: projectRole,
                      rewardMinimum: projectRole.rewardMinimum,
                      rewardMaximum: projectRole.rewardMaximum,
                      autoAccept: projectRole.autoAccept,
                      createdBy: projectRole.createdBy,
                      tenant,
                    })
                )
              );

              // Generate event registrations
              eventJoins.push(
                ...randomFromArray([...managers, ...students], 4, 20).flatMap((individual) => {
                  if (!individual.user) return [];

                  const entities: BaseEntity[] = [];

                  const status = randomEnum(AttendanceStatus);
                  const participated = status === AttendanceStatus.Sure ? Math.random() > 0.75 : false;

                  let action = null;
                  if (participated && Math.random() > 0.5) {
                    action = new Action({
                      name: pickOneFromArray(potentialRoles),
                      description: faker.lorem.lines(2),
                      score: randomInt(1, 10),
                      team: team,
                      user: individual.user,
                      validatedBy: event.supervisor.individual,
                      state: ApprovalState.Approved,
                      createdBy: individual,
                      tenant: team.tenant,
                    });
                    entities.push(action);
                  }

                  const eventJoin = new EventJoin({
                    event: event,
                    ...(event.joinForm
                      ? {
                          formSubmission: new FormSubmission({
                            submission: {
                              isPayed: Math.random() > 0.5,
                            },
                            formEdit: event.joinForm.formEdits.getItems()[0] as FormEdit,
                            createdBy: individual,
                            tenant: team.tenant,
                          }),
                        }
                      : {}),
                    joiner: individual.user,
                    attendanceStatus: status,
                    participated,
                    state: ApprovalState.Approved,
                    action,
                    createdBy: individual,
                    tenant: team.tenant,
                  });

                  if (participated) {
                    const attendance = new EventAttendance({
                      confirmedVia: Math.random() > 0.5 ? AttendanceConfirmedVia.QR : AttendanceConfirmedVia.Manual,
                      participated: true,
                      eventJoin,
                      tenant,
                      createdBy: pickOneFromArray([...managers, event.supervisor.individual]),
                    });
                    entities.push(attendance);
                  } else if (status === AttendanceStatus.Sure && Math.random() > 0.5) {
                    const attendance = new EventAttendance({
                      confirmedVia: AttendanceConfirmedVia.Manual,
                      participated: false,
                      eventJoin,
                      tenant,
                      createdBy: pickOneFromArray([...managers, event.supervisor.individual]),
                    });
                    entities.push(attendance);
                  }

                  const role = Math.random() > 0.7 ? event.roles.getItems().find((role) => !role.user) : null;
                  entities.push(
                    eventJoin,
                    new EventChangeRole({
                      event: event,
                      eventJoin: eventJoin,
                      accepted: true,
                      receivedRole: role,
                      createdBy: event.supervisor.individual,
                      tenant,
                    })
                  );

                  return entities;
                })
              );
            }

            return em.persistAndFlush([...events, ...eventJoins]);
          });

        teamPromises.push(events);
        await em.flush();
      }
    }

    await Promise.all(teamPromises);
  }
}
