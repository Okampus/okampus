import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Favorite } from '../favorites/favorite.entity';
import { Reaction } from '../reactions/reaction.entity';
import { Report } from '../reports/report.entity';
import type { ContentListOptionsDto } from '../shared/lib/dto/list-options.dto';
import { ContentMaster } from '../shared/lib/entities/content-master.entity';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { ContentKind } from '../shared/lib/types/enums/content-kind.enum';
import { assertPermissions } from '../shared/lib/utils/assert-permission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { MailService } from '../shared/modules/mail/mail.service';
import type { PaginatedResult, PaginateDto } from '../shared/modules/pagination';
import { serializeOrder } from '../shared/modules/sorting';
import type { User } from '../users/user.entity';
import { Vote } from '../votes/vote.entity';
import type { ContentInteractions } from './content-interactions.model';
import type { CreateContentDto } from './dto/create-content.dto';
import type { CreateOrphanContentDto } from './dto/create-orphan-content.dto';
import type { UpdateContentDto } from './dto/update-content.dto';
import { ContentEdit } from './entities/content-edit.entity';
import { Content, DEFAULT_INTERACTIONS } from './entities/content.entity';

@Injectable()
export class ContentsService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(Content) private readonly contentRepository: BaseRepository<Content>,
    @InjectRepository(ContentEdit) private readonly contentEditRepository: BaseRepository<ContentEdit>,
    @InjectRepository(ContentMaster) private readonly contentMasterRepository: BaseRepository<ContentMaster>,
    @InjectRepository(Favorite) private readonly favoriteRepository: BaseRepository<Favorite>,
    @InjectRepository(Reaction) private readonly reactionRepository: BaseRepository<Reaction>,
    @InjectRepository(Report) private readonly reportRepository: BaseRepository<Report>,
    @InjectRepository(Vote) private readonly voteRepository: BaseRepository<Vote>,
    private readonly mailService: MailService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

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
      { populate: ['author', 'lastEdit'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, parent);

    const content = this.createAndPersistContent(createContentDto, ContentKind.Reply, user, parent);
    parent.replyCount++;

    await this.contentEditRepository.flush();
    await this.contentRepository.flush();

    if (content.contentMaster)
      await this.updateParticipants('add', user, content.contentMaster.id);

    void this.mailService.newThreadContent(content);

    return parent;
  }

  public async createComment(user: User, createContentDto: CreateContentDto): Promise<Content> {
    const parent = await this.contentRepository.findOneOrFail(
      { id: createContentDto.parentId, kind: { $in: [ContentKind.Post, ContentKind.Reply] } },
      { populate: ['author', 'lastEdit'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, parent);

    const content = this.createAndPersistContent(createContentDto, ContentKind.Comment, user, parent);
    parent.replyCount++;

    await this.contentEditRepository.flush();
    await this.contentRepository.flush();

    if (content.contentMaster)
      await this.updateParticipants('add', user, content.contentMaster.id);

    void this.mailService.newThreadContent(content);

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
  ): Promise<Record<number, ContentInteractions>> {
    const contentMaster = await this.contentMasterRepository.findOneOrFail({ id: contentMasterId });

    const favorites = await this.favoriteRepository.find({ user: { id: userId }, contentMaster });
    const votes = await this.voteRepository.find({ user: { id: userId }, contentMaster });
    const reports = await this.reportRepository.find({ user: { id: userId }, contentMaster });
    const reactions = await this.reactionRepository.find({ contentMaster });

    const userInteractionByContent = {} as Record<number, ContentInteractions>;
    const getOrCreate = (id: number): ContentInteractions => {
      if (!userInteractionByContent[id])
        userInteractionByContent[id] = DEFAULT_INTERACTIONS;
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
    const contentsByParent = {} as Record<number, Content[]>;
    const getOrCreate = (contentId: number): Content[] => {
      if (!contentsByParent[contentId])
        contentsByParent[contentId] = [];
      return contentsByParent[contentId];
    };

    const contents = await this.contentRepository.find(
      { contentMaster: { id }, parent: { $ne: null } },
      { populate: ['author', 'lastEdit', 'edits'] },
    );
    for (const content of contents) {
      if (content.parent!.id)
        getOrCreate(content.parent!.id).push(content);
    }

    return contentsByParent;
  }

  // Highly unoptimised query - use only when querying one or few contents
  public async findInteractions(user: User, id: number): Promise<ContentInteractions> {
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
  ): Promise<PaginatedResult<ContentEdit>> {
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

      const contentEdit = new ContentEdit({
        parent: content,
        body: updateContentDto.body,
        editedBy: user,
        editOrder: count,
      });
      await this.contentEditRepository.persistAndFlush(contentEdit);

      content.lastEdit = contentEdit;
    }

    await this.contentRepository.flush();
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

    await this.contentRepository.removeAndFlush(content);
  }

  private createAndPersistContent(
    createContentDto: CreateContentDto | CreateOrphanContentDto,
    kind: ContentKind,
    user: User,
    parent?: Content | ContentMaster,
  ): Content {
    const content = new Content({
      ...createContentDto,
      kind,
      contentMaster: parent instanceof Content ? parent.contentMaster : parent,
      parent: parent instanceof Content ? parent : undefined,
      author: user,
    });

    const contentEdit = new ContentEdit({
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
