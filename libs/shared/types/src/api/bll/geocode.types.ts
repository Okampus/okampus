export type GeocodeAddress = {
  latitude: number | null;
  longitude: number | null;
  category: string;
  name: string;
  streetNumber: string;
  street: string;
  zip: string;
  city: string;
  state: string;
  country: string;
  geoapifyId: string | null;
};
