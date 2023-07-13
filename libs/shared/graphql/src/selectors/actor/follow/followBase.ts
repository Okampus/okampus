import { followMinimalInfo } from './followMinimal';
import { Selector } from '../../../zeus';
import { individualBaseInfo } from '../../individual/individualBase';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const followBaseInfo = Selector('Follow')({ ...followMinimalInfo, createdBy: individualBaseInfo });
export type FollowBaseInfo = InputType<GraphQLTypes['Follow'], typeof followBaseInfo>;
