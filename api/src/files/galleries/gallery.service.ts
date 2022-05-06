import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import type { PaginatedResult } from '../../shared/modules/pagination';
import { Team } from '../../teams/teams/team.entity';
import type { User } from '../../users/user.entity';
import type { FileUpload } from '../file-uploads/file-upload.entity';
import type { CreateGalleryImageDto } from './dto/create-gallery-image.dto';
import type { GalleryImageListOptions } from './dto/gallery-image-list-options.dto';
import type { UpdateGalleryImageDto } from './dto/update-gallery-image.dto';
import { GalleryImage } from './gallery-image.entity';

@Injectable()
export class GalleriesService {
  constructor(
    @InjectRepository(GalleryImage) private readonly galleryImageRepository: BaseRepository<GalleryImage>,
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
  ) {}

  public async create(
    user: User,
    createGalleryImageDto: CreateGalleryImageDto,
    file: FileUpload,
  ): Promise<GalleryImage> {
    const team = await this.teamRepository.findOneOrFail({ teamId: createGalleryImageDto.teamId });

    if (!team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    const image = new GalleryImage({ ...createGalleryImageDto, team, file });
    await this.galleryImageRepository.persistAndFlush(image);
    return image;
  }

  public async findOne(galleryImageId: string): Promise<GalleryImage> {
    return await this.galleryImageRepository.findOneOrFail(
      { galleryImageId },
      { populate: ['file', 'file.user', 'team'] },
    );
  }

  public async findAll(
    options: Required<GalleryImageListOptions>,
  ): Promise<PaginatedResult<GalleryImage>> {
    const team = await this.teamRepository.findOneOrFail({ teamId: options.teamId });

    return await this.galleryImageRepository.findWithPagination(
      options,
      { team },
      { populate: ['file', 'file.user', 'team'] },
    );
  }

  public async update(
    user: User,
    galleryImageId: string,
    updateGalleryImageDto: UpdateGalleryImageDto,
  ): Promise<GalleryImage> {
    const image = await this.galleryImageRepository.findOneOrFail(
      { galleryImageId },
      { populate: ['file', 'file.user', 'team', 'team.members'] },
    );

    if (!image.team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    wrap(image).assign(updateGalleryImageDto);
    await this.galleryImageRepository.persistAndFlush(image);
    return image;
  }


  public async remove(user: User, galleryImageId: string): Promise<void> {
    const image = await this.galleryImageRepository.findOneOrFail(
      { galleryImageId },
      { populate: ['file', 'file.user', 'team', 'team.members'] },
    );

    if (!image.team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    await this.galleryImageRepository.removeAndFlush(image);
  }
}
