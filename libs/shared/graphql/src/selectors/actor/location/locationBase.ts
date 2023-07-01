import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import { addressBaseInfo } from '../address/addressBase';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const locationBaseInfo = Selector('Location')({
  ...entityBase,
  type: true,
  locationNote: true,
  address: addressBaseInfo,
  name: true,
  onlineLink: true,
});
export type LocationBaseInfo = InputType<GraphQLTypes['Location'], typeof locationBaseInfo>;
