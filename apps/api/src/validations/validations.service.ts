import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Content } from '../contents/entities/content.entity';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { assertPermissions } from '../shared/lib/utils/assert-permission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { User } from '../users/user.entity';
import { Validation } from './entities/validation.entity';

@Injectable()
export class ValidationsService {
  constructor(
    @InjectRepository(Content) private readonly contentRepository: BaseRepository<Content>,
    @InjectRepository(Validation) private readonly validationRepository: BaseRepository<Validation>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(contentId: number, user: User): Promise<Validation> {
    const content = await this.contentRepository.findOneOrFail({ contentId }, { populate: ['parent'] });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, content);

    const validation = new Validation({ content, user });
    try {
      await this.validationRepository.persistAndFlush(validation);
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('Content is already validated');
      throw error;
    }
    return validation;
  }

  public async findOne(user: User, contentId: number): Promise<Validation> {
    const content = await this.contentRepository.findOneOrFail({ contentId });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Read, content);

    return this.validationRepository.findOneOrFail({ content, user });
  }

  // Public async update(user: User, contentId: number, active: boolean): Promise<Validation> {
  //   const content = await this.contentRepository.findOneOrFail({ contentId });

  //   const ability = this.caslAbilityFactory.createForUser(user);
  //   assertPermissions(ability, Action.Interact, content);

  //   const validation = await this.validationRepository.findOneOrFail({ content, user });
  //   if (validation.active !== active) {
  //     validation.active = active;
  //     await this.validationRepository.flush();
  //   }

  //   return validation;
  // }

  public async remove(contentId: number, user: User): Promise<void> {
    const validation = await this.validationRepository.findOneOrFail({ content: { contentId }, user });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, validation.content);

    await this.validationRepository.removeAndFlush(validation);
  }
}
