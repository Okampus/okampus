import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const addressBaseInfo = Selector('Address')({
  ...entityBase,
  latitude: true,
  longitude: true,
  category: true,
  name: true,
  streetNumber: true,
  street: true,
  zip: true,
  city: true,
  state: true,
  country: true,
});
export type AddressBaseInfo = InputType<GraphQLTypes['Address'], typeof addressBaseInfo>;
