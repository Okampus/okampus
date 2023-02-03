import { BaseRepository } from '../../../shards/abstract/base/base.repository';
// eslint-disable-next-line import/no-cycle
import { Bot } from './bot.entity';

export class BotRepository extends BaseRepository<Bot> {
  async findByEmail(email: string): Promise<Bot | null> {
    return this.findOne({ actor: { primaryEmail: email } });
  }

  async findBotByToken(token: string): Promise<Bot | null> {
    return await this.findOne({ tokenHash: token });
  }
}