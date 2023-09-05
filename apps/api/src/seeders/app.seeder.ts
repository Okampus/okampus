import { EventApprovalStepSeeder } from './factories/approval-step.seeder';
import { EventSeeder } from './factories/event.seeder';
import { UserSeeder } from './factories/user.seeder';

import { seedLegalUnits } from './seed-legal-units';
import { seedBanks } from './seed-banks';
import { assetsFolder, customSeederFolder, seedConfig } from './seed.config';
import { seedTeams } from './seed-teams';
import { config } from '../config';

import {
  clubDefaultRoles,
  Campus,
  EventJoin,
  FormSubmission,
  Project,
  Team,
  Action,
  TeamJoin,
  Transaction,
  TeamMember,
  TeamRole,
  Tag,
  Address,
  EventOrganize,
  MissionJoin,
  CampusCluster,
  TenantOrganize,
  EventApproval,
  Log,
  Location,
  Mission,
  EventSupervisor,
  TeamMemberRole,
  LegalUnit,
} from '@okampus/api/dal';
import { Countries } from '@okampus/shared/consts';
import {
  Colors,
  ApprovalState,
  TeamType,
  PaymentMethod,
  TransactionCategory,
  TransactionState,
  BucketNames,
  TagType,
  ProcessedVia,
  LocationType,
  TenantOrganizeType,
  EventState,
  EventContext,
  EventType,
  EntityName,
  LegalUnitType,
} from '@okampus/shared/enums';
import {
  isNotNull,
  parseYaml,
  pickOneFromArray,
  randomEnum,
  randomFromArray,
  randomFromArrayWithRemainder,
  randomId,
  randomInt,
  range,
  toSlug,
} from '@okampus/shared/utils';

import { readFileOrNull } from '@okampus/api/shards';
import { S3Client } from '@aws-sdk/client-s3';
import { faker } from '@faker-js/faker/locale/fr';
import { Seeder } from '@mikro-orm/seeder';
import { ConsoleLogger } from '@nestjs/common';
import { hash } from 'argon2';

import path from 'node:path';

import type { GeocodeService, UploadsService } from '@okampus/api/bll';
import type { EventApprovalStep, User, BaseEntity, Tenant } from '@okampus/api/dal';
import type { EntityManager } from '@mikro-orm/core';

const createdAt = new Date();

const receiptExampleFilename = 'receipt-example.pdf';
const receiptExamplePath = path.join(assetsFolder, 'documents', receiptExampleFilename);

async function createEventApprovalStep(
  em: EntityManager,
  validators: User[],
  tenant: Tenant,
  order: number,
  createdBy: User | null,
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
    tenantScope: tenant,
  });

  mission.createdAt = createdAt;
  return mission;
}

async function readIcon(iconFileName: string) {
  try {
    const icon = await readFileOrNull(path.join(assetsFolder, 'images', 'team-category', iconFileName));
    if (!icon) return await readFileOrNull(path.join(customSeederFolder, 'icons', iconFileName));
    return icon;
  } catch {
    return null;
  }
}

