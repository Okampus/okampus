import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import type { GraphQLTypes, InputType } from '../../../zeus';

export const poleBaseInfo = Selector('Pole')({ ...entityBase, name: true, description: true });
export type PoleBaseInfo = InputType<GraphQLTypes['Pole'], typeof poleBaseInfo>;
