import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../shared/lib/repositories/base.repository';
import { assertPermissions } from '../../shared/lib/utils/assert-permission';
import { Action } from '../../shared/modules/authorization';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import type { PaginateDto } from '../../shared/modules/pagination/paginate.dto';
import type { PaginatedResult } from '../../shared/modules/pagination/pagination.interface';
import { User } from '../../users/user.entity';
import type { FileUpload } from '../file-uploads/file-upload.entity';
import { ProfileImage } from './profile-image.entity';

@Injectable()
export class ProfileImagesService {
  constructor(
    @InjectRepository(ProfileImage) private readonly profileImageRepository: BaseRepository<ProfileImage>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,

  ) {}

  public async create(user: User, file: FileUpload): Promise<ProfileImage> {
    const profileImage = new ProfileImage({ file, user });
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
