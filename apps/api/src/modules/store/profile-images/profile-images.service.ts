import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@meta/shared/lib/orm/base.repository';
import { assertPermissions } from '@meta/shared/lib/utils/assert-permission';
import { Action } from '@meta/shared/modules/authorization';
import { CaslAbilityFactory } from '@meta/shared/modules/casl/casl-ability.factory';
import type { PaginatedResult, PaginateDto } from '@meta/shared/modules/pagination';
import type { User } from '@modules/uua/users/user.entity';
import type { FileUpload } from '../file-uploads/file-upload.entity';
import { ProfileImage } from './profile-image.entity';

@Injectable()
export class ProfileImagesService {
  constructor(
    @InjectRepository(ProfileImage) private readonly profileImageRepository: BaseRepository<ProfileImage>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(file: FileUpload, type: string): Promise<ProfileImage> {
    const profileImage = new ProfileImage({ file, type });
    await this.profileImageRepository.persistAndFlush(profileImage);
    return profileImage;
  }

  public async findAll(paginationOptions?: Required<PaginateDto>): Promise<PaginatedResult<ProfileImage>> {
    return await this.profileImageRepository.findWithPagination(paginationOptions, {}, { populate: ['file', 'user', 'team', 'tenant'] });
  }

  public async findOne(id: string): Promise<ProfileImage> {
    return await this.profileImageRepository.findOneOrFail({ id }, { populate: ['file', 'user', 'team', 'tenant'] });
  }

  public async remove(user: User, id: string): Promise<void> {
    const profileImage = await this.profileImageRepository.findOneOrFail({ id }, { populate: ['file'] });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, profileImage);

    await this.profileImageRepository.removeAndFlush(profileImage);
  }
}
