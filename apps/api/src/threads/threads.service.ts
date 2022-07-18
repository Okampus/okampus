import type { FilterQuery } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { ContentsService } from '../contents/contents.service';

import { Content } from '../contents/entities/content.entity';
import type { ContentListOptionsDto } from '../shared/lib/dto/list-options.dto';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { Colors } from '../shared/lib/types/enums/colors.enum';
import { ContentKind } from '../shared/lib/types/enums/content-kind.enum';
import { assertPermissions } from '../shared/lib/utils/assert-permission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { PaginatedResult } from '../shared/modules/pagination';
import { serializeOrder } from '../shared/modules/sorting';
import { ContentSortOrder } from '../shared/modules/sorting/sort-order.enum';
import { Tag } from '../tags/tag.entity';
import { User } from '../users/user.entity';
import { Validation } from '../validations/entities/validation.entity';
import { ValidationsService } from '../validations/validations.service';
import type { CreateThreadDto } from './dto/create-thread.dto';
import type { ThreadListOptionsDto } from './dto/thread-list-options.dto';
import type { UpdateThreadDto } from './dto/update-thread.dto';
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
    @InjectRepository(Validation) private readonly validationRepository: BaseRepository<Validation>,
    private readonly contentsService: ContentsService,
    private readonly threadSearchService: ThreadSearchService,
    private readonly validationsService: ValidationsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(user: User, createThreadDto: CreateThreadDto): Promise<Thread> {
    const post = await this.contentsService.createPost(user, createThreadDto);
    const thread = new Thread({ ...createThreadDto, post });
    post.contentMaster = thread;

    // TODO: Keep the original order
    const tags = await this.tagRepository.find({ name: { $in: createThreadDto.tags } });
    const newTags: Tag[] = createThreadDto.tags
      .filter(tag => !tags.some(t => t.name === tag))
      .map(name => new Tag({ name, color: Colors.Blue }));

    if (newTags.length > 0) {
      await this.tagRepository.persistAndFlush(newTags);
      thread.tags.add(...newTags);
    }
    thread.tags.add(...tags);

    const assignees = await this.userRepository.find({ id: { $in: createThreadDto.assignees } });
    thread.assignees.add(...assignees);
    thread.participants.add(user);

    await this.contentRepository.flush();
    await this.threadRepository.persistAndFlush(thread);
    await this.threadSearchService.add(thread);

    return thread;
  }

  public async findAll(
    user: User,
    filters?: ThreadListOptionsDto,
    options?: Required<ContentListOptionsDto>,
  ): Promise<PaginatedResult<Thread>> {
    const canSeeHiddenContent = this.caslAbilityFactory.isModOrAdmin(user);
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
        populate: ['post', 'tags', 'assignees', 'post.author', 'post.lastEdit', 'post.edits', 'opValidation', 'adminValidations'],
        orderBy: { post: serializeOrder(options?.sortBy ?? ContentSortOrder.Newest) },
      },
    );

    return allThreads;
  }

  public async findOne(user: User, id: number): Promise<Thread> {
    const thread = await this.threadRepository.findOneOrFail(
      { id },
      { populate: ['post.edits', 'tags', 'assignees', 'participants', 'opValidation', 'adminValidations'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Read, thread);

    // Const contents = await this.contentRepository.find(
    //   { contentMaster: thread },
    //   { populate: ['author', 'lastEdit'] },
    // );
    // thread.contents = contents;

    return thread;
  }

  public async update(user: User, id: number, updateThreadDto: UpdateThreadDto): Promise<Thread> {
    const thread = await this.threadRepository.findOneOrFail(
      { id },
      { populate: ['post', 'post.lastEdit', 'tags', 'assignees', 'opValidation', 'adminValidations'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, thread, Object.keys(updateThreadDto));

    // If we try to unlock the thread, then it is the only action that we can do.
    if (thread.locked && updateThreadDto?.locked === false)
      updateThreadDto = { locked: false };

    const {
      tags: wantedTags,
      assignees: wantedAssignees,
      validatedWithContent,
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
        const assignees = await this.userRepository.find({ id: { $in: wantedAssignees } });
        thread.assignees.set(assignees);
      }
    }

    if (typeof validatedWithContent === 'number') {
      const content = await this.contentRepository.findOneOrFail({
        id: validatedWithContent,
        kind: ContentKind.Reply,
        contentMaster: { id },
      });

      if (content.author.id === user.id) {
        if (thread.opValidation)
          await this.validationsService.remove(thread.opValidation?.content.id, user);

        thread.opValidation = await this.validationsService.create(validatedWithContent, user);
      } else {
        thread.adminValidations.add(await this.validationsService.create(validatedWithContent, user));
      }
      await this.validationRepository.flush();
    }

    if (updatedProps)
      wrap(thread).assign(updatedProps);

    await this.threadRepository.flush();
    await this.threadSearchService.update(thread);
    return thread;
  }

  public async remove(user: User, id: number): Promise<void> {
    const thread = await this.threadRepository.findOneOrFail({ id });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, thread);

    await this.threadRepository.removeAndFlush(thread);
    await this.threadSearchService.remove(thread.id.toString());
  }

  public async addTags(id: number, newTags: string[]): Promise<Thread> {
    const thread = await this.threadRepository.findOneOrFail(
      { id },
      { populate: ['post', 'tags', 'assignees', 'opValidation', 'adminValidations'] },
    );

    const tags = await this.tagRepository.find({ name: { $in: newTags } });
    thread.tags.add(...tags);
    await this.threadRepository.flush();
    return thread;
  }

  public async removeTags(id: number, droppedTags: string[]): Promise<void> {
    const thread = await this.threadRepository.findOneOrFail({ id }, { populate: ['tags'] });

    const tags = await this.tagRepository.find({ name: { $in: droppedTags } });
    thread.tags.remove(...tags);
    await this.threadRepository.flush();
  }

  public async addAssignees(id: number, assignees: string[]): Promise<Thread> {
    const thread = await this.threadRepository.findOneOrFail(
      { id },
      { populate: ['post', 'tags', 'assignees', 'opValidation', 'adminValidations'] },
    );

    const users = await this.userRepository.find({ id: { $in: assignees } });
    thread.assignees.add(...users.filter(user => !thread.assignees.contains(user)));
    await this.threadRepository.flush();
    return thread;
  }

  public async removeAssignees(id: number, assignees: string[]): Promise<void> {
    const thread = await this.threadRepository.findOneOrFail({ id }, { populate: ['assignees'] });

    const users = await this.userRepository.find({ id: { $in: assignees } });
    thread.assignees.remove(...users);
    await this.threadRepository.flush();
  }
}
