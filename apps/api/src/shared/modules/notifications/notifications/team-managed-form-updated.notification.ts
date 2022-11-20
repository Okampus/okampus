import type { ITriggerPayload } from '@novu/node';
import { TeamForm } from '../../../../org/teams/forms/team-form.entity';
import type { User } from '../../../../uua/users/user.entity';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class TeamManagedFormUpdatedNotification extends Notification {
  public readonly type = NotificationType.TeamManagedFormUpdated;
  public readonly settingName = 'notificationTeamManagedFormUpdated';
  public readonly batchable = true;

  constructor(
    private readonly teamForm: TeamForm,
    private readonly meta: { executor: User },
  ) {
    super();
    this.excludedEmails.push(this.meta.executor.email);
  }

  public async getNotifiees(): Promise<Set<User>> {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

      const boardUsers = await this.getTeamBoard(this.teamForm.team);
      return this.filter(boardUsers);
  }

  public async ensurePayload(): Promise<void> {
    await this.entityManager.getRepository(TeamForm).populate(
      this.teamForm,
      ['team', 'createdBy'],
    );
  }

  public getPayload(): ITriggerPayload {
    return {
      executor: this.userToPayload(this.meta.executor),
      form: {
        id: this.teamForm.id,
        name: this.teamForm.name,
        description: this.teamForm.description,
        form: this.teamForm.schema,
        executor: this.userToPayload(this.teamForm.createdBy),
        isTemplate: this.teamForm.isTemplate,
        team: {
          id: this.teamForm.team.id,
          name: this.teamForm.team.name,
          shortDescription: this.teamForm.team.shortDescription,
          category: this.teamForm.team.category,
          labels: this.teamForm.team.labels.getItems().map(label => ({ name: label.name, type: label.type })),
          avatar: this.teamForm.team.avatar,
          banner: this.teamForm.team.banner,
        },
      },
    };
  }
}
