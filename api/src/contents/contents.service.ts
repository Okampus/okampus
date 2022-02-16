import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { ContentMaster } from '../shared/lib/entities/content-master.entity';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { ContentKind } from '../shared/lib/types/content-kind.enum';
import { assertPermissions } from '../shared/lib/utils/assert-permission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { PaginationOptions } from '../shared/modules/pagination/pagination-option.interface';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import type { User } from '../users/user.entity';
import type { CreateContentDto } from './dto/create-content.dto';
import type { CreateOrphanContentDto } from './dto/create-orphan-content.dto';
import type { UpdateContentDto } from './dto/update-content.dto';
import { Content } from './entities/content.entity';

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Content) private readonly contentRepository: BaseRepository<Content>,
    @InjectRepository(ContentMaster) private readonly contentMasterRepository: BaseRepository<ContentMaster>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async createPost(
    user: User,
    contentMaster: ContentMaster,
    createContentDto: CreateOrphanContentDto,
  ): Promise<Content> {
    const content = new Content({
      ...createContentDto,
      contentMaster,
      kind: ContentKind.Post,
      author: user,
    });
    await this.contentRepository.persistAndFlush(content);

    return content;
  }

  public async createReply(user: User, createContentDto: CreateContentDto): Promise<Content> {
    const parent = await this.contentRepository.findOneOrFail(
      { contentId: createContentDto.parentId, kind: ContentKind.Post },
      { populate: ['author'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, parent);

    const content = new Content({
      ...createContentDto,
      kind: ContentKind.Reply,
      contentMaster: parent.contentMaster,
      parent,
      author: user,
    });
    this.contentRepository.persist(content);

    parent.children.add(content);
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

    const content = new Content({
      ...createContentDto,
      kind: ContentKind.Comment,
      contentMaster: parent.contentMaster,
      parent,
      author: user,
    });
    this.contentRepository.persist(content);

    parent.children.add(content);
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
    options?: PaginationOptions,
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
      { populate: ['author', 'parent', 'children'] },
    );
  }

  public async findAllComments(
    user: User,
    parentId: number,
    options?: PaginationOptions,
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
      { populate: ['author', 'parent', 'parent.parent', 'children'] },
    );
  }

  public async findOne(user: User, contentId: number): Promise<Content> {
    const content = await this.contentRepository.findOneOrFail({ contentId }, { populate: ['author', 'parent', 'parent.parent', 'children'] });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Read, content);

    return content;
  }

  public async update(user: User, contentId: number, updateContentDto: UpdateContentDto): Promise<Content> {
    const content = await this.contentRepository.findOneOrFail(
      { contentId },
      { populate: ['author', 'parent', 'children'] },
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
}
