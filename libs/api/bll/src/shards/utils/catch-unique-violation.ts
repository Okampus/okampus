import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { BadRequestException } from '@nestjs/common';
import type { BaseEntity } from '@okampus/api/dal';
import type { EntityManager } from '@mikro-orm/core';

export async function catchUniqueViolation<U extends BaseEntity>(em: EntityManager, entity: U): Promise<void> {
  try {
    await em.persistAndFlush(entity);
  } catch (error: unknown) {
    if (error instanceof UniqueConstraintViolationException)
      throw new BadRequestException(`${entity.constructor.name} with same id already exists`);
    throw error;
  }
}
