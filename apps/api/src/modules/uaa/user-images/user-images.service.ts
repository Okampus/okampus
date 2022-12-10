import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import type { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import { Action } from '@common/modules/authorization';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import type { PaginatedNodes, PaginationOptions } from '@common/modules/pagination';
import { GlobalRequestService } from '@lib/helpers/global-request-service';
import { BaseRepository } from '@lib/orm/base.repository';
import { FileKind } from '@lib/types/enums/file-kind.enum';
import type { UserImageType } from '@lib/types/enums/user-image-type.enum';
import { assertPermissions } from '@lib/utils/assert-permission';
import { User } from '@uaa/users/user.entity';
import { FileUploadsService } from '@upload/file-uploads/file-uploads.service';
import type { CreateUserImageDto } from './dto/create-user-image.dto';
import { UserImage } from './user-image.entity';

@Injectable()
export class UserImagesService extends GlobalRequestService {
  constructor(
    @InjectRepository(UserImage) private readonly userImageRepository: BaseRepository<UserImage>,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    private readonly filesService: FileUploadsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) { super(); }

  public async create(multerFile: MulterFile, createUserImageDto: CreateUserImageDto): Promise<UserImage> {
    if (!multerFile)
      throw new BadRequestException('No file provided');

    const { userId, fileLastModifiedAt, ...createUserImage } = createUserImageDto;
    const user = await this.userRepository.findOneOrFail({ id: userId });

    const ability = this.caslAbilityFactory.createForUser(this.currentUser());
    assertPermissions(ability, Action.Create, UserImage);

    const file = await this.filesService.create(
      this.currentTenant(),
      user,
      multerFile,
      FileKind.UserImage,
      fileLastModifiedAt,
    );

    const userImage = new UserImage({ file, ...createUserImage, user });
    await this.userImageRepository.persistAndFlush(userImage);
    return userImage;
  }

  public async findAll(paginationOptions?: PaginationOptions): Promise<PaginatedNodes<UserImage>> {
    return await this.userImageRepository.findWithPagination(paginationOptions, {}, { populate: ['file', 'user'] });
  }

  public async findOne(id: string): Promise<UserImage> {
    return await this.userImageRepository.findOneOrFail({ id }, { populate: ['file', 'user'] });
  }

  public async findLastActive(userId: string, type: UserImageType): Promise<UserImage | null> {
    return await this.userImageRepository.findOne({ user: { id: userId }, active: true, type }, { populate: ['file', 'user'] });
  }

  public async setInactiveLastActive(userId: string, type: UserImageType): Promise<void> {
    const userImage = await this.findLastActive(userId, type);
    if (userImage) {
      userImage.active = false;
      userImage.lastActiveDate = new Date();
      await this.userImageRepository.flush();
    }
  }

  public async remove(id: string): Promise<void> {
    const userImage = await this.userImageRepository.findOneOrFail({ id }, { populate: ['file'] });

    const ability = this.caslAbilityFactory.createForUser(this.currentUser());
    assertPermissions(ability, Action.Delete, userImage);

    await this.userImageRepository.removeAndFlush(userImage);
  }
}
