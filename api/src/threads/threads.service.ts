import type { FilterQuery } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { ContentsService } from '../contents/contents.service';
import { Content } from '../contents/entities/content.entity';
import { Favorite } from '../favorites/favorite.entity';
import { Reaction } from '../reactions/reaction.entity';
import { Report } from '../reports/report.entity';
import type { ContentListOptionsDto } from '../shared/lib/dto/list-options.dto';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { ContentKind } from '../shared/lib/types/enums/content-kind.enum';
import { ContentMasterType } from '../shared/lib/types/enums/content-master-type.enum';
import { assertPermissions } from '../shared/lib/utils/assert-permission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { PaginatedResult } from '../shared/modules/pagination';
import { serializeOrder } from '../shared/modules/sorting';
import { Tag } from '../tags/tag.entity';
import { User } from '../users/user.entity';
import { Vote } from '../votes/vote.entity';
import type { CreateThreadDto } from './dto/create-thread.dto';
import type { ThreadListOptionsDto } from './dto/thread-list-options.dto';
import type { UpdateThreadDto } from './dto/update-thread.dto';
import type { ThreadInteractions } from './thread-interactions.interface';
import { ThreadSearchService } from './thread-search.service';
import { Thread } from './thread.entity';

@Injectable()
export class ThreadsService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(Thread) private readonly threadRepository: BaseRepository<Thread>,
    @InjectRepository(Tag) private readonly tagRepository: BaseRepository<Tag>,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    @InjectRepository(Content) private readonly contentRepository: BaseRepository<Content>,
    @InjectRepository(Favorite) private readonly favoriteRepository: BaseRepository<Favorite>,
    @InjectRepository(Reaction) private readonly reactionRepository: BaseRepository<Reaction>,
    @InjectRepository(Vote) private readonly voteRepository: BaseRepository<Vote>,
    @InjectRepository(Report) private readonly reportRepository: BaseRepository<Report>,
    private readonly contentsService: ContentsService,
    private readonly threadSearchService: ThreadSearchService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(user: User, createThreadDto: CreateThreadDto): Promise<Thread> {
    const thread = new Thread(createThreadDto);

    // TODO: Keep the original order
    const tags = await this.tagRepository.find({ name: { $in: createThreadDto.tags } });
    thread.tags.add(...tags);

    const assignees = await this.userRepository.find({ userId: { $in: createThreadDto.assignees } });
    thread.assignees.add(...assignees);

    thread.participants.add(user);

    thread.post = await this.contentsService.createPost(user, thread, {
      ...createThreadDto,
      contentMasterType: ContentMasterType.Thread,
    });

    await this.threadRepository.persistAndFlush(thread);
    await this.threadSearchService.add(thread);

    return thread;
  }

  public async findAll(
    user: User,
    filters?: ThreadListOptionsDto,
    options?: Required<ContentListOptionsDto>,
  ): Promise<PaginatedResult<Thread>> {
    const canSeeHiddenContent = this.caslAbilityFactory.canSeeHiddenContent(user);
    const visibility = canSeeHiddenContent ? {} : { isVisible: true };
    let query: FilterQuery<Thread> = {};

    if (visibility?.isVisible)
      query = { ...query, post: visibility };
    if (typeof filters?.type !== 'undefined')
      query = { ...query, type: filters.type };

    const allThreads = await this.threadRepository.findWithPagination(
      options,
      query,
      {
        // TODO: Remove 'post.lastEdit' once we add activities
        populate: ['post', 'tags', 'assignees', 'post.author', 'post.lastEdit', 'opValidatedWith', 'adminValidatedWith', 'adminValidatedBy'],
        orderBy: { post: serializeOrder(options?.sortBy) },
      },
    );
    const threadIds = allThreads.items.map(thread => thread.contentMasterId);

    const allReplies: Array<{ contentMaster: number; count: string }> = await this.contentRepository
      .createQueryBuilder()
      .count('contentId')
      .select(['contentMaster', 'count'])
      .where({ ...visibility, kind: ContentKind.Reply, contentMaster: { $in: threadIds } })
      .groupBy('contentMaster')
      .execute();
    const allReplyCounts = new Map(allReplies.map(entry => [entry.contentMaster, entry.count]));

    const favorites = await this.favoriteRepository.find({
      user,
      content: { kind: ContentKind.Post, contentMasterId: { $in: threadIds } },
    });
    const votes = await this.voteRepository.find({
      user,
      content: { kind: ContentKind.Post, contentMasterId: { $in: threadIds } },
    });

    allThreads.items = allThreads.items.map((thread) => {
      // TODO: Maybe find a better way to add these properties? Something virtual? computed on-the-fly? added elsewhere?
      // @ts-expect-error: We add a new property to the object, but it's fine.
      thread.replyCount = Number(allReplyCounts.get(thread.contentMasterId) ?? 0);
      // @ts-expect-error: We add a new property to the object, but it's fine.
      thread.vote = votes.find(({ content }) => content.contentMasterId === thread.contentMasterId)?.value ?? 0;
      // @ts-expect-error: We add a new property to the object, but it's fine.
      thread.favorited = favorites.some(({ content }) => content.contentMasterId === thread.contentMasterId);
      return thread;
    });
    return allThreads;
  }

  public async findOne(user: User, contentMasterId: number): Promise<Thread> {
    const thread: Thread & { contents?: Content[] } = await this.threadRepository.findOneOrFail(
      { contentMasterId },
      { populate: ['tags', 'assignees', 'participants', 'opValidatedWith', 'adminValidatedWith', 'adminValidatedBy'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Read, thread);

    const contents = await this.contentRepository.find(
      { contentMaster: thread },
      { populate: ['author', 'lastEdit'] },
    );
    thread.contents = contents;

    return thread;
  }

  public async findInteractions(user: User, contentMasterId: number): Promise<ThreadInteractions> {
    const thread = await this.threadRepository.findOneOrFail({ contentMasterId }, { populate: ['post'] });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Read, thread);

    const favorites = await this.favoriteRepository.find({ user, content: { contentMaster: thread } });
    const reactions = await this.reactionRepository.find({ user, content: { contentMaster: thread } });
    const votes = await this.voteRepository.find({ user, content: { contentMaster: thread } });
    const reports = await this.reportRepository.find({ reporter: user, content: { contentMaster: thread } });

    return {
      favorites,
      reactions,
      votes,
      reports,
    };
  }

  public async update(user: User, contentMasterId: number, updateThreadDto: UpdateThreadDto): Promise<Thread> {
    const thread = await this.threadRepository.findOneOrFail(
      { contentMasterId },
      { populate: ['post', 'post.lastEdit', 'tags', 'assignees', 'opValidatedWith', 'adminValidatedWith', 'adminValidatedBy'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, thread, Object.keys(updateThreadDto));

    // If we try to unlock the thread, then it is the only action that we can do.
    if (thread.locked && updateThreadDto?.locked === false)
      updateThreadDto = { locked: false };

    const {
      tags: wantedTags,
      assignees: wantedAssignees,
      opValidatedWith,
      adminValidatedWith,
      ...updatedProps
    } = updateThreadDto;

    if (wantedTags) {
      if (wantedTags.length === 0) {
        thread.tags.removeAll();
      } else {
        const tags = await this.tagRepository.find({ name: { $in: wantedTags } });
        thread.tags.set(tags);
      }
    }

    if (wantedAssignees) {
      if (wantedAssignees.length === 0) {
        thread.assignees.removeAll();
      } else {
        const assignees = await this.userRepository.find({ userId: { $in: wantedAssignees } });
        thread.assignees.set(assignees);
      }
    }

    const validationReplyQuery = { kind: ContentKind.Reply, contentMaster: { contentMasterId } };

    if (typeof opValidatedWith !== 'undefined') {
      thread.opValidatedWith = opValidatedWith
        ? await this.contentRepository.findOneOrFail({ contentId: opValidatedWith, ...validationReplyQuery })
        : null;
    }

    if (typeof adminValidatedWith !== 'undefined') {
      thread.adminValidatedWith = adminValidatedWith
        ? await this.contentRepository.findOneOrFail({ contentId: adminValidatedWith, ...validationReplyQuery })
        : null;
      thread.adminValidatedBy = adminValidatedWith
        ? user
        : null;
    }

    if (updatedProps)
      wrap(thread).assign(updatedProps);

    await this.threadRepository.flush();
    await this.threadSearchService.update(thread);
    return thread;
  }

  public async remove(user: User, contentMasterId: number): Promise<void> {
    const thread = await this.threadRepository.findOneOrFail({ contentMasterId });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, thread);

    await this.threadRepository.removeAndFlush(thread);
    await this.threadSearchService.remove(thread.contentMasterId.toString());
  }

  public async addTags(contentMasterId: number, newTags: string[]): Promise<Thread> {
    const thread = await this.threadRepository.findOneOrFail(
      { contentMasterId },
      { populate: ['post', 'tags', 'assignees', 'opValidatedWith', 'adminValidatedWith', 'adminValidatedBy'] },
    );

    const tags = await this.tagRepository.find({ name: { $in: newTags } });
    thread.tags.add(...tags);
    await this.threadRepository.flush();
    return thread;
  }

  public async removeTags(contentMasterId: number, droppedTags: string[]): Promise<void> {
    const thread = await this.threadRepository.findOneOrFail({ contentMasterId }, { populate: ['tags'] });

    const tags = await this.tagRepository.find({ name: { $in: droppedTags } });
    thread.tags.remove(...tags);
    await this.threadRepository.flush();
  }

  public async addAssignees(contentMasterId: number, assignees: string[]): Promise<Thread> {
    const thread = await this.threadRepository.findOneOrFail(
      { contentMasterId },
      { populate: ['post', 'tags', 'assignees', 'opValidatedWith', 'adminValidatedWith', 'adminValidatedBy'] },
    );

    const users = await this.userRepository.find({ userId: { $in: assignees } });
    thread.assignees.add(...users.filter(user => !thread.assignees.contains(user)));
    await this.threadRepository.flush();
    return thread;
  }

  public async removeAssignees(contentMasterId: number, assignees: string[]): Promise<void> {
    const thread = await this.threadRepository.findOneOrFail({ contentMasterId }, { populate: ['assignees'] });

    const users = await this.userRepository.find({ userId: { $in: assignees } });
    thread.assignees.remove(...users);
    await this.threadRepository.flush();
  }
}
