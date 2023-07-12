import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import { userBaseInfo } from '../../individual/userBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const eventJoinMinimalInfo = Selector('EventJoin')({ ...entityBase, joinedBy: userBaseInfo });
export type EventJoinMinimalInfo = InputType<GraphQLTypes['EventJoin'], typeof eventJoinMinimalInfo>;
