import { EventSeeder } from './factories/event.seeder';
import { UserSeeder } from './factories/user.seeder';

import { assetsFolder, customSeederFolder, seedConfig } from './seed.config';
import { seedLegalUnits } from './seed/seed-legal-units';
import { seedBanks } from './seed/seed-banks';
import { seedTeams } from './seed/seed-teams';

import { seedCategories } from './seed/seed-categories';
import { seedTenant } from './seed/seed-tenant';
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
  pickOneRandom,
  randomEnum,
  pickRandom,
  pickWithRemainder,
  randomId,
  randomInt,
  range,
  toSlug,
} from '@okampus/shared/utils';

import { faker } from '@faker-js/faker/locale/fr';
import { Seeder } from '@mikro-orm/seeder';
import { ConsoleLogger } from '@nestjs/common';

import { hash } from 'argon2';
import path from 'node:path';
import type { FormSchema, Submission } from '@okampus/shared/types';

import type { GeocodeService, UploadsService } from '@okampus/api/bll';
import type { User, BaseEntity, Tenant, Form } from '@okampus/api/dal';
import type { S3Client } from '@aws-sdk/client-s3';
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
    name: pickOneRandom(potentialRoles),
    color: randomEnum(Colors),
    description: faker.lorem.paragraph(),
    pointsMinimum: 1,
    pointsMaximum: 10,
    project,
    team: project.team,
    createdBy: project.createdBy,
    tenantScope: tenant,
  });

  mission.createdAt = createdAt;
  return mission;
}

function randomState(validated: boolean): ApprovalState {
  if (validated) return ApprovalState.Approved;
  return Math.random() > 0.5 ? ApprovalState.Pending : ApprovalState.Rejected;
}

function randomSubmission(form: Form): Submission<FormSchema> {
  const { schema } = form;
  const submission: Submission<FormSchema> = {};

  const fields = Array.isArray(schema) ? schema : [];
  for (const field of fields) {
    const { type, name, options } = field;
    switch (type) {
      case 'checkbox': {
        submission[name] = Math.random() > 0.5;
        break;
      }
      case 'select': {
        submission[name] = pickOneRandom(options);
        break;
      }
      case 'radio': {
        submission[name] = pickOneRandom(options);
        break;
      }
      case 'text': {
        submission[name] = faker.lorem.lines(1);
        break;
      }
      case 'textarea': {
        submission[name] = faker.lorem.lines(4);
        break;
      }
      // No default
    }
  }

  return submission;
}

// TODO: refactor awaits out of loops
export class DatabaseSeeder extends Seeder {
  public static admin: User;
  public static tenant: Tenant;
  public static uploadService: UploadsService;
  public static geocodeService: GeocodeService;
  public static entityManager: EntityManager;
  public static s3Client: S3Client | null;

  private readonly logger = new ConsoleLogger('Seeder');

