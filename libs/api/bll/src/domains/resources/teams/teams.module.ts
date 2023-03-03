import { TeamsService } from './teams.service';
import { TeamsResolver } from './teams.resolver';

import { CreateTeamHandler } from './commands/create-team/create-team.handler';
import { DeactivateTeamImageHandler } from './commands/deactivate-team-image/deactivate-team-image.handler';
import { UpdateTeamHandler } from './commands/update-team/update-team.handler';
import { DeleteTeamHandler } from './commands/delete-team/delete-team.handler';

import { GetTeamByIdHandler } from './queries/get-team-by-id/get-team-by-id.handler';
import { GetTeamsHandler } from './queries/get-teams/get-teams.handler';
import { GetTeamBySlugHandler } from './queries/get-team-by-slug/get-team-by-slug.handler';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '../../../global/config.module';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { MikroORM } from '@mikro-orm/core';

import { DatabaseSeeder, Team } from '@okampus/api/dal';
import { InjectRepository, MikroOrmModule } from '@mikro-orm/nestjs';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { BASE_TENANT } from '@okampus/shared/consts';

import type { BaseRepository } from '@okampus/api/dal';
import type { OnModuleInit } from '@nestjs/common';

const commandHandlers = [CreateTeamHandler, UpdateTeamHandler, DeleteTeamHandler, DeactivateTeamImageHandler];
const queryHandlers = [GetTeamByIdHandler, GetTeamsHandler, GetTeamBySlugHandler];

@Module({
  imports: [CqrsModule, MikroOrmModule.forFeature([Team])],
  providers: [TeamsResolver, TeamsService, ...commandHandlers, ...queryHandlers],
  exports: [TeamsService],
})
export class TeamsModule implements OnModuleInit {
  pepper: Buffer;

  constructor(
    private readonly orm: MikroORM,
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
    private readonly configService: ConfigService
  ) {
    this.pepper = Buffer.from(this.configService.config.cryptoSecret);
  }

  public async onModuleInit(): Promise<void> {
    const anyTeam = await this.teamRepository.find({ tenant: { domain: BASE_TENANT } });

    if (anyTeam.length === 0 && this.configService.config.database.seed) {
      DatabaseSeeder.pepper = this.pepper;
      DatabaseSeeder.targetTenant = BASE_TENANT;

      const seeder = this.orm.getSeeder();
      await seeder.seed(DatabaseSeeder);
    }
  }
}
