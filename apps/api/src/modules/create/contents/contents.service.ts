import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PubSubEngine } from 'graphql-subscriptions';
import groupBy from 'lodash.groupby';
import { config } from '@common/configs/config';
import { APP_PUB_SUB } from '@common/lib/constants';
import type { ContentListOptionsDto } from '@common/lib/dto/list-options.dto';
import { ContentMaster } from '@common/lib/entities/content-master.entity';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { ContentKind } from '@common/lib/types/enums/content-kind.enum';
import { ContentMasterType } from '@common/lib/types/enums/content-master-type.enum';
import { SubscriptionType } from '@common/lib/types/enums/subscription-type.enum';
import { assertPermissions } from '@common/lib/utils/assert-permission';
import { Action } from '@common/modules/authorization';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import {
  BlogSubscribedUpdatedNotification,
  ContentRemovedNotification,
  ThreadSubscribedUpdatedNotification,
} from '@common/modules/notifications/notifications';
import { NotificationsService } from '@common/modules/notifications/notifications.service';
import type { PaginatedResult, PaginateDto } from '@common/modules/pagination';
import { serializeOrder } from '@common/modules/sorting';
import type { CreateOrphanContentDto } from '@modules/create/contents/dto/create-orphan-content.dto';
import type { Interactions } from '@modules/create/contents/interactions.model';
import { Favorite } from '@modules/interact/favorites/favorite.entity';
import { Reaction } from '@modules/interact/reactions/reaction.entity';
import { Report } from '@modules/interact/reports/report.entity';
import { Vote } from '@modules/interact/votes/vote.entity';
import { User } from '@modules/uua/users/user.entity';
import type { CreateContentWithKindDto } from './dto/create-content-with-kind.dto';
import type { CreateContentDto } from './dto/create-content.dto';
import type { UpdateContentDto } from './dto/update-content.dto';
import { Content, DEFAULT_INTERACTIONS } from './entities/content.entity';
import { Edit } from './entities/edit.entity';

