import { ShortcutsService } from './shortcuts.service';
import {
  ShortcutsMutationResolver,
  ShortcutsQueryAggregateResolver,
  ShortcutsQueryResolver
} from './shortcuts.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Shortcut } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([Shortcut])],
  providers: [
    ShortcutsMutationResolver,
    ShortcutsQueryResolver,
    ShortcutsQueryAggregateResolver,
    ShortcutsService
  ],
  exports: [ShortcutsService],
})
export class ShortcutsModule {}