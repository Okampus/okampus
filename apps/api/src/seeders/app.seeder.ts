import { EventApprovalStepSeeder } from './factories/approval-step.seeder';
import { EventSeeder } from './factories/event.seeder';
import { UserSeeder } from './factories/user.seeder';

import { LegalUnitSeeder } from './factories/legal-unit.seeder';
import { LegalUnitLocationSeeder } from './factories/legal-unit-location.seeder';
import { TagSeeder } from './factories/tag.seeder';

import { rootPath } from '../config.js';
import {
  clubDefaultRoles,
  Campus,
  EventJoin,
  FormSubmission,
  Project,
  Shortcut,
  Team,
  Action,
  TeamJoin,
  Finance,
  TeamMember,
  Role,
  Tenant,
  Tag,
  Pole,
  Address,
  Social,
  ActorImage,
  EventOrganize,
  MissionJoin,
  CampusCluster,
  TenantOrganize,
  TeamHistory,
  Account,
  Bank,
  EventApproval,
  Log,
  Location,
  Mission,
  EventSupervisor,
} from '@okampus/api/dal';
import { Countries } from '@okampus/shared/consts';
import {
  Colors,
  ApprovalState,
  ShortcutType,
  TeamType,
  PaymentMethod,
  FinanceCategory,
  FinanceState,
  Buckets,
  TagType,
  PoleCategory,
  ProcessedVia,
  ActorImageType,
  TeamHistoryEventType,
  ApproximateDate,
  LocationType,
  TenantOrganizeType,
  AccountType,
  LegalUnitType,
  EventState,
  EventContext,
  EventType,
  EntityName,
  TeamRoleType,
} from '@okampus/shared/enums';
import {
  isNotNull,
  pickOneFromArray,
  randomEnum,
  randomFromArray,
  randomFromArrayWithRemainder,
  randomId,
  randomInt,
  range,
  toSlug,
} from '@okampus/shared/utils';

import { faker } from '@faker-js/faker/locale/fr';
import { Seeder } from '@mikro-orm/seeder';
import { ConsoleLogger } from '@nestjs/common';
import { hash } from 'argon2';
import YAML from 'yaml';

import { readFile as readFileAsync, stat } from 'node:fs/promises';
import path from 'node:path';

import type { UploadsService } from '@okampus/api/bll';
import type { EventApprovalStep, Individual, User, BaseEntity } from '@okampus/api/dal';
import type { SocialType } from '@okampus/shared/enums';

import type { EntityManager } from '@mikro-orm/core';

const createdAt = new Date();

const assetsFolder = path.join(rootPath, 'libs', 'assets', 'src');
const customSeederFolder = path.join(rootPath, 'apps', 'api', 'src', 'seeders', 'custom');

const receiptExampleFilename = 'receipt-example.pdf';
const receiptExamplePath = path.join(assetsFolder, 'documents', receiptExampleFilename);

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
  MAX_PROJECTS_BY_TEAM: 3,

  MIN_EVENTS_BY_PROJECT: 1,
  MAX_EVENTS_BY_PROJECT: 4,

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
  createdBy: Individual | null,
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

function randomMission(project: Project, tenant: Tenant): Mission {
  const mission = new Mission({
    name: pickOneFromArray(potentialRoles),
    color: randomEnum(Colors),
    description: faker.lorem.paragraph(),
    pointsMinimum: 1,
    pointsMaximum: 10,
    project: project,
    team: project.team,
    createdBy: project.createdBy,
    tenant,
  });

  mission.createdAt = createdAt;
  return mission;
}

async function readIcon(iconFileName: string) {
  const icon = await readFile(path.join(assetsFolder, 'images', 'team-category', iconFileName));
  if (!icon) return await readFile(path.join(customSeederFolder, 'icons', iconFileName));
  return icon;
}

type CategoryData = { name: string; color: Colors; slug?: string; icon?: string };
async function loadCategoriesFromYaml(): Promise<CategoryData[] | null> {
  let categories = await readYaml(path.join(customSeederFolder, 'categories.yaml'));
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
    }),
  );
}

