import { EntityRepository } from '@mikro-orm/postgresql';
import type { Log } from './log.entity';

export class LogRepository extends EntityRepository<Log> {
  //
}
