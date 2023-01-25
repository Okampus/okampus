import { SessionProps } from '@okampus/shared/dtos';
import { BaseRepository } from '../../../shards/abstract/base/base.repository';
// eslint-disable-next-line import/no-cycle
import { Session } from './session.entity';

export class SessionRepository extends BaseRepository<Session> {
  async findActiveSession(userId: string, userSession: SessionProps): Promise<Session | null> {
    return await this.findOne({
      user: { id: userId },
      userAgent: userSession.userAgent,
      ip: userSession.ip,
      country: userSession.country,
      clientType: userSession.clientType,
      expiredAt: null,
      revokedAt: null,
    });
  }
}
