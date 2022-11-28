import type { FilterQuery } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import {
  classes,
  clubString,
  groupTypeIcons,
  scopeString,
} from '@common/configs/strings';
import type { ContentListOptionsDto } from '@common/lib/dto/list-options.dto';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { ClassType } from '@common/lib/types/enums/class-type.enum';
import { Colors } from '@common/lib/types/enums/colors.enum';
import { ContentKind } from '@common/lib/types/enums/content-kind.enum';
import { ValidationType } from '@common/lib/types/enums/validation-type.enum';
import { assertPermissions } from '@common/lib/utils/assert-permission';
import { Action } from '@common/modules/authorization';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import type { PaginatedResult } from '@common/modules/pagination';
import { serializeOrder } from '@common/modules/sorting';
import { ContentSortOrder } from '@common/modules/sorting/sort-order.enum';
import { Tag } from '@modules/catalog/tags/tag.entity';
import type { CreateThreadDto } from '@modules/create/threads/dto/create-thread.dto';
import { Validation } from '@modules/interact/validations/validation.entity';
import { ValidationsService } from '@modules/interact/validations/validations.service';
import { Class } from '@modules/org/classes/class.entity';
import { Team } from '@modules/org/teams/team.entity';
import { User } from '@modules/uaa/users/user.entity';
import { ContentsService } from '../contents/contents.service';
import { Content } from '../contents/entities/content.entity';
import type { ThreadListOptionsDto } from './dto/thread-list-options.dto';
import type { UpdateThreadDto } from './dto/update-thread.dto';
import { Thread } from './thread.entity';

