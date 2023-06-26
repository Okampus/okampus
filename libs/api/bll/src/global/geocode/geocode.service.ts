/* eslint-disable unicorn/no-array-method-this-argument */
import { loadConfig } from '../../shards/utils/load-config';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '@nestjs/config';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';
import { Injectable, Logger } from '@nestjs/common';

import axios from 'axios';

import type { AxiosInstance } from 'axios';
import type { ApiConfig, GeocodeLocation } from '@okampus/shared/types';

type Feature = {
  lon: number;
  lat: number;
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

  constructor(private readonly configService: ConfigService, private readonly em: EntityManager) {
    const options = loadConfig<ApiConfig['geoapify']>(this.configService, 'geoapify');

    this.axiosInstance = axios.create({ baseURL: 'https://api.geoapify.com', method: 'GET' });
    this.axiosInstance.interceptors.request.use((config) => {
      config.params = { access_token: options.apiKey, ...config.params };
      return config;
    });
  }

  // public async createAddressFromId(id: string): Promise<Address> {
  //   const url = `/search/searchbox/v1/retrieve/${encodeURIComponent(id)}`;
  //   const { data } = await this.axiosInstance.get<{ features: Feature[] }>(url);
  // }

  public async searchLocation(query: string, limit = 5): Promise<GeocodeLocation[]> {
    const config = { params: { limit, format: 'json', type: 'amenity', lang: 'fr', bias: PARIS_BIAS } };
    const url = `v1/geocode/autocomplete?${encodeURIComponent(query)}`;
    const { data } = await this.axiosInstance.get<{ results: Feature[] }>(url, config);

    return data.results.map((result) => ({
      latitude: result.lat,
      longitude: result.lon,
      category: result.category ?? result.result_type,
      name: result.name ?? '',
      streetNumber: result.housenumber ?? '',
      street: result.street,
      zip: result.postcode,
      city: result.city,
      country: result.country_code.toUpperCase(),
      state: result.state,
      geoapifyId: result.place_id,
    }));
  }
}
