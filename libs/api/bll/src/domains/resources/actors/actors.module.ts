import { ActorsResolver } from './actors.resolver';
import { ActorsService } from './actors.service';
import { DeactivateActorImageHandler } from './commands/deactivate-actor-image/deactivate-actor-image.handler';

import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

const commandHandlers = [DeactivateActorImageHandler];
// const queryHandlers = [];

@Module({
  imports: [CqrsModule],
  providers: [
    ActorsResolver,
    ActorsService,
    ...commandHandlers,
    // ...queryHandlers
  ],
  exports: [ActorsService],
})
export class ActorsModule {}
