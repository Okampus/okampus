import { EventSeeder } from './factories/event.seeder';
import { UserSeeder } from './factories/user.seeder';

import { assetsFolder, customSeederFolder, seedConfig } from './seed.config';
import { seedLegalUnits } from './seed/seed-legal-units';
import { seedBanks } from './seed/seed-banks';
import { seedTeams } from './seed/seed-teams';

import { seedCategories } from './seed/seed-categories';
import { seedEventApprovalSteps } from './seed/seed-event-approval-steps';
import { seedCampus } from './seed/seed-campus';
import { config } from '../config';

import {
  clubDefaultRoles,
  EventJoin,
  FormSubmission,
  Project,
  Action,
  TeamJoin,
  Transaction,
  TeamMember,
  TeamRole,
  EventOrganize,
  MissionJoin,
  EventApproval,
  Log,
  Mission,
  EventSupervisor,
  TeamMemberRole,
} from '@okampus/api/dal';
import { readFileOrNull } from '@okampus/api/shards';
import {
  Colors,
  ApprovalState,
  PaymentMethod,
  TransactionCategory,
  TransactionState,
  BucketNames,
  ProcessedVia,
  EventState,
  EventContext,
  EventType,
  EntityName,
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

import { S3Client } from '@aws-sdk/client-s3';
import { faker } from '@faker-js/faker/locale/fr';
import { Seeder } from '@mikro-orm/seeder';
import { ConsoleLogger } from '@nestjs/common';

import { hash } from 'argon2';
import path from 'node:path';

import type { GeocodeService, UploadsService } from '@okampus/api/bll';
import type { User, BaseEntity, Tenant } from '@okampus/api/dal';
import type { EntityManager } from '@mikro-orm/core';

const createdAt = new Date();

const receiptExampleFilename = 'receipt-example.pdf';
const receiptExamplePath = path.join(assetsFolder, 'documents', receiptExampleFilename);

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

    this.logger.log('Seeding campus..');
    const { campusClusters, campus } = await seedCampus(this.s3Client, DatabaseSeeder.geocodeService, tenant);

    this.logger.log('Seeding legal units..');
    const legalUnits = await seedLegalUnits(this.s3Client);

    this.logger.log('Seeding banks..');
    const banks = await seedBanks(this.s3Client);

    this.logger.log('Seeding event approval step..');
    const eventApprovalSteps = await seedEventApprovalSteps(this.s3Client, tenant);

    this.logger.log('Seeding categories..');
    const categories = await seedCategories(this.s3Client, em, DatabaseSeeder.uploadService, tenant);

    this.logger.log('Seeding teams..');
    const teams = await seedTeams(this.s3Client, em, DatabaseSeeder.geocodeService, DatabaseSeeder.uploadService, {
      categories,
      tenant,
      banks,
    });

    await em.persistAndFlush([campusClusters, campus, teams, categories, banks, legalUnits]);

    console.log('Teams created, base tenant initalization complete!');

    if (config.database.isSeeding) {
      this.logger.log('Generating fake tenant data...');

      const password = await hash('root', { secret: Buffer.from(config.pepperSecret) });
      const admins = await new UserSeeder(em, tenant, password).create(seedConfig.N_ADMINS);
      const students = await new UserSeeder(em, tenant, password).create(seedConfig.N_STUDENTS);

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

        teamPromises.push(em.persistAndFlush([...roles, ...teamMembers, ...teamJoins]));

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
          const events = new EventSeeder(em, team, eventApprovalSteps, teamMembers)
            .create(N_EVENTS)
            .then(async (events) => {
              events = events.map((event, i) => {
                event.name = `${project.name} #${i + 1}`;
                event.slug = `${toSlug(event.name)}-${randomId()}`;
                event.createdAt = new Date(event.start);
                event.createdAt.setDate(createdAt.getDate() - 7);

                let lastStepIdx = eventApprovalSteps.length;
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
                    const eventApprovalStep = eventApprovalSteps[idx];

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
    }

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
