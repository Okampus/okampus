import type { ITriggerPayload } from '@novu/node';
import { TeamEvent } from '../../../../org/teams/events/team-event.entity';
import { ValidationStep } from '../../../../org/tenants/validation-steps/validation-step.entity';
import type { User } from '../../../../uua/users/user.entity';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class AdminTeamEventValidationStepNotification extends Notification {
  public readonly type = NotificationType.AdminTeamEventValidationStep;
  public readonly settingName = 'notificationAdminTeamEventValidationStep';
  public readonly batchable = true;

  constructor(
    private readonly teamEvent: TeamEvent,
    private readonly validationStep: ValidationStep,
  ) {
    super();
  }

  public getNotifiees(): Set<User> {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

    return this.filter(this.validationStep.users.getItems());
  }

  public async ensurePayload(): Promise<void> {
    await this.entityManager.getRepository(TeamEvent).populate(
      this.teamEvent,
      ['team', 'supervisor', 'createdBy'],
    );
    await this.entityManager.getRepository(ValidationStep).populate(
      this.validationStep,
      ['users'],
    );
  }

  public getPayload(): ITriggerPayload {
    return {
      validationStep: {
        id: this.validationStep.id,
        name: this.validationStep.name,
        step: this.validationStep.step,
      },
      event: {
        start: this.teamEvent.start,
        end: this.teamEvent.end,
        name: this.teamEvent.name,
        description: this.teamEvent.description,
        price: this.teamEvent.price,
        location: this.teamEvent.location,
        supervisor: this.teamEvent.supervisor ? this.userToPayload(this.teamEvent.supervisor.user) : null,
        private: this.teamEvent.private,
        meta: this.teamEvent.meta,
        team: {
          id: this.teamEvent.team.id,
          name: this.teamEvent.team.name,
          shortDescription: this.teamEvent.team.shortDescription,
          category: this.teamEvent.team.category,
          labels: this.teamEvent.team.labels.getItems().map(label => ({ name: label.name, type: label.type })),
          avatar: this.teamEvent.team.avatar,
          banner: this.teamEvent.team.banner,
        },
      },
    };
  }
}
