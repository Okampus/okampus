/* eslint-disable object-curly-newline */
import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { nanoid } from 'nanoid';
import { EventRegistrationStatus } from '@common/lib/types/enums/event-register-status.enum';
import { FileKind } from '@common/lib/types/enums/file-kind.enum';
import { ScopeRole } from '@common/modules/authorization/types/scope-role.enum';
import { MembershipRequestIssuer } from '@lib/types/enums/membership-request-issuer.enum';
import { MembershipRequestState } from '@lib/types/enums/membership-request-state.enum';
import { TeamRole } from '@lib/types/enums/team-role.enum';
import { randomFromArray, randomFromArrayWithRemainder } from '@lib/utils/array-utils';
import { randomEnum } from '@lib/utils/random-enum';
import { randomInt } from '@lib/utils/random-utils';
import { FileUpload } from '@modules/upload/file-uploads/file-upload.entity';
import { TeamMember } from '@org/teams/members/team-member.entity';
import { TeamMembershipRequest } from '@org/teams/requests/team-membership-request.entity';
import type { ApprovalStep } from '@org/tenants/approval-steps/approval-step.entity';
import { EventRegistration } from '@plan/registrations/registration.entity';
import type { User } from '@uaa/users/user.entity';
import { ApprovalStepFactory } from './factories/approval-step.factory';
import { EventFactory } from './factories/event.factory';
import { TeamFinanceFactory } from './factories/team-finance.factory';
import { TeamFactory } from './factories/team.factory';
import { TenantFactory } from './factories/tenant.factory';
import { UserFactory } from './factories/user.factory';

const seedingConfig = {
  N_ADMINS: 10,
  N_STUDENTS: 100,
  N_TEACHERS: 10,

  N_APPROVAL_STEPS: 3,

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

const _issuer = (): MembershipRequestIssuer => randomEnum(MembershipRequestIssuer);
const _role = (): TeamRole => randomEnum(TeamRole);
const _actions = (): { activityCount: number; activityScore: number } => ({
  activityCount: randomInt(0, 10),
  activityScore: randomInt(0, 10) * 5,
});

// TODO: refactor awaits out of loops
export class DatabaseSeeder extends Seeder {
  public async run(em: EntityManager): Promise<void> {
    const createdAt = new Date();
    const updatedAt = new Date();

    const tenant = await new TenantFactory(em).createOne();

    const admins = await new UserFactory(em, tenant, ScopeRole.Admin).create(seedingConfig.N_ADMINS);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const teachers = await new UserFactory(em, tenant, ScopeRole.Teacher).create(seedingConfig.N_TEACHERS);
    const students = await new UserFactory(em, tenant, ScopeRole.Student).create(seedingConfig.N_STUDENTS);

    let approvalSteps = [];

    let restAdmins = admins;
    let stepAdmins: User[];

    for (let i = 0; i < seedingConfig.N_APPROVAL_STEPS; i++) {
      [stepAdmins, restAdmins] = randomFromArrayWithRemainder(
        restAdmins, randomInt(seedingConfig.MIN_ADMINS_BY_STEP, seedingConfig.MAX_ADMINS_BY_STEP),
      );
      approvalSteps.push((async (): Promise<ApprovalStep> => {
        const step = await new ApprovalStepFactory(em, tenant, i + 1).createOne();
        step.users.add(stepAdmins);
        return step;
      })());
    }
    approvalSteps = await Promise.all(approvalSteps);

    const teams = await new TeamFactory(em, tenant).create(10);

    for (const team of teams) {
      const [supervisors, rest] = randomFromArrayWithRemainder(students, 4);
      const [president, treasurer, secretary, manager] = supervisors;

      const [members, others] = randomFromArrayWithRemainder(
        rest, seedingConfig.MIN_MEMBERS, Math.min(students.length - 4, seedingConfig.MAX_MEMBERS),
      );
      const requesters = randomFromArray(
        others, seedingConfig.MIN_REQUESTS, Math.min(others.length, seedingConfig.MAX_REQUESTS),
      );

      const _member = { createdAt, updatedAt, active: true, joinDate: new Date(), team };
      const _request = { createdAt, updatedAt, team, state: MembershipRequestState.Pending };

      const teamMembers = [
        em.create(TeamMember, { ..._member, user: president, role: TeamRole.Owner, ..._actions() }),
        em.create(TeamMember, { ..._member, user: treasurer, role: TeamRole.Treasurer, ..._actions() }),
        em.create(TeamMember, { ..._member, user: secretary, role: TeamRole.Secretary, ..._actions() }),
        em.create(TeamMember, { ..._member, user: manager, role: TeamRole.Manager, ..._actions() }),
        ...members.map(user => em.create(TeamMember, { ..._member, user, role: TeamRole.Member, ..._actions() })),
      ];

      requesters.map((user) => {
        const issuer = _issuer();
        const issuedBy = issuer === MembershipRequestIssuer.Team ? randomFromArray(supervisors, 1)[0] : user;
        return em.create(TeamMembershipRequest, { ..._request, user, issuer, role: _role(), issuedBy });
      });

      // eslint-disable-next-line no-await-in-loop
      const events = await new EventFactory(em, team, approvalSteps, teamMembers)
                            .create(randomInt(seedingConfig.MIN_EVENTS_BY_CLUB, seedingConfig.MAX_EVENTS_BY_CLUB));

      const eventRegistrations: Record<number, EventRegistration[]> = {};
      // Generate Registrations
      for (const event of events) {
        eventRegistrations[event.id] = randomFromArray(students, 4, Math.min(students.length, 50))
          .map((user) => {
            const status = randomEnum(EventRegistrationStatus);
            const present = (status === EventRegistrationStatus.Maybe || status === EventRegistrationStatus.Sure)
              ? Math.random() > 0.5
              : false;

            const activityScore = present ? randomInt(0, 10) : 0;

            return em.create(EventRegistration, { createdAt, updatedAt, event, user, status, present, activityScore });
        });
      }

      // eslint-disable-next-line no-await-in-loop
      const transactions = await new TeamFinanceFactory(em, team, events, teamMembers, eventRegistrations)
                    .create(randomInt(5, 100));
      for (const transaction of transactions) {
        if (Math.random() > 0.5) {
          const url = seedingConfig.EXAMPLE_RECEIPT_URL;
          const file = em.create(FileUpload, { id: nanoid(64), createdAt, updatedAt, name: 'exemple_facture', fileLastModifiedAt: createdAt, kind: FileKind.TeamReceipt, mimeType: 'application/pdf', size: 2000, url, user: transaction.createdBy, height: null, width: null });
          transaction.receipt = file;
        }
      }
    }
  }
}
