
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import type { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import { GlobalRequestService } from '@common/lib/helpers/global-request-service';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { FileKind } from '@common/lib/types/enums/file-kind.enum';
import type { TeamImageType } from '@common/lib/types/enums/team-image-type.enum';
import { assertPermissions } from '@common/lib/utils/assert-permission';
import { Action } from '@common/modules/authorization';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import type { PaginatedResult, PaginateDto } from '@common/modules/pagination';
import { FileUploadsService } from '@modules/upload/file-uploads/file-uploads.service';
import { Team } from '../team.entity';
import type { CreateTeamImageDto } from './dto/create-team-image.dto';
import { TeamImage } from './team-image.entity';

@Injectable()
export class TeamImagesService extends GlobalRequestService {
  constructor(
    @InjectRepository(TeamImage) private readonly teamImageRepository: BaseRepository<TeamImage>,
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
    private readonly filesService: FileUploadsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) { super(); }

  public async create(multerFile: MulterFile, createTeamImageDto: CreateTeamImageDto): Promise<TeamImage> {
    if (!multerFile)
      throw new BadRequestException('No file provided');

    const { teamId, fileLastModifiedAt, ...createTeamImage } = createTeamImageDto;
    const team = await this.teamRepository.findOneOrFail(teamId);

    const user = this.currentUser();
    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Create, TeamImage);

    const file = await this.filesService.create(
      this.currentTenant(),
      user,
      multerFile,
      FileKind.TeamImage,
      fileLastModifiedAt,
    );

    const teamImage = new TeamImage({ file, ...createTeamImage, team });
    await this.teamImageRepository.persistAndFlush(teamImage);
    return teamImage;
  }

  public async findAll(paginationOptions?: Required<PaginateDto>): Promise<PaginatedResult<TeamImage>> {
    return await this.teamImageRepository.findWithPagination(paginationOptions, {}, { populate: ['file', 'team'] });
  }

  public async findOne(id: string): Promise<TeamImage> {
    return await this.teamImageRepository.findOneOrFail({ id }, { populate: ['file', 'team'] });
  }

  public async findLastActive(teamId: number, type: TeamImageType): Promise<TeamImage | null> {
    return await this.teamImageRepository.findOne({ team: { id: teamId }, active: true, type }, { populate: ['file', 'team'] });
  }

  public async setInactiveLastActive(teamId: number, type: TeamImageType): Promise<void> {
    const teamImage = await this.findLastActive(teamId, type);
    if (teamImage) {
      teamImage.active = false;
      teamImage.lastActiveDate = new Date();
      await this.teamImageRepository.flush();
    }
  }

  public async remove(id: string): Promise<void> {
    const teamImage = await this.teamImageRepository.findOneOrFail({ id }, { populate: ['file'] });

    const ability = this.caslAbilityFactory.createForUser(this.currentUser());
    assertPermissions(ability, Action.Delete, teamImage);

    await this.teamImageRepository.removeAndFlush(teamImage);
  }
}
