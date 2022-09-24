import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import { PubSubEngine } from 'graphql-subscriptions';
import { GraphQLUpload } from 'graphql-upload-minimal';
import { APP_PUB_SUB } from '../../shared/lib/constants';
import { CurrentTenant } from '../../shared/lib/decorators/current-tenant.decorator';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { FileKind } from '../../shared/lib/types/enums/file-kind.enum';
import { Team } from '../../teams/teams/team.entity';
import { Tenant } from '../../tenants/tenants/tenant.entity';
import { User } from '../../users/user.entity';
import { FileUploadsService } from '../file-uploads/file-uploads.service';
import { CreateTeamReceiptDto } from './dto/create-team-receipt.dto';
import { TeamReceipt } from './team-receipts.entity';
import { TeamReceiptsService } from './team-receipts.service';


@Resolver(() => Team)
export class TeamReceiptsResolver {
  constructor(
    @Inject(APP_PUB_SUB) private readonly pubSub: PubSubEngine,
    private readonly teamReceiptsService: TeamReceiptsService,
    private readonly fileUploadsService: FileUploadsService,
  ) {}

  @Mutation(() => TeamReceipt)
  public async addTeamReceipt(
    @CurrentTenant() tenant: Tenant,
    @CurrentUser() user: User,
    @Args('file', { type: () => GraphQLUpload }) file: MulterFile,
    @Args('createReceipt') createReceipt: CreateTeamReceiptDto,
  ): Promise<TeamReceipt> {
    const fileUpload = await this.fileUploadsService.create(
      tenant,
      user,
      file,
      FileKind.TeamFile,
      createReceipt.fileLastModifiedAt,
    );
    return await this.teamReceiptsService.create(user, createReceipt, fileUpload);
  }
}
