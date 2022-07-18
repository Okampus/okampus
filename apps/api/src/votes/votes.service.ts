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

  public async findOne(user: User, contentId: number): Promise<Vote> {
    const content = await this.contentRepository.findOneOrFail({ contentId });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Read, content);

    return await this.votesRepository.findOne({ content, user }) ?? this.noVote(user, content);
  }

  public async update(user: User, contentId: number, value: -1 | 0 | 1): Promise<Content> {
    const content = await this.contentRepository.findOneOrFail({ contentId });

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

    // eslint-disable-next-line unicorn/prefer-switch
    if (previousValue === 0) {
      if (value === 1)
        content.upvotes += 1;
      else
        content.downvotes += 1;
    } else if (previousValue === 1) {
      content.upvotes -= 1;
      if (value === -1)
        content.downvotes += 1;
    } else if (previousValue === -1) {
      content.downvotes -= 1;
      if (value === 1)
        content.upvotes += 1;
    }

    await this.contentRepository.flush();
    return content;
  }

  // Public async neutralize(user: User, contentId: number): Promise<NoVote | Vote> {
  //   const content = await this.contentRepository.findOneOrFail({ contentId });

  //   const ability = this.caslAbilityFactory.createForUser(user);
  //   assertPermissions(ability, Action.Interact, content);

  //   // Update pivot table
  //   const oldVote = await this.votesRepository.findOne({ content, user });
  //   if (!oldVote)
  //     return this.noVote(user, content);
  //   await this.votesRepository.removeAndFlush(oldVote);

  //   // Update content
  //   if (oldVote?.value === 1)
  //     content.nUpvotes--;
  //   else if (oldVote?.value === -1)
  //     content.nDownvotes--;

  //   await this.contentRepository.flush();
  //   return this.noVote(user, content);
  // }

  private noVote(user: User, content: Content): Vote {
    return {
      voteId: -1,
      content,
      user,
      value: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
