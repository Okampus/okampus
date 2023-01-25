import { ActorProps } from '@okampus/shared/dtos';
import { DeepPartial } from '@okampus/shared/types';
import { Bot } from '../resources/actor/bot/bot.entity';
import { User } from '../resources/actor/user/user.entity';
import { Canteen } from '../resources/org/canteen/canteen.entity';
import { ClassGroup } from '../resources/org/class-group/class-group.entity';
import { Cohort } from '../resources/org/cohort/cohort.entity';
import { Team } from '../resources/org/team/team.entity';
import { Tenant } from '../resources/org/tenant/tenant.entity';

export type ActorEntityType = User | Bot | Team | Tenant | Cohort | ClassGroup | Canteen;
export type FlatActorData<T extends ActorEntityType> = DeepPartial<Omit<T, 'actor'>> & DeepPartial<ActorProps>;
