export type GeocodeLocation = {
  id?: string;
  name: string;
  street: string;
  state: string;
  city: string;
  zip: string;
  country: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
};

export type AddressLocation = {
  coordinates: {
    longitude: number;
    latitude: number;
  };
};
