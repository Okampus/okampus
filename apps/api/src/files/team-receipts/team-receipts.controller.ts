import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import { Tenant } from '../../org/tenants/tenants/tenant.entity';
import { CurrentTenant } from '../../shared/lib/decorators/current-tenant.decorator';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { UploadInterceptor } from '../../shared/lib/decorators/upload-interceptor.decorator';
import { FileKind } from '../../shared/lib/types/enums/file-kind.enum';
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import { normalizePagination } from '../../shared/modules/pagination';
import type { PaginatedResult } from '../../shared/modules/pagination';
import { User } from '../../uua/users/user.entity';
import { FileUploadsService } from '../file-uploads/file-uploads.service';
import { CreateTeamReceiptDto } from './dto/create-team-receipt.dto';
import { TeamReceiptListOptions } from './dto/team-receipt-list-options.dto';
import { UpdateTeamReceiptDto } from './dto/update-team-receipt.dto';
import { TeamReceipt } from './team-receipt.entity';
import { TeamReceiptsService } from './team-receipts.service';

@ApiTags('TeamFiles')
@Controller()
export class TeamReceiptsController {
  constructor(
    private readonly teamReceiptsService: TeamReceiptsService,
    private readonly filesService: FileUploadsService,
  ) {}

  @UploadInterceptor()
  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, TeamReceipt))
  public async create(
    @CurrentTenant() tenant: Tenant,
    @CurrentUser() user: User,
    @Body() createTeamReceiptDto: CreateTeamReceiptDto,
    @UploadedFile() file: MulterFile,
  ): Promise<TeamReceipt> {
    if (!file)
      throw new BadRequestException('No file provided');

    const fileUpload = await this.filesService.create(
      tenant,
      user,
      file,
      FileKind.TeamFile,
      createTeamReceiptDto.fileLastModifiedAt,
    );
    return await this.teamReceiptsService.create(user, createTeamReceiptDto, fileUpload);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, TeamReceipt))
  public async findAll(
    @Query() options: TeamReceiptListOptions,
  ): Promise<PaginatedResult<TeamReceipt>> {
    return await this.teamReceiptsService.findAll(normalizePagination(options));
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, TeamReceipt))
  public async findOne(
    @Param('id') id: string,
  ): Promise<TeamReceipt> {
    return await this.teamReceiptsService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, TeamReceipt))
  public async update(
    @Param('id') id: string,
    @Body() updateGalleryImageDto: UpdateTeamReceiptDto,
    @CurrentUser() user: User,
  ): Promise<TeamReceipt> {
    return await this.teamReceiptsService.update(user, id, updateGalleryImageDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, TeamReceipt))
  public async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.teamReceiptsService.remove(user, id);
  }
}