type CategoryData = { name: string; color: Colors; slug?: string; icon?: string };
async function loadCategoriesFromYaml(): Promise<CategoryData[] | null> {
  let categories = await parseYaml<CategoryData[]>(path.join(customSeederFolder, 'categories.yaml'));
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

// TODO: refactor awaits out of loops
export class DatabaseSeeder extends Seeder {
  public static admin: User;
  public static tenant: Tenant;
  public static uploadService: UploadsService;
  public static geocodeService: GeocodeService;
  public static entityManager: EntityManager;

  private readonly s3Client = config.s3.bucketSeeding ? new S3Client(config.s3.credentials) : null;
  private readonly logger = new ConsoleLogger('Seeder');

  public async run(em: EntityManager): Promise<void> {
    this.logger.log(`Seeding launched for tenant ${config.baseTenant.domain}...`);
    this.logger.log(`Custom seeder folder: ${customSeederFolder}, receipt example path: ${receiptExamplePath}`);

    const uploadService = DatabaseSeeder.uploadService;
    const tenant = DatabaseSeeder.tenant;

    const scopedOptions = { tenantScope: tenant, createdBy: null };

    const start = new Date('2023-05-01T00:00:00.000Z');

    if (!tenant.actor) throw new Error(`Tenant ${tenant.domain} has no admin team`);

    this.logger.log(`Seeding tenant ${tenant.actor.name}`);

    const adminPromises = [];

    const campusClusters = [
      new CampusCluster({ name: 'Paris', ...scopedOptions }),
      new CampusCluster({ name: 'Bordeaux', ...scopedOptions }),
    ];

    for (const campusCluster of campusClusters) {
      const campusClusterManageTeam = new Team({
        name: `Campus ${campusCluster.name}`,
        type: TeamType.Department,
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
          ...scopedOptions,
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

    const password = await hash('root', { secret: Buffer.from(config.pepperSecret) });
    const admins = await new UserSeeder(em, tenant, password).create(seedConfig.N_ADMINS);
    const students = await new UserSeeder(em, tenant, password).create(seedConfig.N_STUDENTS);

    const legalUnits = await seedLegalUnits(this.s3Client);
    const banks = await seedBanks(this.s3Client);

    for (const bank of banks) {
      const legalUnit = new LegalUnit({
        name: bank.legalName,
        legalName: bank.legalName,
        slug: bank.slug,
        siren: bank.siren,
        bankCode: bank.bankCode,
        type: LegalUnitType.Bank,
        ...scopedOptions,
      });
    }

    let restAdmins = admins;
    let stepAdmins: User[];

    this.logger.log('Seeding team categories..');

    const approvalSteps: EventApprovalStep[] = [];
    for (let i = 0; i < seedConfig.N_APPROVAL_STEPS; i++) {
      const nStepAdmins = randomInt(seedConfig.MIN_ADMINS_BY_STEP, seedConfig.MAX_ADMINS_BY_STEP);
      [stepAdmins, restAdmins] = randomFromArrayWithRemainder(restAdmins, nStepAdmins);
      approvalSteps.push(
        await createEventApprovalStep(em, [DatabaseSeeder.admin, ...stepAdmins], tenant, i + 1, DatabaseSeeder.admin),
      );
      if (i > 0) approvalSteps[i].previousStep = approvalSteps[i - 1];
    }

    const categoriesData = (await loadCategoriesFromYaml()) ?? seedConfig.DEFAULT_CATEGORIES;

    const iconConfig = { encoding: '7bit', mimetype: 'image/webp', fieldname: 'icon', fileLastModifiedAt: createdAt };
    const categories = await Promise.all(
      categoriesData.map(async ({ icon, name, color, slug }) => {
        await em.persistAndFlush(new Tag({ color, slug, type: TagType.TeamCategory, name, ...scopedOptions }));

        const tag = await em.findOneOrFail(Tag, { slug });
        const buffer = icon && (await readIcon(icon));

        if (buffer) {
          const file = { ...iconConfig, buffer, size: buffer.length, filename: name };
          const context = { ...scopedOptions, entityName: EntityName.Tag, entityId: tag.id };
          const image = await uploadService.createImageUpload(file, BucketNames.Thumbnails, context, 200);

          this.logger.log(`Uploaded ${name} icon`);

          tag.image = image;
          await em.persistAndFlush([tag, image]);
        }

        return tag;
      }),
    );

    this.logger.log('Seeding teams..');
    const teams = await seedTeams(this.s3Client, em, DatabaseSeeder.geocodeService, DatabaseSeeder.uploadService, {
      categories,
      tenant,
    });

    this.logger.log('Teams created...');
    const teamPromises = [];

    this.logger.log(`Receipt example path: ${receiptExamplePath}`);
    const receiptExampleFile = await readFileOrNull(receiptExamplePath);
    if (!receiptExampleFile) throw new Error('No example receipt file found.');

    const receiptFileData = {
      buffer: receiptExampleFile,
      size: receiptExampleFile.length,
      filename: receiptExampleFilename,
      encoding: '7bit',
    };
    const sampleReceipt = { ...receiptFileData, mimetype: 'application/pdf', fieldname: 'receipt' };

    const MAX_MEMBERS = Math.min(students.length - 4, seedConfig.MAX_MEMBERS);
    for (const team of teams) {
      const N_MEMBERS = randomInt(seedConfig.MIN_MEMBERS, MAX_MEMBERS);
      const N_REQUESTERS = randomInt(
        seedConfig.MIN_REQUESTS,
        Math.min(students.length - 4 - N_MEMBERS, seedConfig.MAX_REQUESTS),
      );

      const roles = clubDefaultRoles.map((role) => new TeamRole({ ...role, team, ...scopedOptions }));

      const [managers, rest] = randomFromArrayWithRemainder(students, 5);
      const [members, others] = randomFromArrayWithRemainder(rest, N_MEMBERS);

      const membersMap: { [x: string]: TeamMember } = {};
      const newMember = (user: User, i: number) => {
        const teamMember = new TeamMember({
          user,
          start: new Date(),
          team: team,
          createdBy: user,
          tenantScope: tenant,
        });

        teamMember.teamMemberRoles.add(new TeamMemberRole({ teamMember, teamRole: roles[i], ...scopedOptions }));
        return teamMember;
      };

      for (const [i, member] of managers.entries()) if (member) membersMap[member.id] = newMember(member, i);
      for (const member of members) if (member) membersMap[member.id] = newMember(member, roles.length - 1);

      const teamMembers = Object.values(membersMap);
      const requesters = randomFromArray(others, N_REQUESTERS);

      const teamJoins = requesters.flatMap((user) => {
        if (!user) return [];

        let createdBy;
        let processedBy;
        if (Math.random() > 0.5) {
          createdBy = pickOneFromArray(managers);
          processedBy = user;
        } else {
          createdBy = user;
          processedBy = pickOneFromArray(managers);
        }

        const teamJoin = new TeamJoin({
          team: team,
          askedRole: roles[5],
          joinedBy: user,
          state: ApprovalState.Pending,
          formSubmission: new FormSubmission({
            submission: { motivation: faker.lorem.lines(4) },
            form: team.joinForm,
            createdBy: user,
            tenantScope: tenant,
          }),
          receivedRole: roles[5],
          receivedPole: team.poles.getItems()[0],
          processedBy,
          processedAt: createdAt,
          createdBy,
          tenantScope: tenant,
        });

        return teamJoin;
      });

      teamPromises.push(em.persistAndFlush([...roles, ...teamMembers]), em.persistAndFlush(teamJoins));

      const projectNames = ['Activité hebdomadaire', 'Échanges & rencontres', 'Séances de découverte'];

      const N_PROJECTS = randomInt(seedConfig.MIN_PROJECTS_BY_TEAM, seedConfig.MAX_PROJECTS_BY_TEAM);
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
          tenantScope: tenant,
        });

        project.missions.add(Array.from({ length: randomInt(0, 5) }).map(() => randomMission(project, tenant)));

        // Add random project actions
        for (const _ of Array.from({ length: randomInt(2, 10) })) {
          const user = pickOneFromArray(teamMembers).user;
          const action = new Action({
            project,
            team,
            user: user,
            points: randomInt(1, 5),
            state: ApprovalState.Approved,
            pointsProcessedBy: pickOneFromArray(managers),
            pointsProcessedAt: createdAt,
            name: pickOneFromArray(potentialRoles),
            description: faker.lorem.paragraph(randomInt(2, 12)),
            createdBy: user,
            tenantScope: tenant,
          });

          action.createdAt = new Date();

          teamPromises.push(em.persistAndFlush(action));
        }

        const N_EVENTS = randomInt(seedConfig.MIN_EVENTS_BY_PROJECT, seedConfig.MAX_EVENTS_BY_PROJECT);
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

                const isLastRejectedStep = idx === lastStepIdx - 1 && event.state === EventState.Rejected;
                const eventApproval = new EventApproval({
                  event,
                  eventApprovalStep,
                  isApproved: !isLastRejectedStep,
                  message: faker.lorem.paragraphs(1),
                  createdBy: pickOneFromArray(admins),
                  tenantScope: tenant,
                });
                eventApproval.createdAt = new Date(event.createdAt);
                event.eventApprovals.add(eventApproval);
              }
            }

            return event;
          });

          const eventOrganizes = events.map((event) => {
            const createdBy = pickOneFromArray(teamMembers).user;
            const eventOrganize = new EventOrganize({ team, event, createdBy, tenantScope: tenant, project });
            const supervisors = randomFromArray(teamMembers, 1, 3).map(
              ({ user }) => new EventSupervisor({ eventOrganize, user, createdBy, tenantScope: tenant }),
            );

            eventOrganize.createdAt = new Date(event.createdAt);
            eventOrganize.supervisors.add(supervisors);
            return eventOrganize;
          });

          team.eventOrganizes.add(eventOrganizes);

          if (team.bankAccounts.getItems().length > 0) {
            const transactions = await Promise.all(
              Array.from({ length: randomInt(4, 10) }).map(async () => {
                const amount = randomInt(500, 20_000) / 100;
                const event = pickOneFromArray(events);
                const category = randomEnum(TransactionCategory);

                const transaction = new Transaction({
                  bankAccount: team.bankAccounts.getItems()[0],
                  event,
                  project,
                  amount: -amount,
                  category: category === TransactionCategory.Subvention ? TransactionCategory.Other : category,
                  payedBy: pickOneFromArray(teamMembers).user.actor,
                  initiatedBy: pickOneFromArray(teamMembers).user,
                  payedAt: faker.date.between({ from: start, to: createdAt }),
                  method: randomEnum(PaymentMethod),
                  state: TransactionState.Completed,
                  receivedBy: pickOneFromArray(legalUnits).actor,
                  createdBy: pickOneFromArray(teamMembers).user,
                  tenantScope: tenant,
                });

                return transaction;
              }),
            ).then((transactions) => transactions.filter(isNotNull));

            teamPromises.push(async () => {
              await em.persistAndFlush(transactions);
              for (const transaction in transactions) {
                if (Math.random() > 0.92) {
                  const createdTransaction = await em.findOne(Transaction, transaction);

                  if (createdTransaction) {
                    const context = {
                      ...scopedOptions,
                      entityName: EntityName.Transaction,
                      entityId: createdTransaction.id,
                    };
                    const upload = await uploadService.createUpload(sampleReceipt, BucketNames.Receipts, context);
                    createdTransaction.attachments.add(upload);
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
              ...randomFromArray([...managers, ...students], 4, 20).flatMap((user) => {
                if (!user) return [];

                const entities: BaseEntity[] = [];

                let presence = null;
                if (Math.random() > 0.2) presence = Math.random() > 0.25;

                let action = null;
                if (presence && Math.random() > 0.5) {
                  const pointsProcessedAt = new Date(event.createdAt);
                  pointsProcessedAt.setDate(pointsProcessedAt.getDate() + randomInt(1, 6));

                  action = new Action({
                    name: pickOneFromArray(potentialRoles),
                    description: faker.lorem.lines(2),
                    points: randomInt(1, 10),
                    team: team,
                    user,
                    pointsProcessedAt,
                    pointsProcessedBy: pickOneFromArray(managers),
                    state: ApprovalState.Approved,
                    createdBy: user,
                    tenantScope: tenant,
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
                  joinedBy: user,
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
                          createdBy: user,
                          tenantScope: tenant,
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
                  createdBy: user,
                  tenantScope: team.tenantScope,
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
                        joinedBy: user,
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
                        createdBy: user,
                        tenantScope: tenant,
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

    const transactions = await em.find(Transaction, {});
    const logs = transactions.map((transaction) => {
      const log = new Log({
        context: EventContext.User,
        eventType: EventType.Create,
        entityId: transaction.id,
        entityName: EntityName.Transaction,
        createdBy: transaction.createdBy,
      });

      log.createdAt = transaction.createdAt;
      return log;
    });

    await em.persistAndFlush(logs);
  }
}
