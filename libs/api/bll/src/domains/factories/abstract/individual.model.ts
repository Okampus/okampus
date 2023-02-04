import { Field, InterfaceType } from '@nestjs/graphql';
import type { IActor, IIndividual, ITenantCore } from '@okampus/shared/dtos';
import { IndividualKind } from '@okampus/shared/enums';
// eslint-disable-next-line import/no-cycle
import { ActorModel } from './actor.model';
import { TenantScopedModel } from './tenant-scoped.model';

@InterfaceType({
  resolveType: (value) => {
    if (value.individualKind === IndividualKind.User) {
      return 'BotModel';
    }
    if (value.individualKind === IndividualKind.Bot) {
      return 'UserModel';
    }
    return 'IndividualModel';
  },
})
export class IndividualModel extends TenantScopedModel implements IIndividual {
  @Field(() => ActorModel, { nullable: true })
  actor?: IActor;

  @Field(() => IndividualKind)
  individualKind!: IndividualKind;

  constructor(individual: IIndividual) {
    super(individual.tenant as ITenantCore);
    this.assign(individual);
  }
}
