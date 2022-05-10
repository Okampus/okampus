import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import { assertPermissions } from '../../shared/lib/utils/assert-permission';
import { Action } from '../../shared/modules/authorization';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import type { PaginatedResult, PaginateDto } from '../../shared/modules/pagination';
import type { User } from '../../users/user.entity';
import type { FileUpload } from '../file-uploads/file-upload.entity';
import { ProfileImage } from './profile-image.entity';

@Injectable()
export class ProfileImagesService {
  constructor(
    @InjectRepository(ProfileImage) private readonly profileImageRepository: BaseRepository<ProfileImage>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(file: FileUpload): Promise<ProfileImage> {
    const profileImage = new ProfileImage({ file });
    await this.profileImageRepository.persistAndFlush(profileImage);
    return profileImage;
  }

  public async findAll(paginationOptions?: Required<PaginateDto>): Promise<PaginatedResult<ProfileImage>> {
    return await this.profileImageRepository.findWithPagination(paginationOptions, {}, { populate: ['file', 'user'] });
  }

  public async findOne(profileImageId: string): Promise<ProfileImage> {
    return await this.profileImageRepository.findOneOrFail({ profileImageId }, { populate: ['file', 'user'] });
  }

  public async remove(user: User, profileImageId: string): Promise<void> {
    const profileImage = await this.profileImageRepository.findOneOrFail({ profileImageId }, { populate: ['file'] });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, profileImage);

    await this.profileImageRepository.removeAndFlush(profileImage);
  }
}
