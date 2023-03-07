// eslint-disable-next-line import/no-cycle
import { ActorModel } from './actor.model';
import { TenantScopedModel } from './tenant-scoped.model';
import { Field, InterfaceType } from '@nestjs/graphql';
import { IndividualKind } from '@okampus/shared/enums';
import type { IActor, IIndividual } from '@okampus/shared/dtos';

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

  @Field(() => String)
  status!: string;

  constructor(individual: IIndividual) {
    if (!individual.tenant) throw new Error('Individual must have a tenant');
    super(individual.tenant);
    this.assign(individual);
  }
}
