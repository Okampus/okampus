import type { EntityManager } from '@mikro-orm/postgresql';
import type { ITriggerPayload } from '@novu/node';
import type { Settings } from '../../../../settings/settings.entity';
import { TeamMember } from '../../../../teams/members/team-member.entity';
import type { Team } from '../../../../teams/teams/team.entity';
import { User } from '../../../../users/user.entity';
import { TeamRole } from '../../../lib/types/enums/team-role.enum';
import { Role } from '../../authorization/types/role.enum';
import { SchoolRole } from '../../authorization/types/school-role.enum';
import type { NotificationType } from '../notification-type.enum';

export abstract class Notification {
  public readonly type: NotificationType;
  public readonly settingName: keyof Settings;
  public readonly excludedEmails: string[] = [];
  public readonly batchable: boolean = false;
  public payloadEnsured = false;

  // FIXME: The poor man's DI
  protected entityManager: EntityManager;

  public attachEntityManager(em: EntityManager): void {
    this.entityManager = em;
  }

  protected async getAdmins(setting: keyof Settings): Promise<User[]> {
    return this.entityManager.getRepository(User).find({
      $or: [
        { roles: { $contains: [Role.Admin] } },
        { schoolRole: SchoolRole.Admin },
      ],
      settings: {
        [setting]: { $gt: 0 },
      },
    });
  }

  protected async getTeamBoard(team: Team): Promise<User[]> {
    const members = await this.entityManager.getRepository(TeamMember).find({
      team,
      role: { $in: [TeamRole.Secretary, TeamRole.Treasurer, TeamRole.Coowner, TeamRole.Owner] },
      user: {
        settings: {
          [this.settingName]: { $gte: 0 },
        },
      },
    }, { populate: ['user'] });

    return members.map(member => member.user);
  }

  protected filter(userOrUsers: User | User[]): Set<User> {
    const users = [userOrUsers].flat();
    const filtered = users.filter(user => !this.excludedEmails.includes(user.email));
    return new Set(filtered);
  }

  protected userToPayload(this: void, user: User): Record<string, string> {
    return {
      fullName: user.getFullName(),
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
    };
  }

  public abstract getNotifiees(): Promise<Set<User>> | Set<User>;
  public abstract ensurePayload(): Promise<void>;
  public abstract getPayload(user?: User): ITriggerPayload;
}
