import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Favorite } from '../favorites/favorite.entity';
import { Reaction } from '../reactions/reaction.entity';
import { Report } from '../reports/report.entity';
import type { ContentListOptionsDto } from '../shared/lib/dto/list-options.dto';
import type { BaseContentInteraction } from '../shared/lib/entities/base-content-interaction.entity';
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
import { Validation } from '../validations/entities/validation.entity';
import { Vote } from '../votes/vote.entity';
// Import type { ContentInteractions } from './content-interactions.model';
import type { ContentInteractions } from './content-interactions.model';
import type { CreateContentDto } from './dto/create-content.dto';
import type { CreateOrphanContentDto } from './dto/create-orphan-content.dto';
import type { UpdateContentDto } from './dto/update-content.dto';
import { ContentEdit } from './entities/content-edit.entity';
import { Content } from './entities/content.entity';


export enum InteractionType {
  Votes = 'votes',
  Favorites = 'favorites',
  Reports = 'reports',
  Reactions = 'reactions',
}

export type Interaction = Favorite | Reaction | Report | Vote;

export type Interactions = {
  [key in InteractionType]: BaseContentInteraction[];
};

export const DEFAULT_INTERACTIONS = {
  reactions: [] as Reaction[],
  userFavorited: false,
  userVoted: 0,
  userReported: null,
};

