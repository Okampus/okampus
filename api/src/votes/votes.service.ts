import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Content } from '../contents/entities/content.entity';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { assertPermissions } from '../shared/lib/utils/assert-permission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { User } from '../users/user.entity';
import type { NoVote } from './vote.entity';
import { Vote } from './vote.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Content) private readonly contentRepository: BaseRepository<Content>,
    @InjectRepository(Vote) private readonly votesRepository: BaseRepository<Vote>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async findOne(user: User, contentId: number): Promise<NoVote | Vote> {
    const content = await this.contentRepository.findOneOrFail({ contentId });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Read, content);

    return await this.votesRepository.findOne({ content, user }) ?? this.noVote(user, content);
  }

  public async update(user: User, contentId: number, value: -1 | 1): Promise<NoVote | Vote> {
    const content = await this.contentRepository.findOneOrFail({ contentId });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, content);

    let vote = await this.votesRepository.findOne({ content, user });
    const previousValue = vote?.value;
    if (vote && previousValue === value)
      return vote;

    // Update pivot table
    if (vote)
      vote.value = value;
    else
      vote = new Vote({ content, user, value });
    await this.votesRepository.persistAndFlush(vote);

    // Update content
    if (value === 1)
      content.upvotes++;
    else if (value === -1)
      content.downvotes++;

    if (value === 1 && previousValue === -1)
      content.downvotes--;
    else if (value === -1 && previousValue === 1)
      content.upvotes--;

    await this.contentRepository.flush();
    return vote;
  }

  public async neutralize(user: User, contentId: number): Promise<NoVote | Vote> {
    const content = await this.contentRepository.findOneOrFail({ contentId });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, content);

    // Update pivot table
    const oldVote = await this.votesRepository.findOne({ content, user });
    if (!oldVote)
      return this.noVote(user, content);
    await this.votesRepository.removeAndFlush(oldVote);

    // Update content
    if (oldVote?.value === 1)
      content.upvotes--;
    else if (oldVote?.value === -1)
      content.downvotes--;

    await this.contentRepository.flush();
    return this.noVote(user, content);
  }

  private noVote(user: User, content: Content): NoVote {
    return { content, user, value: 0 };
  }
}
