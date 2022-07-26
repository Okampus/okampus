import type { ITriggerPayload } from '@novu/node';
import type { TeamForm } from '../../../../teams/forms/team-form.entity';
import type { User } from '../../../../users/user.entity';
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

  public async getNotifiees(): Promise<User[]> {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

      const boardUsers = await this.getTeamBoard(this.teamForm.team);
      return this.filter(boardUsers);
  }

  public getPayload(): ITriggerPayload {
    return {
      executor: this.userToPayload(this.meta.executor),
      form: {
        id: this.teamForm.id,
        name: this.teamForm.name,
        description: this.teamForm.description,
        form: this.teamForm.form,
        executor: this.userToPayload(this.teamForm.createdBy),
        isTemplate: this.teamForm.isTemplate,
        team: {
          id: this.teamForm.team.id,
          name: this.teamForm.team.name,
          shortDescription: this.teamForm.team.shortDescription,
          category: this.teamForm.team.category,
          tags: this.teamForm.team.tags,
          avatar: this.teamForm.team.avatar,
          banner: this.teamForm.team.banner,
        },
      },
    };
  }
}