@Injectable()
export class ContentsService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(Content) private readonly contentRepository: BaseRepository<Content>,
    @InjectRepository(ContentMaster) private readonly contentMasterRepository: BaseRepository<ContentMaster>,
    @InjectRepository(Validation) private readonly validationRepository: BaseRepository<Validation>,
    @InjectRepository(Favorite) private readonly favoriteRepository: BaseRepository<Favorite>,
    @InjectRepository(Vote) private readonly voteRepository: BaseRepository<Vote>,
    @InjectRepository(Reaction) private readonly reactionRepository: BaseRepository<Reaction>,
    @InjectRepository(Report) private readonly reportRepository: BaseRepository<Report>,
    @InjectRepository(ContentEdit) private readonly contentEditRepository: BaseRepository<ContentEdit>,
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

  public async updateParticipants(action: 'add' | 'remove', user: User, contentMasterId: number): Promise<void> {
    const master = await this.contentMasterRepository.findOneOrFail({ contentMasterId }, { populate: ['participants'] });
    if ((action === 'add' && !master.participants.contains(user)) || (action === 'remove' && master.participants.contains(user))) {
      if (action === 'add')
        master.participants.add(user);
      else
        master.participants.remove(user);

      await this.contentMasterRepository.flush();
    }
  }

  public async createReply(user: User, createContentDto: CreateContentDto): Promise<Content> {
    const parent = await this.contentRepository.findOneOrFail(
      { contentId: createContentDto.parentId, kind: ContentKind.Post },
      { populate: ['author'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, parent);

    const content = this.createAndPersistContent(createContentDto, ContentKind.Reply, user, parent);
    parent.nReplies++;

    await this.contentEditRepository.flush();
    await this.contentRepository.flush();

    if (content.contentMaster)
      await this.updateParticipants('add', user, content.contentMaster.contentMasterId);

    void this.mailService.newThreadContent(content);

    return content;
  }

  public async createComment(user: User, createContentDto: CreateContentDto): Promise<Content> {
    const parent = await this.contentRepository.findOneOrFail(
      { contentId: createContentDto.parentId, kind: { $in: [ContentKind.Post, ContentKind.Reply] } },
      { populate: ['author'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, parent);

    const content = this.createAndPersistContent(createContentDto, ContentKind.Comment, user, parent);
    parent.nReplies++;

    await this.contentEditRepository.flush();
    await this.contentRepository.flush();

    if (content.contentMaster)
      await this.updateParticipants('add', user, content.contentMaster.contentMasterId);

    void this.mailService.newThreadContent(content);

    return content;
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
        kind: ContentKind.Reply,
        ...visibilityQuery,
        parent: { contentId: parentId },
      },
      { populate: ['author', 'lastEdit', 'edits'], orderBy: serializeOrder(options?.sortBy) },
    );
  }

  // Public async findAllReplies(
  //   user: User,
  //   parentId: number,
  //   options?: Required<ContentListOptionsDto>,
  // ): Promise<PaginatedResult<Content>> {
  //   const canSeeHiddenContent = this.caslAbilityFactory.isModOrAdmin(user);
  //   const visibilityQuery = canSeeHiddenContent ? {} : { isVisible: true };
  //   return await this.contentRepository.findWithPagination(
  //     options,
  //     {
  //       kind: ContentKind.Reply,
  //       ...visibilityQuery,
  //       parent: { contentId: parentId },
  //     },
  //     { populate: ['author', 'lastEdit', 'parent', 'edits'], orderBy: serializeOrder(options?.sortBy) },
  //   );
  // }

  // public async findAllComments(
  //   user: User,
  //   parentId: number,
  //   options?: Required<PaginateDto>,
  // ): Promise<PaginatedResult<Content>> {
  //   const canSeeHiddenContent = this.caslAbilityFactory.isModOrAdmin(user);
  //   const visibilityQuery = canSeeHiddenContent ? {} : { isVisible: true };
  //   return await this.contentRepository.findWithPagination(
  //     options,
  //     {
  //       kind: ContentKind.Comment,
  //       ...visibilityQuery,
  //       parent: { contentId: parentId },
  //     },
  //     { populate: ['author', 'lastEdit', 'parent', 'parent.parent', 'edits'] },
  //   );
  // }

  public async findOne(user: User, contentId: number): Promise<Content> {
    const content = await this.contentRepository.findOneOrFail({ contentId }, { populate: ['author', 'lastEdit', 'parent', 'parent.parent', 'edits'] });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Read, content);

    return content;
  }

  public async getInteractionsByMaster(userId: string, contentMasterId: number):
    Promise<Record<number, ContentInteractions>> {
    const fieldsAction: Record<InteractionType, (record: ContentInteractions, interaction: Interaction) => void> = {
      favorites: (record: ContentInteractions, interaction: Favorite) => { record.userFavorited = interaction.active; },
      votes: (record: ContentInteractions, interaction: Vote) => { record.userVoted = interaction?.value; },
      reports: (record: ContentInteractions, interaction: Report) => { record.userReported = interaction; },
      reactions: (record: ContentInteractions, interaction: Reaction) => { record.reactions.push(interaction); },
    };

    const master = await this.contentMasterRepository.findOneOrFail({ contentMasterId });
    await this.contentMasterRepository.populate(master, Object.keys(fieldsAction), {
          favorites: { user: { userId } },
          votes: { user: { userId } },
          reports: { user: { userId } },
          reactions: { contentMaster: { contentMasterId } },
    });

    const userInteractionByContent = {} as Record<number, ContentInteractions>;
    const getOrCreate = (id: number): ContentInteractions => {
      if (!userInteractionByContent[id])
        userInteractionByContent[id] = DEFAULT_INTERACTIONS;
      return userInteractionByContent[id];
    };

    for (const field of Object.keys(fieldsAction) as InteractionType[]) {
      for (const interaction of master[field])
        fieldsAction[field](getOrCreate(interaction.content.contentId), interaction);
    }

    return userInteractionByContent;
  }

  public async getContentsByMaster(contentMasterId: number): Promise<Record<number, Content[]>> {
    const contentsByParent = {} as Record<number, Content[]>;
    const getOrCreate = (contentId: number): Content[] => {
      if (!contentsByParent[contentId])
        contentsByParent[contentId] = [];
      return contentsByParent[contentId];
    };

    const contents = await this.contentRepository.find(
      { contentMaster: { contentMasterId }, parent: { $ne: undefined } },
      { populate: ['author', 'lastEdit', 'edits'] },
    );
    for (const content of contents) {
      if (content?.parent?.contentId)
        getOrCreate(content.parent.contentId).push(content);
    }

    return contentsByParent;
  }

  // Highly unoptimised query - use only when querying one or few contents
  public async findInteractions(user: User, contentId: number): Promise<ContentInteractions> {
    const content = await this.contentRepository.findOneOrFail({ contentId });
    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Read, content);

    const reactions = await this.reactionRepository.find({ content: { contentId } });
    const userFavorited = await this.favoriteRepository.findOne({ content: { contentId }, user });
    const userVoted = await this.voteRepository.findOne({ user, content: { contentId } });
    const userReported = await this.reportRepository.findOne({ user, content: { contentId } });

    return {
      reactions,
      userFavorited: Boolean(userFavorited),
      userVoted: userVoted?.value ?? 0,
      userReported,
    };
  }

  public async findEdits(
    user: User,
    contentId: number,
    paginationOptions?: Required<PaginateDto>,
  ): Promise<PaginatedResult<ContentEdit>> {
    const content = await this.contentRepository.findOneOrFail({ contentId });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Read, content);

    return await this.contentEditRepository.findWithPagination(
      paginationOptions,
      { parent: content },
      { orderBy: { createdAt: 'DESC' } },
    );
  }

  public async update(user: User, contentId: number, updateContentDto: UpdateContentDto): Promise<Content> {
    const content = await this.contentRepository.findOneOrFail(
      { contentId },
      { populate: ['author', 'lastEdit', 'parent'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, content, Object.keys(updateContentDto));

    wrap(content).assign(updateContentDto);

    if (typeof updateContentDto.hidden === 'boolean') {
      if (content.contentMaster) {
        const nContentsOnMaster = await this.contentRepository.count({
          contentMaster: { contentMasterId: content.contentMaster.contentMasterId },
          author: user,
          hidden: false,
        });

        if (nContentsOnMaster === 0 && content.hidden && !updateContentDto.hidden)
          await this.updateParticipants('add', user, content.contentMaster.contentMasterId);
        else if (nContentsOnMaster === 1 && !content.hidden && updateContentDto.hidden)
          await this.updateParticipants('remove', user, content.contentMaster.contentMasterId);
      }

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

  public async remove(user: User, contentId: number): Promise<void> {
    const content = await this.contentRepository.findOneOrFail({ contentId });
    if (content.parent)
      content.parent.nReplies--;

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, content);

    if (content.contentMaster) {
      const nContentsOnMaster = await this.contentRepository.count({
        contentMaster: { contentMasterId: content.contentMaster.contentMasterId },
        author: user,
        hidden: false,
      });

      if (nContentsOnMaster === 1)
        await this.updateParticipants('remove', user, content.contentMaster.contentMasterId);
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