type SocialData = { pseudo: string; type: SocialType; url: string };
type TeamData = {
  name: string;
  type: TeamType;
  email?: string;
  website?: string;
  status?: string;
  bio?: string;
  categories?: string[];
  socials: SocialData[];
  slug?: string;
  avatar?: Buffer | null;
  parent?: string;
  originalCreationDay?: number;
  originalCreationMonth?: number;
  originalCreationYear?: number;
};
function fakeTeamsData(tenant: Tenant, categories: Tag[]): TeamData[] {
  return Array.from({ length: seedingConfig.N_TEAMS }).map(() => {
    const name = faker.company.name();
    return {
      name,
      email: `${toSlug(name)}@${tenant.domain}.fr`,
      avatar: null,
      bio: faker.lorem.paragraph(randomInt(2, 12)),
      tags: randomFromArray(categories, 1, 3),
      socials: [],
      slug: `${toSlug(name)}-${randomId()}`,
      status: faker.company.catchPhrase(),
      type: TeamType.Association,
    };
  });
}

async function loadTeamsFromYaml(tenant: Tenant, categories: Tag[]): Promise<TeamData[] | null> {
  let teams = await readYaml(path.join(customSeederFolder, 'teams.yaml'));
  if (!Array.isArray(teams)) return null;

  teams = teams.filter(({ name }) => typeof name === 'string' && name.length > 0);
  if (teams.length === 0) return null;

  return await Promise.all(
    teams.map(async (team: TeamData) => {
      const slug = typeof team.slug === 'string' && team.slug.length > 0 ? team.slug : toSlug(team.name);
      const avatar = await readFile(path.join(customSeederFolder, 'avatars', `${team.name}.webp`));

      const originalCreationDay = team.originalCreationDay;
      const originalCreationMonth = team.originalCreationMonth;
      const originalCreationYear = team.originalCreationYear;

      const categorySlugs = team.categories && Array.isArray(team.categories) ? team.categories : [];
      const tags = categorySlugs.map((slug) => categories.find((category) => category.slug === slug)).filter(Boolean);
      const status = team.status ?? '';
      const website = team.website ?? '';
      const bio = team.bio ?? '';
      const email = team.email;
      const socials = team.socials ?? [];
      const type = team.parent ? TeamType.Club : TeamType.Association;

      return {
        name: team.name,
        email,
        avatar,
        bio,
        tags,
        slug,
        status,
        website,
        parent: team.parent,
        socials,
        type,
        originalCreationDay,
        originalCreationMonth,
        originalCreationYear,
      };
    }),
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
    this.logger.log(`Seeding launched for tenant ${DatabaseSeeder.targetTenant}...`);
    this.logger.log(`Custom seeder folder: ${customSeederFolder}, receipt example path: ${receiptExamplePath}`);

    const start = new Date('2023-05-01T00:00:00.000Z');

    const domain = { domain: DatabaseSeeder.targetTenant };
    const tenant = await em.findOneOrFail(Tenant, domain, {
      populate: ['adminTeam', 'eventValidationForm', 'eventApprovalSteps'],
    });

    const scopedOptions = { tenant, createdBy: null };

    const adminTeam = tenant.adminTeam;
    if (!adminTeam?.actor) throw new Error(`Tenant ${tenant.domain} has no admin team`);

    this.logger.log(`Seeding tenant ${adminTeam.actor.name}`);

    const adminPromises = [];

    const campusClusters = [
      new CampusCluster({ name: 'Paris', ...scopedOptions }),
      new CampusCluster({ name: 'BDX', ...scopedOptions }),
    ];

    for (const campusCluster of campusClusters) {
      const campusClusterManageTeam = new Team({
        name: `Campus ${campusCluster.name}`,
        type: TeamType.Department,
        parent: adminTeam,
        ...scopedOptions,
      });

      for (const _ of Array.from({ length: randomInt(1, 3) })) {
        const [streetNumber, ...rest] = faker.location.streetAddress().split(' ');
        const location = new Location({
          type: LocationType.Address,
          actor: campusClusterManageTeam.actor,
          address: new Address({
            city: faker.location.city(),
            country: Countries.France,
            latitude: faker.location.latitude(),
            longitude: faker.location.longitude(),
            state: faker.location.state(),
            streetNumber,
            street: rest.join(' '),
            zip: faker.location.zipCode(),
          }),
          createdBy: null,
          tenant,
        });

        campusCluster.campuses.add(
          new Campus({ name: `Campus ${campusCluster.name}`, location, campusCluster, ...scopedOptions }),
        );
      }

      const tenantManage = new TenantOrganize({
        campusCluster,
        team: campusClusterManageTeam,
        type: TenantOrganizeType.ClusterManager,
        ...scopedOptions,
      });
      adminPromises.push(em.persistAndFlush([campusClusterManageTeam, campusCluster, tenantManage]));
    }

    await Promise.all(adminPromises);

    const password = await hash('root', { secret: DatabaseSeeder.pepper });
    const admins = await new UserSeeder(em, tenant, password).create(seedingConfig.N_ADMINS);
    const students = await new UserSeeder(em, tenant, password).create(seedingConfig.N_STUDENTS);

    const tags = await new TagSeeder(em, tenant).create(randomInt(seedingConfig.MIN_TAGS, seedingConfig.MAX_TAGS));
    const companies = await new LegalUnitSeeder(em, LegalUnitType.Company, tenant, tags).create(20);
    const banks = await new LegalUnitSeeder(em, LegalUnitType.Bank, tenant, tags).create(20);
    const bankLocations = await new LegalUnitLocationSeeder(em, banks, tenant, tags).create(20);

    let restAdmins = admins;
    let stepAdmins: Individual[];

    this.logger.log('Seeding team categories..');

    const approvalSteps: EventApprovalStep[] = [];
    for (let i = 0; i < seedingConfig.N_APPROVAL_STEPS; i++) {
      const nStepAdmins = randomInt(seedingConfig.MIN_ADMINS_BY_STEP, seedingConfig.MAX_ADMINS_BY_STEP);
      [stepAdmins, restAdmins] = randomFromArrayWithRemainder(restAdmins, nStepAdmins);
      approvalSteps.push(
        await createEventApprovalStep(em, [DatabaseSeeder.admin, ...stepAdmins], tenant, i + 1, DatabaseSeeder.admin),
      );
      if (i > 0) approvalSteps[i].previousStep = approvalSteps[i - 1];
    }

    const categoriesData = (await loadCategoriesFromYaml()) ?? seedingConfig.DEFAULT_CATEGORIES;

    const iconConfig = { encoding: '7bit', mimetype: 'image/webp', fieldname: 'icon', fileLastModifiedAt: createdAt };
    const categories = await Promise.all(
      categoriesData.map(async ({ icon, name, color, slug }) => {
        await em.persistAndFlush(new Tag({ color, slug, type: TagType.TeamCategory, name, ...scopedOptions }));

        const tag = await em.findOneOrFail(Tag, { slug });
        const buffer = icon && (await readIcon(icon));

        if (buffer) {
          const file = { ...iconConfig, buffer, size: buffer.length, filename: name };
          const context = { ...scopedOptions, entityName: EntityName.Tag, entityId: tag.id };
          const image = await DatabaseSeeder.upload.createImageUpload(file, Buckets.Thumbnails, context, 200);

          this.logger.log(`Uploaded ${name} icon`);

          tag.image = image;
          await em.persistAndFlush([tag, image]);
        }

        return tag;
      }),
    );

    this.logger.log('Seeding teams..');
    const teamsData = (await loadTeamsFromYaml(tenant, categories)) ?? fakeTeamsData(tenant, categories);
    const teamsWithParent = await Promise.all(
      teamsData.map(async (teamData) => {
        const team = new Team({
          ...teamData,
          managersCategoryName: 'Bureau étendu',
          directorsCategoryName: 'Bureau restreint',
          membersCategoryName: 'Membres',
          parent: null,
          ...scopedOptions,
        });

        if (teamData.originalCreationYear) {
          const originalCreationDate = new Date(
            teamData.originalCreationYear,
            teamData.originalCreationMonth || 0,
            teamData.originalCreationDay || 0,
          );

          let approximateDate;
          if (teamData.originalCreationDay) approximateDate = ApproximateDate.Day;
          else if (teamData.originalCreationMonth) approximateDate = ApproximateDate.Month;
          else approximateDate = ApproximateDate.Year;

          const creation = new TeamHistory({
            team,
            tenant,
            eventType: TeamHistoryEventType.Start,
            approximateDate,
            eventDate: originalCreationDate,
            createdBy: null,
          });

          team.history.add(creation);
        }

        const eventType = TeamHistoryEventType.OkampusStart;
        const approximateDate = ApproximateDate.Exact;

        const teamHistory = { team, tenant, eventType, approximateDate, eventDate: createdAt, createdBy: null };
        team.history.add(new TeamHistory(teamHistory));

        team.actor.socials.add(
          teamData.socials.map((social, order) => {
            const teamSocial = new Social({ actor: team.actor, order, ...social, ...scopedOptions });
            return teamSocial;
          }),
        );

        const description = faker.lorem.paragraph();
        const category = PoleCategory.Administration;
        const pole = new Pole({
          name: 'Bureau',
          description,
          team: team,
          required: true,
          category,
          ...scopedOptions,
        });
        team.poles.add(pole);

        if (teamData.slug !== 'efrei-international' && !teamData.parent) {
          const bankLocation = pickOneFromArray(bankLocations);
          const account = new Account({
            name: 'Compte principal',
            type: AccountType.Primary,
            bank: new Bank({
              bank: bankLocation,
              actor: team.actor,
              bicSwift: faker.finance.bic(),
              iban: `FR76${bankLocation.legalUnit?.bankCode?.toString().padStart(5, '0')}${bankLocation.bankLocationCode
                ?.toString()
                .padStart(5, '0')}${faker.finance.iban().slice(15, 27)}`,
              ...scopedOptions,
            }),
            team,
            ...scopedOptions,
          });

          const admin = pickOneFromArray(admins);
          const subvention = new Finance({
            account,
            team,
            amount: 10_000,
            payedAt: start,
            method: PaymentMethod.Transfer,
            category: FinanceCategory.Subvention,
            payedBy: team.tenantGrantFund ? team.tenantGrantFund.actor : adminTeam.actor,
            initiatedBy: admin,
            receivedBy: team.actor,
            createdBy: admin,
            state: FinanceState.Completed,
            tenant,
          });

          team.finances.add(subvention);
          team.accounts.add(account);

          await em.persistAndFlush([account, subvention]);
        }

        await em.persistAndFlush([team]);
        const createdTeam = await em.findOneOrFail(
          Team,
          { actor: { slug: team.actor.slug } },
          { populate: ['actor', 'actor.actorImages'] },
        );

        if (teamData.avatar) {
          const fileData = { buffer: teamData.avatar, size: teamData.avatar.length, filename: `${teamData.name}.webp` };
          const file = { ...fileData, encoding: '7bit', mimetype: 'image/webp', fieldname: teamData.name };
          const image = await DatabaseSeeder.upload.createUpload(file, Buckets.ActorImages, {
            ...scopedOptions,
            entityName: EntityName.Team,
            entityId: createdTeam.id,
          });

          const type = ActorImageType.Avatar;
          const actorImage = new ActorImage({ actor: createdTeam.actor, image, type, ...scopedOptions });
          createdTeam.actor.actorImages.add(actorImage);
          await em.persistAndFlush([createdTeam, actorImage]);
        }

        return { team, parent: teamData.parent };
      }),
    );

    const teams = teamsWithParent.map(({ team, parent }) => {
      if (parent) {
        const parentTeam = teamsWithParent.find(({ team }) => team.actor.slug === parent);
        if (parentTeam) {
          team.parent = parentTeam.team;
          const account = parentTeam.team.accounts.getItems()[0];

          if (account) {
            const treasurer = parentTeam.team.teamMembers
              .getItems()
              .find(({ teamMemberRoles: roles }) =>
                roles.getItems().some(({ type }) => type === TeamRoleType.Treasurer),
              )?.user;

            const childAccount = new Account({
              name: 'Compte principal',
              type: AccountType.Primary,
              parent: account,
              bank: null,
              team,
              ...scopedOptions,
            });

            account.children.add(childAccount);
            team.finances.add(
              new Finance({
                account: childAccount,
                team,
                amount: 1700,
                payedAt: start,
                method: PaymentMethod.Transfer,
                category: FinanceCategory.Subvention,
                payedBy: parentTeam.team.actor,
                receivedBy: team.actor,
                initiatedBy: treasurer?.individual,
                createdBy: treasurer?.individual,
                state: FinanceState.Completed,
                tenant,
              }),
            );

            team.accounts.add(childAccount);

            parentTeam.team.finances.add(
              new Finance({
                account,
                team: parentTeam.team,
                amount: -1700,
                payedAt: start,
                method: PaymentMethod.Transfer,
                category: FinanceCategory.Subvention,
                payedBy: parentTeam.team.actor,
                initiatedBy: treasurer?.individual,
                receivedBy: team.actor,
                createdBy: parentTeam.team.teamMembers
                  .getItems()
                  .find(({ teamMemberRoles: roles }) =>
                    roles.getItems().some(({ type }) => type === TeamRoleType.Treasurer),
                  )?.user.individual,
                state: FinanceState.Completed,
                tenant,
              }),
            );
          }
        }
      }
      return team;
    });

    this.logger.log('Teams created...');
    const teamPromises = [];

    this.logger.log(`Receipt example path: ${receiptExamplePath}`);
    const receiptExampleFile = await readFile(receiptExamplePath);
    if (!receiptExampleFile) throw new Error('No example receipt file found.');

    const receiptFileData = {
      buffer: receiptExampleFile,
      size: receiptExampleFile.length,
      filename: receiptExampleFilename,
      encoding: '7bit',
    };
    const sampleReceipt = { ...receiptFileData, mimetype: 'application/pdf', fieldname: 'receipt' };

    const MAX_MEMBERS = Math.min(students.length - 4, seedingConfig.MAX_MEMBERS);
    for (const team of teams) {
      const N_MEMBERS = randomInt(seedingConfig.MIN_MEMBERS, MAX_MEMBERS);
      const N_REQUESTERS = randomInt(
        seedingConfig.MIN_REQUESTS,
        Math.min(students.length - 4 - N_MEMBERS, seedingConfig.MAX_REQUESTS),
      );

      const roles = clubDefaultRoles.map((role) => new Role({ ...role, team, ...scopedOptions }));

      const [managers, rest] = randomFromArrayWithRemainder(students, 5);
      const [members, others] = randomFromArrayWithRemainder(rest, N_MEMBERS);

      const membersMap: { [x: string]: TeamMember } = {};
      const newMember = (user: User, i: number) =>
        new TeamMember({
          user,
          startDate: new Date(),
          team: team,
          teamMemberRoles: [roles[i]],
          permissions: 0,
          createdBy: user.individual,
          tenant: team.tenant,
        });

      for (const [i, member] of managers.entries()) if (member.user) membersMap[member.id] = newMember(member.user, i);
      for (const member of members) if (member.user) membersMap[member.id] = newMember(member.user, roles.length - 1);

      const teamMembers = Object.values(membersMap);

      for (const member of teamMembers) {
        const user = member.user;
        if (user) {
          const createdBy = member.user.individual;
          user.shortcuts.add(
            new Shortcut({ type: ShortcutType.Team, targetActor: team.actor, user, createdBy, tenant }),
          );
        }
      }

      const requesters = randomFromArray(others, N_REQUESTERS);

      const teamJoins = requesters.flatMap((individual) => {
        if (!individual.user) return [];

        let createdBy;
        let processedBy;
        if (Math.random() > 0.5) {
          createdBy = pickOneFromArray(managers);
          processedBy = individual;
        } else {
          createdBy = individual;
          processedBy = pickOneFromArray(managers);
        }

        const teamJoin = new TeamJoin({
          team: team,
          askedRole: roles[5],
          joinedBy: individual.user,
          state: ApprovalState.Pending,
          formSubmission: new FormSubmission({
            submission: { motivation: faker.lorem.lines(4) },
            form: team.joinForm,
            createdBy: individual,
            tenant,
          }),
          receivedRole: roles[5],
          receivedPole: team.poles.getItems()[0],
          processedBy,
          processedAt: createdAt,
          createdBy,
          tenant,
        });

        return teamJoin;
      });

      teamPromises.push(em.persistAndFlush([...roles, ...teamMembers]), em.persistAndFlush(teamJoins));

      const projectNames = ['Activité hebdomadaire', 'Échanges & rencontres', 'Séances de découverte'];

      const N_PROJECTS = randomInt(seedingConfig.MIN_PROJECTS_BY_TEAM, seedingConfig.MAX_PROJECTS_BY_TEAM);
      for (const i of Array.from({ length: N_PROJECTS }, (_, i) => i)) {
        const projectName = projectNames[i];

        const project = new Project({
          name: projectName,
          color: randomEnum(Colors),
          slug: `${toSlug(projectName)}-${randomId()}`,
          description: faker.lorem.paragraph(randomInt(2, 12)),
          supervisors: randomFromArray(teamMembers, 1, 3),
          budget: randomInt(9000, 20_000) / 10,
          isPrivate: Math.random() > 0.5,
          team,
          createdBy: pickOneFromArray(managers),
          tenant,
        });

        project.missions.add(Array.from({ length: randomInt(0, 5) }).map(() => randomMission(project, tenant)));

        // Add random project actions
        for (const _ of Array.from({ length: randomInt(2, 10) })) {
          const user = pickOneFromArray(teamMembers).user;
          const action = new Action({
            project,
            team,
            user,
            points: randomInt(1, 5),
            state: ApprovalState.Approved,
            pointsProcessedBy: pickOneFromArray(managers),
            pointsProcessedAt: createdAt,
            name: pickOneFromArray(potentialRoles),
            description: faker.lorem.paragraph(randomInt(2, 12)),
            createdBy: user.individual,
            tenant,
          });

          action.createdAt = new Date();

          teamPromises.push(em.persistAndFlush(action));
        }

        const N_EVENTS = randomInt(seedingConfig.MIN_EVENTS_BY_PROJECT, seedingConfig.MAX_EVENTS_BY_PROJECT);
        const events = new EventSeeder(em, team, approvalSteps, teamMembers).create(N_EVENTS).then(async (events) => {
          events = events.map((event, i) => {
            event.name = `${project.name} #${i + 1}`;
            event.slug = `${toSlug(event.name)}-${randomId()}`;
            event.createdAt = new Date(event.start);
            event.createdAt.setDate(createdAt.getDate() - 7);

            let lastStepIdx = approvalSteps.length;
            if (event.nextEventApprovalStep) {
              const order = event.nextEventApprovalStep.order;
              lastStepIdx = event.state === EventState.Rejected ? order : order - 1;
            }

            if (
              event.state === EventState.Rejected ||
              event.state === EventState.Approved ||
              event.state === EventState.Published ||
              event.state === EventState.Submitted
            ) {
              for (const idx of range({ to: lastStepIdx })) {
                const eventApprovalStep = approvalSteps[idx];
                const eventApproval = new EventApproval({
                  event,
                  eventApprovalStep,
                  isApproved: idx === lastStepIdx - 1 && event.state === EventState.Rejected ? false : true,
                  message: faker.lorem.paragraphs(1),
                  createdBy: pickOneFromArray(admins),
                  tenant,
                });
                eventApproval.createdAt = new Date(event.createdAt);
                event.eventApprovals.add(eventApproval);
              }
            }

            return event;
          });

          const eventOrganizes = events.map((event) => {
            const createdBy = pickOneFromArray(teamMembers).user.individual;
            const eventOrganize = new EventOrganize({ team, event, createdBy, tenant, project });
            const supervisors = randomFromArray(teamMembers, 1, 3).map(
              ({ user }) => new EventSupervisor({ eventOrganize, user, createdBy, tenant }),
            );

            eventOrganize.createdAt = new Date(event.createdAt);
            eventOrganize.supervisors.add(supervisors);
            return eventOrganize;
          });

          team.eventOrganizes.add(eventOrganizes);

          if (team.accounts.getItems().length > 0) {
            const finances = await Promise.all(
              Array.from({ length: randomInt(4, 10) }).map(async () => {
                const amount = randomInt(500, 20_000) / 100;
                const event = pickOneFromArray(events);
                const category = randomEnum(FinanceCategory);

                const finance = new Finance({
                  team,
                  account: team.accounts.getItems()[0],
                  event,
                  project,
                  amount: -amount,
                  category: category === FinanceCategory.Subvention ? FinanceCategory.Other : category,
                  payedBy: pickOneFromArray(teamMembers).user.individual.actor,
                  initiatedBy: pickOneFromArray(teamMembers).user.individual,
                  createdBy: pickOneFromArray(teamMembers).user.individual,
                  payedAt: faker.date.between({ from: start, to: createdAt }),
                  method: randomEnum(PaymentMethod),
                  state: FinanceState.Completed,
                  tenant,
                  receivedBy: pickOneFromArray(companies).actor,
                });

                return finance;
              }),
            ).then((finances) => finances.filter(isNotNull));

            teamPromises.push(async () => {
              await em.persistAndFlush(finances);
              for (const finance in finances) {
                if (Math.random() > 0.92) {
                  const createdFinance = await em.findOne(Finance, finance);

                  if (createdFinance) {
                    const context = { ...scopedOptions, entityName: EntityName.Finance, entityId: createdFinance.id };
                    const upload = await DatabaseSeeder.upload.createUpload(sampleReceipt, Buckets.Receipts, context);
                    createdFinance.attachments.add(upload);
                  }
                }
              }
            });
          }

          const eventJoins = [];
          for (const event of events) {
            const missions: [Mission, number][] = [];
            for (const _ of Array.from({ length: randomInt(1, 5) })) {
              const mission = randomMission(project, tenant);

              mission.createdAt = new Date(event.createdAt);

              mission.quantity = randomInt(1, 3);
              event.eventOrganizes[0].missions.add(mission);
              missions.push([mission, mission.quantity]);
            }

            // Generate event registrations
            eventJoins.push(
              ...randomFromArray([...managers, ...students], 4, 20).flatMap((individual) => {
                if (!individual.user) return [];

                const entities: BaseEntity[] = [];

                let presence = null;
                if (Math.random() > 0.2) presence = Math.random() > 0.2 ? true : false;

                let action = null;
                if (presence && Math.random() > 0.5) {
                  const pointsProcessedAt = new Date(event.createdAt);
                  pointsProcessedAt.setDate(pointsProcessedAt.getDate() + randomInt(1, 6));

                  action = new Action({
                    name: pickOneFromArray(potentialRoles),
                    description: faker.lorem.lines(2),
                    points: randomInt(1, 10),
                    team: team,
                    user: individual.user,
                    pointsProcessedAt,
                    pointsProcessedBy: pickOneFromArray(managers),
                    state: ApprovalState.Approved,
                    createdBy: individual,
                    tenant: team.tenant,
                  });

                  action.createdAt = new Date(event.createdAt);

                  entities.push(action);
                }

                const pointsProcessedAt = new Date(event.createdAt);
                pointsProcessedAt.setDate(pointsProcessedAt.getDate() + randomInt(1, 6));

                let state = ApprovalState.Approved;
                if (presence === null) state = Math.random() > 0.5 ? ApprovalState.Pending : ApprovalState.Rejected;

                const eventJoin = new EventJoin({
                  actions: action ? [action] : [],
                  joinedBy: individual.user,
                  state,
                  processedBy: pickOneFromArray(managers),
                  processedAt: pointsProcessedAt,
                  event: event,
                  isPresent: presence,
                  ...(event.joinForm
                    ? {
                        formSubmission: new FormSubmission({
                          submission: { payed: Math.random() > 0.5 },
                          form: event.joinForm,
                          createdBy: individual,
                          tenant: team.tenant,
                        }),
                      }
                    : {}),
                  ...(presence === null
                    ? {}
                    : {
                        participationProcessedAt: pointsProcessedAt,
                        participationProcessedBy: pickOneFromArray(managers),
                        participationProcessedVia: Math.random() > 0.5 ? ProcessedVia.QR : ProcessedVia.Manual,
                      }),
                  createdBy: individual,
                  tenant: team.tenant,
                });

                entities.push(eventJoin);

                // Add mission registrations
                if (Math.random() > 0.7) {
                  const mission = missions.find((mission) => mission[1] > 0);
                  if (mission) {
                    const completed = Math.random() > 0.5;

                    let state = ApprovalState.Approved;
                    if (!completed) state = Math.random() > 0.5 ? ApprovalState.Pending : ApprovalState.Rejected;

                    mission[1]--;

                    entities.push(
                      new MissionJoin({
                        eventJoin,
                        state,
                        joinedBy: individual.user,
                        mission: mission[0],
                        processedAt: event.start,
                        processedBy: state === ApprovalState.Approved ? pickOneFromArray(managers) : null,
                        ...(completed
                          ? {
                              points: randomInt(1, 3),
                              pointsProcessedAt: pointsProcessedAt,
                              pointsProcessedBy: pickOneFromArray(managers),
                            }
                          : {}),
                        createdBy: individual,
                        tenant,
                      }),
                    );
                  }
                }

                return entities;
              }),
            );
          }

          return em.persistAndFlush([...events, ...eventJoins]);
        });

        teamPromises.push(events);
        await em.flush();
      }
    }

    await Promise.all(teamPromises);

    // eslint-disable-next-line unicorn/no-array-method-this-argument
    const finances = await em.find(Finance, {}, { populate: ['team'] });
    const logs = finances.map((finance) => {
      const log = new Log({
        context: EventContext.User,
        eventType: EventType.Create,
        entityId: finance.id,
        entityName: EntityName.Finance,
        team: finance.team,
        createdBy: finance.createdBy,
      });

      log.createdAt = finance.createdAt;
      return log;
    });

    await em.persistAndFlush(logs);
  }
}
