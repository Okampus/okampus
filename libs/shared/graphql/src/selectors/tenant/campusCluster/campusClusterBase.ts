import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import { campusBaseInfo } from '../campus/campusBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const campusClusterBaseInfo = Selector('CampusCluster')({
  ...entityBase,
  campuses: [{}, campusBaseInfo],
});
export type CampusClusterBaseInfo = InputType<GraphQLTypes['CampusCluster'], typeof campusClusterBaseInfo>;
