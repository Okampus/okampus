import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Content } from '../contents/entities/content.entity';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { ValidationType } from '../shared/lib/types/enums/validation-type.enum';
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

  public async create(id: number, user: User, type: ValidationType): Promise<Validation> {
    const content = await this.contentRepository.findOneOrFail({ id }, ['author', 'contentMaster']);

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, content);

    if (type === ValidationType.OpValidated && content.author.id !== user.id)
      throw new BadRequestException('User is not original poster');
    else if (type === ValidationType.AdminValidated && !this.caslAbilityFactory.isModOrAdmin(user))
      throw new BadRequestException('User is not admin');

    const validation = new Validation({ content, user, type });

    try {
      await this.validationRepository.persistAndFlush(validation);
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('Content is already validated');
      throw error;
    }

    return validation;
  }

  public async findOne(user: User, id: number): Promise<Validation> {
    const content = await this.contentRepository.findOneOrFail({ id });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Read, content);

    return this.validationRepository.findOneOrFail({ content, user });
  }

  // Public async update(user: User, id: number, active: boolean): Promise<Validation> {
  //   const content = await this.contentRepository.findOneOrFail({ id });

  //   const ability = this.caslAbilityFactory.createForUser(user);
  //   assertPermissions(ability, Action.Interact, content);

  //   const validation = await this.validationRepository.findOneOrFail({ content, user });
  //   if (validation.active !== active) {
  //     validation.active = active;
  //     await this.validationRepository.flush();
  //   }

  //   return validation;
  // }

  public async remove(id: number, user: User): Promise<void> {
    const validation = await this.validationRepository.findOneOrFail({ content: { id }, user });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, validation.content);

    await this.validationRepository.removeAndFlush(validation);
  }
}
