import type { NamingStrategy } from '@mikro-orm/core';
import { UnderscoreNamingStrategy } from '@mikro-orm/core';

export class BaseNamingStrategy extends UnderscoreNamingStrategy implements NamingStrategy {
  public joinKeyColumnName(entityName: string, _referencedColumnName?: string): string {
    return `${this.classToTableName(entityName)}_${this.referenceColumnName()}`;
  }
}
