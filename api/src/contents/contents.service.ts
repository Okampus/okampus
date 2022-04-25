import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type { ListOptionsDto } from '../shared/lib/dto/list-options.dto';
import { ContentMaster } from '../shared/lib/entities/content-master.entity';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { ContentKind } from '../shared/lib/types/enums/content-kind.enum';
import { assertPermissions } from '../shared/lib/utils/assert-permission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { PaginatedResult, PaginateDto } from '../shared/modules/pagination';
import { serializeOrder } from '../shared/modules/sorting';
import type { User } from '../users/user.entity';
import type { CreateContentDto } from './dto/create-content.dto';
import type { CreateOrphanContentDto } from './dto/create-orphan-content.dto';
import type { UpdateContentDto } from './dto/update-content.dto';
import { ContentEdit } from './entities/content-edit.entity';
import { Content } from './entities/content.entity';

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Content) private readonly contentRepository: BaseRepository<Content>,
    @InjectRepository(ContentEdit) private readonly contentEditRepository: BaseRepository<ContentEdit>,
    @InjectRepository(ContentMaster) private readonly contentMasterRepository: BaseRepository<ContentMaster>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async createPost(
    user: User,
    contentMaster: ContentMaster,
    createContentDto: CreateOrphanContentDto,
  ): Promise<Content> {
    const content = this.createAndPersistContent(createContentDto, ContentKind.Post, user, contentMaster);
    await this.contentEditRepository.flush();
    await this.contentRepository.flush();
    return content;
  }

  public async createReply(user: User, createContentDto: CreateContentDto): Promise<Content> {
    const parent = await this.contentRepository.findOneOrFail(
      { contentId: createContentDto.parentId, kind: ContentKind.Post },
      { populate: ['author'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, parent);

    const content = this.createAndPersistContent(createContentDto, ContentKind.Reply, user, parent);
    await this.contentEditRepository.flush();
    await this.contentRepository.flush();

    const master = await this.contentMasterRepository.findOneOrFail(
      { contentMasterId: content.contentMasterId },
      { populate: ['participants'] },
    );
    if (!master.participants.contains(user)) {
      master.participants.add(user);
      await this.contentMasterRepository.flush();
    }

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
    await this.contentEditRepository.flush();
    await this.contentRepository.flush();

    const master = await this.contentMasterRepository.findOneOrFail(
      { contentMasterId: content.contentMasterId },
      { populate: ['participants'] },
    );
    if (!master.participants.contains(user)) {
      master.participants.add(user);
      await this.contentMasterRepository.flush();
    }

    return content;
  }

  public async findAllReplies(
    user: User,
    parentId: number,
    options?: Required<ListOptionsDto>,
  ): Promise<PaginatedResult<Content>> {
    const canSeeHiddenContent = this.caslAbilityFactory.canSeeHiddenContent(user);
    const visibilityQuery = canSeeHiddenContent ? {} : { isVisible: true };
    return await this.contentRepository.findWithPagination(
      options,
      {
        kind: ContentKind.Reply,
        ...visibilityQuery,
        parent: { contentId: parentId },
      },
      { populate: ['author', 'lastEdit', 'parent'], orderBy: serializeOrder(options?.sortBy) },
    );
  }

  public async findAllComments(
    user: User,
    parentId: number,
    options?: Required<PaginateDto>,
  ): Promise<PaginatedResult<Content>> {
    const canSeeHiddenContent = this.caslAbilityFactory.canSeeHiddenContent(user);
    const visibilityQuery = canSeeHiddenContent ? {} : { isVisible: true };
    return await this.contentRepository.findWithPagination(
      options,
      {
        kind: ContentKind.Comment,
        ...visibilityQuery,
        parent: { contentId: parentId },
      },
      { populate: ['author', 'lastEdit', 'parent', 'parent.parent'] },
    );
  }

  public async findOne(user: User, contentId: number): Promise<Content> {
    const content = await this.contentRepository.findOneOrFail({ contentId }, { populate: ['author', 'lastEdit', 'parent', 'parent.parent'] });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Read, content);

    return content;
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
      await this.contentRepository.nativeUpdate({
        $or: [
          { parent: content },
          { parent: { parent: content } },
        ],
      }, {
        isVisible: !updateContentDto.hidden,
      });
      content.isVisible = !updateContentDto.hidden;
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

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, content);

    const master = await this.contentMasterRepository.findOneOrFail(
      { contentMasterId: content.contentMaster.contentMasterId },
      { populate: ['participants'] },
    );
    if (master.participants.contains(user)) {
      master.participants.remove(user);
      await this.contentMasterRepository.flush();
    }

    await this.contentRepository.removeAndFlush(content);
  }

  private createAndPersistContent(
    createContentDto: CreateContentDto | CreateOrphanContentDto,
    kind: ContentKind,
    user: User,
    parent: Content | ContentMaster,
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
