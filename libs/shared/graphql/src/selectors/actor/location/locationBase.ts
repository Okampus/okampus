import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import { addressBaseInfo } from '../address/addressBase';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const locationBaseInfo = Selector('Location')({
  ...entityBase,
  address: addressBaseInfo,
  type: true,
  locationDetails: true,
  onlineLink: true,
});
export type LocationBaseInfo = InputType<GraphQLTypes['Location'], typeof locationBaseInfo>;
