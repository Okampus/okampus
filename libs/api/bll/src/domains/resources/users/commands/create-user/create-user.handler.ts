import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException } from '@nestjs/common';
import type { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import type { BaseRepository } from '@okampus/api/dal';
import { Actor } from '@okampus/api/dal';
import type { UserFactory } from '../../../../factories/domains/users/user.factory';
import type { UserModel } from '../../../../factories/domains/users/user.model';
import { CreateUserCommand } from './create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userFactory: UserFactory,
    @InjectRepository(Actor) private readonly actorRepository: BaseRepository<Actor>
  ) {}

  async execute(command: CreateUserCommand): Promise<UserModel> {
    // Ensure that slug is unique within the tenant
    const tenant = command.tenant;
    const existingActor = await this.actorRepository.findOne({ slug: command.createUser.slug, tenant });
    if (existingActor) throw new ForbiddenException(`User with slug '${command.createUser.slug}'`);

    return await this.userFactory.createUser({ ...command.createUser, tenant }, command.actorImages);
  }
}