@Injectable()
export class ThreadsService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(Thread)
    private readonly threadRepository: BaseRepository<Thread>,
    @InjectRepository(Tag) private readonly tagRepository: BaseRepository<Tag>,
    @InjectRepository(User)
    private readonly userRepository: BaseRepository<User>,
    @InjectRepository(Class)
    private readonly classRepository: BaseRepository<Class>,
    @InjectRepository(Team)
    private readonly teamRepository: BaseRepository<Team>,
    @InjectRepository(Content)
    private readonly contentRepository: BaseRepository<Content>,
    @InjectRepository(Validation)
    private readonly validationRepository: BaseRepository<Validation>,
    private readonly contentsService: ContentsService,
    private readonly validationsService: ValidationsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(
    user: User,
    createThreadDto: CreateThreadDto,
  ): Promise<Thread> {
    const post = await this.contentsService.createPost(user, createThreadDto);
    const {
 tags, assignedTeams, assignedUsers, ...createThread
} = createThreadDto;

    const thread = new Thread({ ...createThread, post });
    post.contentMaster = thread;

    if (createThread.scope === 'clubs') {
      thread.scope = null;
      // FIXME: don't rely on hardcoded value / array order
      tags.unshift(
        `${scopeString}${classes[0].name}${groupTypeIcons[ClassType.Everyone]}`,
      );
      tags.unshift(`${groupTypeIcons.clubs}${clubString}`);
    } else {
      const targetClass = await this.classRepository.findOneOrFail({
        id: createThread.scope,
      });
      thread.scope = targetClass;
      tags.unshift(
        `${scopeString}${targetClass.name}${groupTypeIcons[targetClass.type]}`,
      );
    }

    // TODO: Keep the original order
    const existingTags = await this.tagRepository.find({ name: { $in: tags } });
    const newTags: Tag[] = tags
      .filter(tag => !existingTags.some(t => t.name === tag))
      .map(name => new Tag({ name, color: Colors.Blue }));

    if (newTags.length > 0) {
      await this.tagRepository.persistAndFlush(newTags);
      thread.tags.add(...newTags);
    }
    thread.tags.add(...existingTags);

    const foundTeamAssignees = await this.teamRepository.find({
      id: { $in: assignedTeams },
    });
    thread.assignedTeams.add(...foundTeamAssignees);

    const foundUserAssignees = await this.userRepository.find({
      id: { $in: assignedUsers },
    });
    thread.assignedUsers.add(...foundUserAssignees);
    thread.participants.add(user);

    await this.contentRepository.flush();
    await this.threadRepository.persistAndFlush(thread);

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

    return await this.threadRepository.findWithPagination(options, query, {
      // TODO: Remove 'post.lastEdit' once we add activities
      populate: [
        'post',
        'tags',
        'assignedTeams',
        'assignedUsers',
        'post.author',
        'post.lastEdit',
        'post.edits',
        'opValidation',
        'adminValidations',
      ],
      orderBy: {
        post: serializeOrder(options?.sortBy ?? ContentSortOrder.Newest),
      },
    });
  }

  public async findOne(user: User, id: number): Promise<Thread> {
    const thread = await this.threadRepository.findOneOrFail(
      { id },
      {
        populate: [
          'post',
          'post.author',
          'post.edits',
          'post.lastEdit',
          'tags',
          'assignedTeams',
          'assignedUsers',
          'participants',
          'opValidation',
          'adminValidations',
        ],
      },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Read, thread);

    return thread;
  }

  public async update(
    user: User,
    id: number,
    updateThreadDto: UpdateThreadDto,
  ): Promise<Thread> {
    const thread = await this.threadRepository.findOneOrFail(
      { id },
      {
        populate: [
          'post',
          'post.author',
          'post.lastEdit',
          'tags',
          'assignedTeams',
          'assignedUsers',
          'participants',
          'opValidation',
          'opValidation.content',
          'adminValidations',
        ],
      },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(
      ability,
      Action.Update,
      thread,
      Object.keys(updateThreadDto),
    );

    // If we try to unlock the thread, then it is the only action that we can do.
    if (thread.locked && updateThreadDto?.locked === false)
      updateThreadDto = { locked: false };

    const {
      tags: wantedTags,
      assignedTeams: wantedTeamAssignees,
      assignedUsers: wantedUserAssignees,
      validatedWithContent,
      scope,
      ...updatedProps
    } = updateThreadDto;

    if (scope) {
      const targetClass = await this.classRepository.findOneOrFail({
        id: scope,
      });
      thread.scope = targetClass;
    }

    if (wantedTags) {
      if (wantedTags.length === 0) {
        thread.tags.removeAll();
      } else {
        const tags = await this.tagRepository.find({
          name: { $in: wantedTags },
        });
        thread.tags.set(tags);
      }
    }

    if (wantedTeamAssignees) {
      if (wantedTeamAssignees.length === 0) {
        thread.assignedTeams.removeAll();
      } else {
        const assignees = await this.teamRepository.find({
          id: { $in: wantedTeamAssignees },
        });
        thread.assignedTeams.set(assignees);
      }
    }

    if (wantedUserAssignees) {
      if (wantedUserAssignees.length === 0) {
        thread.assignedUsers.removeAll();
      } else {
        const assignees = await this.userRepository.find({
          id: { $in: wantedUserAssignees },
        });
        thread.assignedUsers.set(assignees);
      }
    }

    if (typeof validatedWithContent === 'number') {
      const content = await this.contentRepository.findOneOrFail({
        id: validatedWithContent,
        kind: ContentKind.Reply,
        contentMaster: { id },
      });

      if (this.caslAbilityFactory.isModOrAdmin(user)) {
        const validation = await this.validationsService.create(
          validatedWithContent,
          user,
          ValidationType.Admin,
        );
        thread.adminValidations.add(validation);
      } else if (content.author.id === user.id) {
        if (thread.opValidation) // Remove previous opValidation
          await this.validationsService.remove(thread.opValidation.content.id, user);

        thread.opValidation = await this.validationsService.create(
          validatedWithContent,
          user,
          ValidationType.Op,
        );
      }

      await this.validationRepository.flush();
    }

    if (updatedProps)
wrap(thread).assign(updatedProps);

    await this.threadRepository.flush();
    return thread;
  }

  public async remove(user: User, id: number): Promise<void> {
    const thread = await this.threadRepository.findOneOrFail({ id });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, thread);

    await this.threadRepository.removeAndFlush(thread);
  }

  public async addTags(id: number, newTags: string[]): Promise<Thread> {
    const thread = await this.threadRepository.findOneOrFail(
      { id },
      {
        populate: [
          'post',
          'tags',
          'assignedTeams',
          'assignedUsers',
          'opValidation',
          'adminValidations',
        ],
      },
    );

    const tags = await this.tagRepository.find({ name: { $in: newTags } });
    thread.tags.add(...tags);
    await this.threadRepository.flush();
    return thread;
  }

  public async removeTags(id: number, droppedTags: string[]): Promise<void> {
    const thread = await this.threadRepository.findOneOrFail(
      { id },
      { populate: ['tags'] },
    );

    const tags = await this.tagRepository.find({ name: { $in: droppedTags } });
    thread.tags.remove(...tags);
    await this.threadRepository.flush();
  }

  public async addUserAssignees(
    id: number,
    assignees: string[],
  ): Promise<Thread> {
    const thread = await this.threadRepository.findOneOrFail(
      { id },
      {
        populate: [
          'post',
          'tags',
          'assignedTeams',
          'assignedUsers',
          'opValidation',
          'adminValidations',
        ],
      },
    );

    const users = await this.userRepository.find({ id: { $in: assignees } });
    thread.assignedUsers.add(
      ...users.filter(user => !thread.assignedUsers.contains(user)),
    );
    await this.threadRepository.flush();
    return thread;
  }

  public async addTeamAssignees(
    id: number,
    assignees: number[],
  ): Promise<Thread> {
    const thread = await this.threadRepository.findOneOrFail(
      { id },
      {
        populate: [
          'post',
          'tags',
          'assignedTeams',
          'assignedUsers',
          'opValidation',
          'adminValidations',
        ],
      },
    );

    const teams = await this.teamRepository.find({ id: { $in: assignees } });
    thread.assignedTeams.add(
      ...teams.filter(user => !thread.assignedTeams.contains(user)),
    );
    await this.threadRepository.flush();
    return thread;
  }

  public async removeUserAssignees(
    id: number,
    assignees: string[],
  ): Promise<void> {
    const thread = await this.threadRepository.findOneOrFail(
      { id },
      { populate: ['assignedTeams', 'assignedUsers'] },
    );

    const users = await this.userRepository.find({ id: { $in: assignees } });
    thread.assignedUsers.remove(...users);
    await this.threadRepository.flush();
  }

  public async removeTeamAssignees(
    id: number,
    assignees: number[],
  ): Promise<void> {
    const thread = await this.threadRepository.findOneOrFail(
      { id },
      { populate: ['assignedTeams', 'assignedUsers'] },
    );

    const teams = await this.teamRepository.find({ id: { $in: assignees } });
    thread.assignedTeams.remove(...teams);
    await this.threadRepository.flush();
  }
}
