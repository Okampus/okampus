import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const addressBaseInfo = Selector('Address')({
  ...entityBase,
  country: true,
  city: true,
  state: true,
  street: true,
  zip: true,
  name: true,
  latitude: true,
  longitude: true,
});
export type AddressBaseInfo = InputType<GraphQLTypes['Address'], typeof addressBaseInfo>;
