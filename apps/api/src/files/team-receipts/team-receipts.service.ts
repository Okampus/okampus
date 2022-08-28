import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
// Import { AdminTeamLegalFileUpdatedNotification } from '../../shared/modules/notifications/notifications';
import { NotificationsService } from '../../shared/modules/notifications/notifications.service';
import type { PaginatedResult } from '../../shared/modules/pagination';
import { Team } from '../../teams/teams/team.entity';
import { User } from '../../users/user.entity';
import type { FileUpload } from '../file-uploads/file-upload.entity';
import type { CreateTeamReceiptDto } from './dto/create-team-receipt.dto';
import type { TeamReceiptListOptions } from './dto/team-receipt-list-options.dto';
import type { UpdateTeamReceiptDto } from './dto/update-team-receipt.dto';
import { TeamReceipt } from './team-receipts.entity';

@Injectable()
export class TeamReceiptsService {
  constructor(
    @InjectRepository(TeamReceipt) private readonly teamReceiptRepository: BaseRepository<TeamReceipt>,
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,

    private readonly notificationsService: NotificationsService,
  ) {}

  public async create(
    user: User,
    createReceiptDto: CreateTeamReceiptDto,
    file: FileUpload,
  ): Promise<TeamReceipt> {
    const { teamId, payedById, ...createReceipt } = createReceiptDto;

    const team = await this.teamRepository.findOneOrFail(
      { id: createReceiptDto.teamId },
      { populate: ['members'] },
    );

    if (!team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    const payedBy = await this.userRepository.findOneOrFail({ id: payedById });

    const teamReceipt = new TeamReceipt({
      ...createReceipt,
      payedBy,
      team,
      file,
      active: true,
    });
    await this.teamReceiptRepository.persistAndFlush(TeamReceipt);

    // Void this.notificationsService.trigger(
    //   new AdminTeamLegalFileUpdatedNotification(teamReceipt, { executor: user }),
    // );

    return teamReceipt;
  }

  public async findOne(id: string): Promise<TeamReceipt> {
    return await this.teamReceiptRepository.findOneOrFail(
      { id },
      { populate: ['file', 'file.user', 'team'] },
    );
  }

  public async findAll(
    options: Required<TeamReceiptListOptions>,
  ): Promise<PaginatedResult<TeamReceipt>> {
    const team = await this.teamRepository.findOneOrFail({ id: options.id });

    const query = {};
    // Const query = options.type ? { type: options.type } : {};

    return await this.teamReceiptRepository.findWithPagination(
      options,
      { team, ...query },
      { populate: ['file', 'file.user', 'team'] },
    );
  }

  public async update(
    user: User,
    id: string,
    updateGalleryImageDto: UpdateTeamReceiptDto,
  ): Promise<TeamReceipt> {
    const teamReceipt = await this.teamReceiptRepository.findOneOrFail(
      { id },
      { populate: ['file', 'file.user', 'team', 'team.members'] },
    );

    if (!teamReceipt.team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    wrap(teamReceipt).assign(updateGalleryImageDto);
    await this.teamReceiptRepository.persistAndFlush(TeamReceipt);

    // Void this.notificationsService.trigger(
    //   new AdminTeamLegalFileUpdatedNotification(teamReceipt, { executor: user }),
    // );

    return teamReceipt;
  }

  public async remove(user: User, id: string): Promise<void> {
    const teamReceipt = await this.teamReceiptRepository.findOneOrFail(
      { id },
      { populate: ['file', 'file.user', 'team', 'team.members'] },
    );

    if (!teamReceipt.team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    await this.teamReceiptRepository.removeAndFlush(teamReceipt);

    // Void this.notificationsService.trigger(
    //   new AdminTeamLegalFileUpdatedNotification(teamReceipt, { executor: user }),
    // );
  }
}
