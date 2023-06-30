import { Selector } from '../../../zeus';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const geocodeAddressBaseInfo = Selector('GeocodeAddress')({
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
  geoapifyId: true,
});
export type GeocodeAddressBaseInfo = InputType<GraphQLTypes['GeocodeAddress'], typeof geocodeAddressBaseInfo>;
