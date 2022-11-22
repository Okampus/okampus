import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import { PubSubEngine } from 'graphql-subscriptions';
import { GraphQLUpload } from 'graphql-upload-minimal';
import { APP_PUB_SUB } from '@meta/shared/lib/constants';
import { CurrentTenant } from '@meta/shared/lib/decorators/current-tenant.decorator';
import { CurrentUser } from '@meta/shared/lib/decorators/current-user.decorator';
import { FileKind } from '@meta/shared/lib/types/enums/file-kind.enum';
import { Team } from '@modules/org/teams/team.entity';
import { Tenant } from '@modules/org/tenants/tenant.entity';
import { CreateTeamReceiptDto } from '@modules/store/team-receipts/dto/create-team-receipt.dto';
import { User } from '@modules/uua/users/user.entity';
import { FileUploadsService } from '../file-uploads/file-uploads.service';
import { TeamReceipt } from './team-receipt.entity';
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
