import { prisma } from '../db';
import { geoapifyApiKey } from '../../../config/secrets';

import axios from 'axios';
import type { Countries } from '@okampus/shared/consts';

const axiosInstance = axios.create({ baseURL: 'https://api.geoapify.com', method: 'GET' });
axiosInstance.interceptors.request.use((config) => {
  config.params = { apiKey: geoapifyApiKey, ...config.params };
  return config;
});

type Feature = {
  lon: number;
  lat: number;
  address_line1?: string;
  address_line2?: string;
  category?: string;
  result_type: string;
  name?: string;
  housenumber?: string;
  street: string;
  postcode: string;
  city: string;
  state: string;
  country_code: string;
  place_id: string;
};

const PARIS_BIAS = 'proximity:2.3488,48.8534';

export async function getGeoapifyAddress(geoapifyId: string) {
  const address = await prisma.address.findUnique({ where: { geoapifyId } });
  if (address) return address;

  const config = { params: { format: 'json', lang: 'fr' } };
  const url = `v2/place-details?id=${encodeURIComponent(geoapifyId)}`;
  const { data } = await axiosInstance.get<{ features: { properties?: Feature }[] }>(url, config).catch(async () => {
    return { data: { features: [] } };
  });

  const feature = data.features[0];
  if (!feature.properties) return null;

  return await prisma.address.upsert({
    where: { geoapifyId },
    update: {},
    create: {
      geoapifyId,
      latitude: feature.properties.lat,
      longitude: feature.properties.lon,
      category: feature.properties.category ?? feature.properties.result_type,
      name: feature.properties.name ?? feature.properties.address_line1 ?? '',
      streetNumber: feature.properties.housenumber ?? '',
      street: feature.properties.street,
      zip: feature.properties.postcode,
      city: feature.properties.city,
      country: feature.properties.country_code.toUpperCase() as Countries,
      state: feature.properties.state,
    },
  });
}

export async function getAddress(geoapifyId: string) {
  const address = await prisma.address.findUnique({ where: { geoapifyId } });

  if (!address) {
    const geoapifyAddress = await getGeoapifyAddress(geoapifyId);
    if (!geoapifyAddress) throw new Error(`Address not found for geoapifyId: ${geoapifyId}`);
    return geoapifyAddress;
  }

  return address;
}

export async function searchAddresses(query: string, limit: number) {
  const config = { params: { limit, format: 'json', type: 'amenity', lang: 'fr', bias: PARIS_BIAS } };
  const url = `v1/geocode/autocomplete?text=${encodeURIComponent(query)}`;
  const { data } = await axiosInstance.get<{ results: Feature[] }>(url, config).catch(async (error) => {
    console.error(error);
    return { data: { results: [] } };
  });

  return data.results.map((result) => ({
    latitude: result.lat,
    longitude: result.lon,
    category: result.category ?? result.result_type,
    name: result.name ?? result.address_line1 ?? '',
    streetNumber: result.housenumber ?? '',
    street: result.street,
    zip: result.postcode,
    city: result.city,
    country: result.country_code.toUpperCase(),
    state: result.state,
    geoapifyId: result.place_id,
  }));
}
