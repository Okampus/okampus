import { Module, OnModuleInit } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsResolver } from './teams.resolver';
import { CqrsModule } from '@nestjs/cqrs';
import { InjectRepository, MikroOrmModule } from '@mikro-orm/nestjs';
import { Actor, BaseRepository, Bot, DatabaseSeeder, Team, User } from '@okampus/api/dal';
import { CreateTeamHandler } from './commands/create-team/create-team.handler';
import { GetTeamByIdHandler } from './queries/get-team-by-id/get-team-by-id.handler';
import { GetTeamsHandler } from './queries/get-teams/get-teams.handler';
import { UpdateTeamHandler } from './commands/update-team/update-team.handler';
import { DeleteTeamHandler } from './commands/delete-team/delete-team.handler';
import { GetTeamBySlugHandler } from './queries/get-team-by-slug/get-team-by-slug.handler';
import { MikroORM } from '@mikro-orm/core';
import { ConfigService } from '../../../global/config.module';

const commandHandlers = [CreateTeamHandler, UpdateTeamHandler, DeleteTeamHandler];
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
    this.pepper = Buffer.from(this.configService.config.crypto.pepper);
  }

  public async onModuleInit(): Promise<void> {
    const anyTeam = await this.teamRepository.find({});

    if (anyTeam.length === 0) {
      DatabaseSeeder.pepper = this.pepper;
      const seeder = this.orm.getSeeder();
      await seeder.seed(DatabaseSeeder);
    }
  }
}
