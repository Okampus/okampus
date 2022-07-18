import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import type { PaginatedResult } from '../../shared/modules/pagination';
import { Team } from '../../teams/teams/team.entity';
import type { User } from '../../users/user.entity';
import type { FileUpload } from '../file-uploads/file-upload.entity';
import type { CreateTeamFileDto } from './dto/create-team-file.dto';
import type { TeamFileListOptions } from './dto/team-file-list-options.dto';
import type { UpdateTeamFileDto } from './dto/update-team-file.dto';
import { TeamFile } from './team-file.entity';

@Injectable()
export class TeamFilesService {
  constructor(
    @InjectRepository(TeamFile) private readonly teamFileRepository: BaseRepository<TeamFile>,
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
  ) {}

  public async create(
    user: User,
    createGalleryImageDto: CreateTeamFileDto,
    file: FileUpload,
  ): Promise<TeamFile> {
    const team = await this.teamRepository.findOneOrFail(
      { id: createGalleryImageDto.id },
      { populate: ['members'] },
    );

    if (!team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    const teamFile = new TeamFile({ ...createGalleryImageDto, team, file });
    await this.teamFileRepository.persistAndFlush(teamFile);
    return teamFile;
  }

  public async findOne(id: string): Promise<TeamFile> {
    return await this.teamFileRepository.findOneOrFail(
      { id },
      { populate: ['file', 'file.user', 'team'] },
    );
  }

  public async findAll(
    options: Required<TeamFileListOptions>,
  ): Promise<PaginatedResult<TeamFile>> {
    const team = await this.teamRepository.findOneOrFail({ id: options.id });

    const query = options.type ? { type: options.type } : {};

    return await this.teamFileRepository.findWithPagination(
      options,
      { team, ...query },
      { populate: ['file', 'file.user', 'team'] },
    );
  }

  public async update(
    user: User,
    id: string,
    updateGalleryImageDto: UpdateTeamFileDto,
  ): Promise<TeamFile> {
    const image = await this.teamFileRepository.findOneOrFail(
      { id },
      { populate: ['file', 'file.user', 'team', 'team.members'] },
    );

    if (!image.team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    wrap(image).assign(updateGalleryImageDto);
    await this.teamFileRepository.persistAndFlush(image);
    return image;
  }


  public async remove(user: User, id: string): Promise<void> {
    const image = await this.teamFileRepository.findOneOrFail(
      { id },
      { populate: ['file', 'file.user', 'team', 'team.members'] },
    );

    if (!image.team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    await this.teamFileRepository.removeAndFlush(image);
  }
}
