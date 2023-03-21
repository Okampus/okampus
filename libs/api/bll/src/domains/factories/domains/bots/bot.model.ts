// eslint-disable-next-line import/no-cycle
import { ActorModel, IndividualModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';

import { BotRole, IndividualKind } from '@okampus/shared/enums';
import { Field, ObjectType } from '@nestjs/graphql';

import type { IActor, IBot } from '@okampus/shared/dtos';

@ObjectType({ implements: () => [IndividualModel] })
export class BotModel extends IndividualModel implements IBot {
  @Field(() => BotRole)
  botRole!: BotRole;

  @Field(() => ActorModel)
  owner?: IActor;

  constructor(bot: Omit<IBot, 'individualKind'>) {
    super({ ...bot, individualKind: IndividualKind.Bot });
    this.assign(bot);

    this.individualKind = IndividualKind.Bot;
  }
}

@ObjectType()
export class PaginatedBotModel extends Paginated(BotModel) {}