  public async run(em: EntityManager): Promise<void> {
    const s3Client = DatabaseSeeder.s3Client;
    const tenantScope = DatabaseSeeder.tenant;

    const geocodeService = DatabaseSeeder.geocodeService;
    const uploadService = DatabaseSeeder.uploadService;

    this.logger.log(`Seeding launched for tenant ${config.baseTenant.domain}...`);
    this.logger.log(`Custom seeder folder: ${customSeederFolder}, receipt example path: ${receiptExamplePath}`);

    const baseOptions = { tenantScope, createdBy: null };

    const start = new Date('2023-05-01T00:00:00.000Z');

    if (!tenantScope.actor) throw new Error(`Tenant ${tenantScope.domain} has no admin team`);

    this.logger.log('Seeding legal units..');
    const legalUnits = await seedLegalUnits(s3Client);

    this.logger.log('Seeding banks..');
    const banks = await seedBanks(s3Client);

    this.logger.log('Seeding event approval step..');
    const eventApprovalSteps = await seedTenant({ s3Client, tenant: tenantScope });

    this.logger.log('Seeding categories..');
    const categories = await seedCategories({ s3Client, em, uploadService, tenant: tenantScope });

    this.logger.log('Seeding campus..');
    const { campusClusters, campus } = await seedCampus({ s3Client, geocodeService, tenant: tenantScope });

    this.logger.log('Seeding teams..');
    const teams = await seedTeams({
      em,
      s3Client,
      geocodeService,
      uploadService,
      categories,
      tenant: tenantScope,
      banks,
    });

    await em.persistAndFlush([...campusClusters, ...campus, ...categories, ...banks, ...legalUnits]);

    this.logger.log('Teams created, base tenant initalization complete!');

    if (config.database.isSeeding) {
      this.logger.log('Generating fake tenant data...');

      const password = await hash('root', { secret: Buffer.from(config.pepperSecret) });
      const admins = await new UserSeeder(em, tenantScope, password).create(seedConfig.N_ADMINS);
      const students = await new UserSeeder(em, tenantScope, password).create(seedConfig.N_STUDENTS);

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

        const roles = clubDefaultRoles.map((role) => new TeamRole({ ...role, team, ...baseOptions }));

        const [managers, rest] = pickWithRemainder(students, 5);
        const [members, others] = pickWithRemainder(rest, N_MEMBERS);

        const membersMap: { [x: string]: TeamMember } = {};
        const newMember = (user: User, i: number) => {
          const teamMember = new TeamMember({ user, team, createdBy: user, tenantScope });
          teamMember.teamMemberRoles.add(new TeamMemberRole({ teamMember, teamRole: roles[i], ...baseOptions }));
          return teamMember;
        };

        for (const [i, member] of managers.entries()) if (member) membersMap[member.id] = newMember(member, i);
        for (const member of members) if (member) membersMap[member.id] = newMember(member, roles.length - 1);

        const teamMembers = Object.values(membersMap);
        const requesters = pickRandom(others, N_REQUESTERS);

        const teamJoins = requesters.flatMap((user) => {
          if (!user) return [];

          let createdBy;
          let processedBy;
          if (Math.random() > 0.5) {
            createdBy = pickOneRandom(managers);
            processedBy = user;
          } else {
            createdBy = user;
            processedBy = pickOneRandom(managers);
          }

          const formSubmission = new FormSubmission({
            submission: randomSubmission(team.joinForm),
            form: team.joinForm,
            createdBy: user,
            tenantScope,
          });

          const teamJoin = new TeamJoin({
            team,
            joinedBy: user,
            state: ApprovalState.Pending,
            formSubmission,
            processedBy,
            processedAt: createdAt,
            createdBy,
            tenantScope,
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
            supervisors: pickRandom(teamMembers, 1, 3),
            budget: randomInt(9000, 20_000) / 10,
            isPrivate: Math.random() > 0.5,
            team,
            createdBy: pickOneRandom(managers),
            tenantScope,
          });

          project.missions.add(Array.from({ length: randomInt(0, 5) }).map(() => randomMission(project, tenantScope)));

          // Add random project actions
          for (const _ of Array.from({ length: randomInt(2, 10) })) {
            const user = pickOneRandom(teamMembers).user;
            const action = new Action({
              project,
              team,
              user,
              points: randomInt(1, 5),
              state: ApprovalState.Approved,
              pointsProcessedBy: pickOneRandom(managers),
              pointsProcessedAt: createdAt,
              name: pickOneRandom(potentialRoles),
              description: faker.lorem.paragraph(randomInt(2, 12)),
              createdBy: user,
              tenantScope,
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
                    const isApproved = idx !== lastStepIdx - 1 || event.state !== EventState.Rejected;

                    const approvalData = { event, eventApprovalStep, message: faker.lorem.paragraphs(1) };
                    const eventApproval = new EventApproval({ ...approvalData, isApproved, ...baseOptions });
                    eventApproval.createdAt = new Date(event.createdAt);
                    event.eventApprovals.add(eventApproval);
                  }
                }

                return event;
              });

              const eventOrganizes = events.map((event) => {
                const createdBy = pickOneRandom(teamMembers).user;
                const eventOrganize = new EventOrganize({ team, event, project, createdBy, tenantScope });
                const supervisors = pickRandom(teamMembers, 1, 3).map(
                  (teamMember) => new EventSupervisor({ eventOrganize, teamMember, createdBy, tenantScope }),
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
                    const event = pickOneRandom(events);
                    const category = randomEnum(TransactionCategory);

                    const transaction = new Transaction({
                      bankAccount: team.bankAccounts.getItems()[0],
                      event,
                      project,
                      amount: -amount,
                      category: category === TransactionCategory.Subvention ? TransactionCategory.Other : category,
                      payedBy: pickOneRandom(teamMembers).user.actor,
                      initiatedBy: pickOneRandom(teamMembers).user,
                      payedAt: faker.date.between({ from: start, to: createdAt }),
                      method: randomEnum(PaymentMethod),
                      state: TransactionState.Completed,
                      receivedBy: pickOneRandom(legalUnits).actor,
                      createdBy: pickOneRandom(teamMembers).user,
                      tenantScope,
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
                          ...baseOptions,
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
                const { start, joinForm: form, createdAt } = event;

                const missions: [Mission, number][] = [];
                for (const _ of Array.from({ length: randomInt(1, 5) })) {
                  const mission = randomMission(project, tenantScope);

                  mission.createdAt = new Date(createdAt);
                  mission.quantity = randomInt(1, 3);
                  event.eventOrganizes[0].missions.add(mission);
                  missions.push([mission, mission.quantity]);
                }

                // Generate event registrations
                eventJoins.push(
                  ...pickRandom([...managers, ...students], 4, 20).flatMap((createdBy) => {
                    if (!createdBy) return [];

                    const options = { createdBy, tenantScope };
                    const entities: BaseEntity[] = [];

                    const isPresent = Math.random() > 0.25;
                    const state = randomState(isPresent !== null);

                    let action = null;
                    if (isPresent && Math.random() > 0.5) {
                      const actionData = {
                        name: pickOneRandom(potentialRoles),
                        description: faker.lorem.lines(2),
                        points: randomInt(1, 10),
                        pointsProcessedBy: pickOneRandom(managers),
                        state,
                      };

                      const pointsProcessedAt = new Date(createdAt);
                      pointsProcessedAt.setDate(pointsProcessedAt.getDate() + randomInt(1, 6));

                      action = new Action({ ...actionData, pointsProcessedAt, team, user: createdBy, ...options });
                      action.createdAt = new Date(createdAt);

                      entities.push(action);
                    }

                    const processedAt = new Date(createdAt);
                    processedAt.setDate(processedAt.getDate() + randomInt(1, 6));

                    const presence =
                      isPresent === null
                        ? {}
                        : {
                            participationProcessedAt: processedAt,
                            participationProcessedBy: pickOneRandom(managers),
                            participationProcessedVia: Math.random() > 0.5 ? ProcessedVia.QR : ProcessedVia.Manual,
                          };

                    const joinForm = form
                      ? { formSubmission: new FormSubmission({ submission: randomSubmission(form), form, ...options }) }
                      : {};

                    const joinData = {
                      actions: action ? [action] : [],
                      processedAt,
                      processedBy: pickOneRandom(managers),
                      state,
                      ...joinForm,
                      ...presence,
                    };
                    const eventJoin = new EventJoin({ ...joinData, joinedBy: createdBy, event, isPresent, ...options });

                    entities.push(eventJoin);

                    // Add mission registrations
                    if (Math.random() > 0.7) {
                      const missionQuantity = missions.find((mission) => mission[1] > 0);
                      if (missionQuantity) {
                        const mission = missionQuantity[0];
                        missionQuantity[1]--;

                        const isCompleted = Math.random() > 0.5;

                        const state = randomState(isCompleted);
                        const completed = isCompleted
                          ? {
                              points: randomInt(1, 3),
                              pointsProcessedAt: processedAt,
                              pointsProcessedBy: pickOneRandom(managers),
                            }
                          : {};

                        const joinData = { eventJoin, state, joinedBy: createdBy, mission, processedAt: start };
                        const processedBy = state === ApprovalState.Approved ? pickOneRandom(managers) : null;

                        entities.push(new MissionJoin({ ...joinData, processedBy, ...completed, ...options }));
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
        entityId: transaction.id,
        entityName: EntityName.Transaction,
        eventType: EventType.Create,
        createdBy: transaction.createdBy,
      });

      log.createdAt = transaction.createdAt;
      return log;
    });

    await em.persistAndFlush(logs);
  }
}
