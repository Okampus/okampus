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
import { CurrentTenant } from '@common/lib/decorators/current-tenant.decorator';
import { CurrentUser } from '@common/lib/decorators/current-user.decorator';
import { UploadInterceptor } from '@common/lib/decorators/upload-interceptor.decorator';
import { FileKind } from '@common/lib/types/enums/file-kind.enum';
import { Action, CheckPolicies } from '@common/modules/authorization';
import { normalizePagination } from '@common/modules/pagination';
import type { PaginatedResult } from '@common/modules/pagination';
import { Tenant } from '@modules/org/tenants/tenant.entity';
import { CreateTeamReceiptDto } from '@modules/store/team-receipts/dto/create-team-receipt.dto';
import { User } from '@modules/uua/users/user.entity';
import { FileUploadsService } from '../file-uploads/file-uploads.service';
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