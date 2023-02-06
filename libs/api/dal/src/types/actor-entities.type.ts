import type { ActorProps } from '@okampus/shared/dtos';
import type { DeepPartial } from '@okampus/shared/types';
import type { Bot } from '../resources/actor/bot/bot.entity';
import type { User } from '../resources/actor/user/user.entity';
import type { Canteen } from '../resources/org/canteen/canteen.entity';
import type { ClassGroup } from '../resources/org/class-group/class-group.entity';
import type { Cohort } from '../resources/org/cohort/cohort.entity';
import type { Team } from '../resources/org/team/team.entity';
import type { Tenant } from '../resources/org/tenant/tenant.entity';

export type ActorEntityType = User | Bot | Team | Tenant | Cohort | ClassGroup | Canteen;
export type FlatActorData<T extends ActorEntityType> = DeepPartial<Omit<T, 'actor'>> & DeepPartial<ActorProps>;