@Injectable()
export class ContentsService {
  // eslint-disable-next-line max-params
  constructor(
    @Inject(APP_PUB_SUB) private readonly pubSub: PubSubEngine,
    @InjectRepository(Content) private readonly contentRepository: BaseRepository<Content>,
    @InjectRepository(Edit) private readonly contentEditRepository: BaseRepository<Edit>,
    @InjectRepository(ContentMaster) private readonly contentMasterRepository: BaseRepository<ContentMaster>,
    @InjectRepository(Favorite) private readonly favoriteRepository: BaseRepository<Favorite>,
    @InjectRepository(Reaction) private readonly reactionRepository: BaseRepository<Reaction>,
    @InjectRepository(Report) private readonly reportRepository: BaseRepository<Report>,
    @InjectRepository(Vote) private readonly voteRepository: BaseRepository<Vote>,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    private readonly notificationsService: NotificationsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async createContentWithKind(
    user: User,
    createContentDto: CreateContentWithKindDto,
  ): Promise<Content> {
    if (createContentDto.contentKind === ContentKind.Post)
      throw new BadRequestException('Child content cannot be post');

    return createContentDto.contentKind === ContentKind.Comment
      ? await this.createComment(user, { ...createContentDto, isAnonymous: false })
      : await this.createReply(user, { ...createContentDto, isAnonymous: false });
  }

  public async createPost(
    user: User,
    createContentDto: CreateOrphanContentDto,
  ): Promise<Content> {
    const content = this.createAndPersistContent(createContentDto, ContentKind.Post, user);
    await this.contentEditRepository.flush();
    await this.contentRepository.flush();
    return content;
  }

  public async updateParticipants(action: 'add' | 'remove', user: User, id: number): Promise<void> {
    const master = await this.contentMasterRepository.findOneOrFail({ id }, { populate: ['participants'] });
    if ((action === 'add' && !master.participants.contains(user))
      || (action === 'remove' && master.participants.contains(user))) {
      master.participants[action](user);
      await this.contentMasterRepository.flush();
    }
  }

  public async createReply(user: User, createContentDto: CreateContentDto): Promise<Content> {
    const parent = await this.contentRepository.findOneOrFail(
      { id: createContentDto.parentId, kind: ContentKind.Post },
      { populate: ['author', 'lastEdit', 'contentMaster'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, parent);

    const content = await this.createAndPersistContent(createContentDto, ContentKind.Reply, user, parent);
    parent.replyCount++;

    await this.contentEditRepository.flush();
    await this.contentRepository.flush();

    await this.updateParticipants('add', user, content.contentMaster!.id);

    // TODO: Add user mention notifications
    if (content.contentMaster!.kind === ContentMasterType.Thread)
      void this.notificationsService.trigger(new ThreadSubscribedUpdatedNotification(content));
    else if (content.contentMaster!.kind === ContentMasterType.Blog)
      void this.notificationsService.trigger(new BlogSubscribedUpdatedNotification(content));

    await this.pubSub.publish(SubscriptionType.ContentAdded, { contentAdded: parent });

    return parent;
  }

  public async createComment(user: User, createContentDto: CreateContentDto): Promise<Content> {
    const parent = await this.contentRepository.findOneOrFail(
      { id: createContentDto.parentId, kind: { $in: [ContentKind.Post, ContentKind.Reply] } },
      { populate: ['author', 'lastEdit', 'contentMaster'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, parent);

    const content = await this.createAndPersistContent(createContentDto, ContentKind.Comment, user, parent);
    parent.replyCount++;

    await this.contentEditRepository.flush();
    await this.contentRepository.flush();

    if (content.contentMaster)
      await this.updateParticipants('add', user, content.contentMaster.id);

    // TODO: Add user mentions
    void this.notificationsService.trigger(new ThreadSubscribedUpdatedNotification(content));
    await this.pubSub.publish(SubscriptionType.ContentAdded, { contentAdded: parent });

    return parent;
  }

  public async findAllChildren(
    user: User,
    parentId: number,
    options?: Required<ContentListOptionsDto>,
  ): Promise<PaginatedResult<Content>> {
    const canSeeHiddenContent = this.caslAbilityFactory.isModOrAdmin(user);
    const visibilityQuery = canSeeHiddenContent ? {} : { isVisible: true };
    return await this.contentRepository.findWithPagination(
      options,
      {
        ...visibilityQuery,
        parent: { id: parentId },
      },
      { populate: ['author', 'lastEdit', 'edits'], orderBy: serializeOrder(options?.sortBy) },
    );
  }

  public async findOne(user: User, id: number): Promise<Content> {
    const content = await this.contentRepository.findOneOrFail(
      { id },
      { populate: ['author', 'lastEdit', 'parent', 'parent.parent', 'edits'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Read, content);

    return content;
  }

  public async getInteractionsByMaster(
    userId: string,
    contentMasterId: number,
  ): Promise<Record<number, Interactions>> {
    const contentMaster = await this.contentMasterRepository.findOneOrFail({ id: contentMasterId });

    const favorites = await this.favoriteRepository.find({ user: { id: userId }, contentMaster });
    const votes = await this.voteRepository.find({ user: { id: userId }, contentMaster });
    const reports = await this.reportRepository.find({ user: { id: userId }, contentMaster });
    const reactions = await this.reactionRepository.find({ contentMaster });

    const userInteractionByContent = {} as Record<number, Interactions>;
    const getOrCreate = (id: number): Interactions => {
      if (!userInteractionByContent[id])
        userInteractionByContent[id] = { ...DEFAULT_INTERACTIONS };
      return userInteractionByContent[id];
    };

    for (const interaction of favorites)
      getOrCreate(interaction.content.id).userFavorited = interaction.active;

    for (const interaction of votes)
      getOrCreate(interaction.content.id).userVoted = interaction.value;

    for (const interaction of reports)
      getOrCreate(interaction.content.id).userReported = interaction;

    for (const interaction of reactions)
      getOrCreate(interaction.content.id).reactions.push(interaction);

    return userInteractionByContent;
  }

  public async getContentsByMaster(id: number): Promise<Record<number, Content[]>> {
    return groupBy(await this.contentRepository.find(
      { contentMaster: { id }, parent: { $ne: null } },
      { populate: ['author', 'lastEdit', 'edits'] },
    ), 'parent.id');
  }

  // Highly unoptimised query - use only when querying one or few contents
  public async findInteractions(user: User, id: number): Promise<Interactions> {
    const content = await this.contentRepository.findOneOrFail({ id });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Read, content);

    const reactions = await this.reactionRepository.find({ content: { id } });
    const userFavorited = await this.favoriteRepository.findOne({ user, content: { id } });
    const userVoted = await this.voteRepository.findOne({ user, content: { id } });
    const userReported = await this.reportRepository.findOne({ user, content: { id } });

    return {
      reactions,
      userFavorited: userFavorited?.active ?? false,
      userVoted: userVoted?.value ?? 0,
      userReported,
    };
  }

  public async findEdits(
    user: User,
    id: number,
    paginationOptions?: Required<PaginateDto>,
  ): Promise<PaginatedResult<Edit>> {
    const content = await this.contentRepository.findOneOrFail({ id });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Read, content);

    return await this.contentEditRepository.findWithPagination(
      paginationOptions,
      { parent: content },
      { orderBy: { createdAt: 'DESC' } },
    );
  }

  public async update(user: User, id: number, updateContentDto: UpdateContentDto): Promise<Content> {
    const content = await this.contentRepository.findOneOrFail(
      { id },
      { populate: ['author', 'lastEdit', 'parent'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, content, Object.keys(updateContentDto));

    wrap(content).assign(updateContentDto);

    if (updateContentDto.isAnonymous) {
      const anonymous = await this.userRepository.findOneOrFail({ id: config.anonAccount.username });
      content.author = anonymous;
    } else {
      content.author = content.realAuthor;
    }

    if (typeof updateContentDto.hidden === 'boolean') {
      const authoredContents = await this.contentRepository.count({
        contentMaster: { id: content.contentMaster!.id },
        author: user,
        hidden: false,
      });

      if (authoredContents === 0 && content.hidden && !updateContentDto.hidden)
        await this.updateParticipants('add', user, content.contentMaster!.id);
      else if (authoredContents === 1 && !content.hidden && updateContentDto.hidden)
        await this.updateParticipants('remove', user, content.contentMaster!.id);

      await this.contentRepository.nativeUpdate({
        $or: [
          { parent: content },
          { parent: { parent: content } },
        ],
      }, {
        isVisible: !updateContentDto.hidden,
      });
      content.isVisible = !updateContentDto.hidden;
      content.hidden = updateContentDto.hidden;
    }

    if (typeof updateContentDto.body === 'string') {
      const count = await this.contentEditRepository.count({ parent: content });

      const contentEdit = new Edit({
        parent: content,
        body: updateContentDto.body,
        editedBy: user,
        editOrder: count,
      });
      await this.contentEditRepository.persistAndFlush(contentEdit);

      content.lastEdit = contentEdit;
    }

    await this.contentRepository.flush();
    await this.pubSub.publish(SubscriptionType.ContentUpdated, { contentUpdated: content });

    return content;
  }

  public async remove(user: User, id: number): Promise<void> {
    const content = await this.contentRepository.findOneOrFail({ id });
    if (content.parent)
      content.parent.replyCount--;

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, content);

    if (content.contentMaster) {
      const nContentsOnMaster = await this.contentRepository.count({
        contentMaster: { id: content.contentMaster.id },
        author: user,
        hidden: false,
      });

      if (nContentsOnMaster === 1)
        await this.updateParticipants('remove', user, content.contentMaster.id);
    }

    void this.notificationsService.trigger(new ContentRemovedNotification(content));

    await this.contentRepository.removeAndFlush(content);
  }

  private async createAndPersistContent(
    createContentDto: CreateContentDto | CreateOrphanContentDto,
    kind: ContentKind,
    user: User,
    parent?: Content | ContentMaster,
  ): Promise<Content> {
    const { isAnonymous } = createContentDto;
    const anonymousOrUser = isAnonymous
      ? await this.userRepository.findOneOrFail({ id: config.anonAccount.username })
      : user;

    const content = new Content({
      ...createContentDto,
      kind,
      contentMaster: parent instanceof Content ? parent.contentMaster : parent,
      parent: parent instanceof Content ? parent : null,
      author: anonymousOrUser,
      realAuthor: user,
    });

    const contentEdit = new Edit({
      parent: content,
      body: createContentDto.body,
      editedBy: user,
      editOrder: 0,
    });
    content.lastEdit = contentEdit;

    this.contentEditRepository.persist(contentEdit);
    this.contentRepository.persist(content);

    return content;
  }
}
