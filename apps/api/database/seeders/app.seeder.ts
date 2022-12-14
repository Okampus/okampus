/* eslint-disable object-curly-newline */
import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { MembershipRequestIssuer } from '../../src/common/lib/types/enums/membership-request-issuer.enum';
import { MembershipRequestState } from '../../src/common/lib/types/enums/membership-request-state.enum';
import { TeamRole } from '../../src/common/lib/types/enums/team-role.enum';
import { sampleArray, sampleArrayWithRest } from '../../src/common/lib/utils/array-utils';
import { randomEnum } from '../../src/common/lib/utils/random-enum';
import { randomInt } from '../../src/common/lib/utils/random-utils';
import { ScopeRole } from '../../src/common/modules/authorization/types/scope-role.enum';
import { TeamMember } from '../../src/modules/org/teams/members/team-member.entity';
import { TeamMembershipRequest } from '../../src/modules/org/teams/requests/team-membership-request.entity';
import type { ApprovalStep } from '../../src/modules/org/tenants/approval-steps/approval-step.entity';
import type { User } from '../../src/modules/uaa/users/user.entity';
import { ApprovalStepFactory } from './factories/approval-step.factory';
import { EventFactory } from './factories/event.factory';
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
};

const _issuer = (): MembershipRequestIssuer => randomEnum(MembershipRequestIssuer);
const _role = (): TeamRole => randomEnum(TeamRole);
const _actions = (): { activityCount: number; activityScore: number } => ({
  activityCount: randomInt(0, 10),
  activityScore: randomInt(0, 10) * 5,
});

export class DatabaseSeeder extends Seeder {
  public async run(em: EntityManager): Promise<void> {
    const createdAt = new Date();
    const updatedAt = new Date();

    const tenant = await new TenantFactory(em).createOne();

    const admins = await new UserFactory(em, tenant, ScopeRole.Admin).create(seedingConfig.N_ADMINS);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const teachers = await new UserFactory(em, tenant, ScopeRole.Teacher).create(seedingConfig.N_TEACHERS);
    const students = await new UserFactory(em, tenant, ScopeRole.Student).create(seedingConfig.N_STUDENTS);

    const approvalStepsCreations: Array<Promise<ApprovalStep>> = [];

    let restAdmins = admins;
    let stepAdmins: User[];

    for (let i = 0; i < seedingConfig.N_APPROVAL_STEPS; i++) {
      [stepAdmins, restAdmins] = sampleArrayWithRest(
        restAdmins, randomInt(seedingConfig.MIN_ADMINS_BY_STEP, seedingConfig.MAX_ADMINS_BY_STEP),
      );
      approvalStepsCreations.push((async (): Promise<ApprovalStep> => {
        const step = await new ApprovalStepFactory(em, tenant, i + 1).createOne();
        step.users.add(stepAdmins);
        return step;
      })());
    }
    const approvalSteps = await Promise.all(approvalStepsCreations);

    const teams = await new TeamFactory(em, tenant).create(10);

    for (const team of teams) {
      const [supervisors, rest] = sampleArrayWithRest(students, 4);
      const [president, treasurer, secretary, manager] = supervisors;
      const [members, others] = sampleArrayWithRest(
        rest, seedingConfig.MIN_MEMBERS, Math.min(students.length - 4, seedingConfig.MAX_MEMBERS),
      );
      const requests = sampleArray(
        others, seedingConfig.MIN_REQUESTS, Math.min(others.length, seedingConfig.MAX_REQUESTS),
      );

      const _member = { createdAt, updatedAt, active: true, joinDate: new Date(), team };
      const _request = { createdAt, updatedAt, team, state: MembershipRequestState.Pending };

      em.create(TeamMember, { ..._member, user: president, role: TeamRole.Owner, ..._actions() });
      em.create(TeamMember, { ..._member, user: treasurer, role: TeamRole.Treasurer, ..._actions() });
      em.create(TeamMember, { ..._member, user: secretary, role: TeamRole.Secretary, ..._actions() });
      em.create(TeamMember, { ..._member, user: manager, role: TeamRole.Manager, ..._actions() });
      members.map(user => em.create(TeamMember, { ..._member, user, role: TeamRole.Member, ..._actions() }));
      requests.map((user) => {
        const issuer = _issuer();
        const issuedBy = issuer === MembershipRequestIssuer.Team ? sampleArray(supervisors, 1)[0] : user;
        return em.create(TeamMembershipRequest, { ..._request, user, issuer, role: _role(), issuedBy });
      });

      // eslint-disable-next-line no-await-in-loop, @typescript-eslint/no-unused-vars
      const events = await new EventFactory(em, team, approvalSteps)
        .create(randomInt(seedingConfig.MIN_EVENTS_BY_CLUB, seedingConfig.MAX_EVENTS_BY_CLUB));
    }
  }
}
