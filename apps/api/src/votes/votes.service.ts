import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Content } from '../contents/entities/content.entity';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { assertPermissions } from '../shared/lib/utils/assert-permission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { User } from '../users/user.entity';
import { Vote } from './vote.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Content) private readonly contentRepository: BaseRepository<Content>,
    @InjectRepository(Vote) private readonly votesRepository: BaseRepository<Vote>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async findOne(user: User, id: number): Promise<Vote> {
    const content = await this.contentRepository.findOneOrFail({ id });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Read, content);

    return await this.votesRepository.findOne({ content, user }) ?? {
      id: -1,
      content,
      user,
      value: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  public async update(user: User, id: number, value: -1 | 0 | 1): Promise<Content> {
    const content = await this.contentRepository.findOneOrFail({ id }, { populate: ['lastEdit', 'author'] });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, content);

    let vote = await this.votesRepository.findOne({ content, user });
    const previousValue = vote?.value ?? 0;
    if (vote && previousValue === value)
      return content;

    // Update pivot table
    if (vote)
      vote.value = value;
    else
      vote = new Vote({ content, user, value });
    await this.votesRepository.persistAndFlush(vote);

    switch (previousValue) {
      case 0:
        if (value === 1)
          content.upvoteCount++;
        else
          content.downvoteCount++;
        break;
      case 1:
        content.upvoteCount--;
        if (value === -1)
          content.downvoteCount++;
        break;
      case -1:
        content.downvoteCount--;
        if (value === 1)
          content.upvoteCount++;
        break;
    }

    await this.contentRepository.flush();
    return content;
  }
}
