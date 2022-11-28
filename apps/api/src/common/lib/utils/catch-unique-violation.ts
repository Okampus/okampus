import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { BadRequestException } from '@nestjs/common';
import type { BaseEntity } from '../entities/base.entity';
import type { BaseRepository } from '../orm/base.repository';

export async function catchUniqueViolation<U extends BaseEntity, T extends BaseRepository<U>>(
  repository: T,
  entity: U,
): Promise<void> {
  try {
    await repository.persistAndFlush(entity);
  } catch (error: unknown) {
    if (error instanceof UniqueConstraintViolationException)
      throw new BadRequestException(`${entity.constructor.name} with same id already exists`);
    throw error;
  }
}
