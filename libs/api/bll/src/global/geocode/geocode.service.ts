import { loadConfig } from '../../shards/utils/load-config';

import { EntityManager } from '@mikro-orm/core';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import axios from 'axios';

import { Address } from '@okampus/api/dal';

import type { AxiosInstance } from 'axios';
import type { ApiConfig, GeocodeAddress } from '@okampus/shared/types';
import type { Countries } from '@okampus/shared/consts';

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

@Injectable()
export class GeocodeService {
  axiosInstance: AxiosInstance;
  logger = new Logger(GeocodeService.name);
  private readonly options: ApiConfig['geoapify'];

  constructor(
    private readonly em: EntityManager,
    private readonly configService: ConfigService,
  ) {
    this.options = loadConfig(this.configService, 'geoapify');

    this.axiosInstance = axios.create({ baseURL: 'https://api.geoapify.com', method: 'GET' });
    this.axiosInstance.interceptors.request.use((config) => {
      config.params = { apiKey: this.options.apiKey, ...config.params };
      return config;
    });
  }

  public async searchLocation(query: string, limit = 5): Promise<GeocodeAddress[]> {
    if (!this.options.isEnabled) return [];

    const config = { params: { limit, format: 'json', type: 'amenity', lang: 'fr', bias: PARIS_BIAS } };
    const url = `v1/geocode/autocomplete?text=${encodeURIComponent(query)}`;
    const { data } = await this.axiosInstance.get<{ results: Feature[] }>(url, config).catch(async (error) => {
      this.logger.error(error);
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

  public async getGeoapifyAddress(geoapifyId: string): Promise<Address | null> {
    if (!this.options.isEnabled) return null;

    const address = await this.em.findOne(Address, { geoapifyId });
    if (address) return address;

    const config = { params: { format: 'json', lang: 'fr' } };
    const url = `v2/place-details?id=${encodeURIComponent(geoapifyId)}`;
    const { data } = await this.axiosInstance
      .get<{ features: { properties?: Feature }[] }>(url, config)
      .catch(async (error) => {
        this.logger.error(error);
        return { data: { features: [] } };
      });

    const feature = data.features[0];
    if (!feature.properties) return null;

    return new Address({
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
      geoapifyId: feature.properties.place_id,
    });
  }
}
