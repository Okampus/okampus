import { Paginated } from '../../../../shards/types/paginated.type';
// eslint-disable-next-line import/no-cycle
import { ActorModel } from '../../index';
// eslint-disable-next-line import/no-cycle
import { IndividualModel } from '../../index';
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
