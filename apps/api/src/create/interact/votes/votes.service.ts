import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../shared/lib/orm/base.repository';
import { assertPermissions } from '../../../shared/lib/utils/assert-permission';
import { Action } from '../../../shared/modules/authorization';
import { CaslAbilityFactory } from '../../../shared/modules/casl/casl-ability.factory';
import type { PaginatedResult, PaginateDto } from '../../../shared/modules/pagination';
import { User } from '../../../uua/users/user.entity';
import { Content } from '../../contents/entities/content.entity';
import { Vote } from './vote.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Content) private readonly contentRepository: BaseRepository<Content>,
    @InjectRepository(Vote) private readonly voteRepository: BaseRepository<Vote>,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async findAll(
    currentUser: User,
    userId: string,
    paginationOptions?: Required<PaginateDto>,
  ): Promise<PaginatedResult<Vote>> {
    const user = await this.userRepository.findOneOrFail(userId);
    const canSeeHiddenContent = this.caslAbilityFactory.isModOrAdmin(currentUser);
    const visibilityQuery = canSeeHiddenContent ? {} : { content: { isVisible: true } };
    return await this.voteRepository.findWithPagination(
      paginationOptions,
      { user, ...visibilityQuery },
      {
        populate: [
          'user',
          'content',
          'content.author',
          'content.parent',
          'content.contentMaster',
          'content.contentMaster.tags',
        ],
        orderBy: { createdAt: 'DESC' },
      },
    );
  }

  public async findOne(user: User, id: number): Promise<Vote | null> {
    const content = await this.contentRepository.findOneOrFail({ id });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Read, content);

    return await this.voteRepository.findOne({ content, user });
  }

  public async update(user: User, id: number, value: -1 | 0 | 1): Promise<Content> {
    const content = await this.contentRepository.findOneOrFail({ id }, { populate: ['lastEdit', 'author'] });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, content);

    let vote = await this.voteRepository.findOne({ content, user });
    const previousValue = vote?.value ?? 0;
    if (vote && previousValue === value)
      return content;

    // Update pivot table
    if (vote)
      vote.value = value;
    else
      vote = new Vote({ content, user, value });
    await this.voteRepository.persistAndFlush(vote);

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
