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
  id: string;
  properties: { address?: string };
  address?: string;
  text: string;
  place_name: string;
  center: [number, number];
  context: { id: string; text: string }[];
};
type LocationTypes = 'poi' | 'address';

@Injectable()
export class GeocodeService {
  axiosInstance: AxiosInstance;
  logger = new Logger(GeocodeService.name);

  constructor(private readonly configService: ConfigService, private readonly em: EntityManager) {
    const options = loadConfig<ApiConfig['mapbox']>(this.configService, 'mapbox');

    this.axiosInstance = axios.create({ baseURL: 'https://api.mapbox.com', method: 'GET' });
    this.axiosInstance.interceptors.request.use((config) => {
      config.params = { access_token: options.apiKey, ...config.params };
      return config;
    });
  }

  // public async createAddressFromId(id: string): Promise<ActorAddress> {
  //   const url = `/search/searchbox/v1/retrieve/${encodeURIComponent(id)}`;
  //   const { data } = await this.axiosInstance.get<{ features: Feature[] }>(url);
  // }

  public async searchLocation(
    query: string,
    types: LocationTypes[] = ['poi', 'address'],
    limit = 4
  ): Promise<GeocodeLocation[]> {
    const config = {
      params: {
        limit,
        fuzzyMatch: true,
        proximity: 'ip',
        language: 'fr',
        ...(types.length > 0 ? { types: types.join(',') } : {}),
      },
    };
    const url = `/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`;
    console.log('URL', url);
    const { data } = await this.axiosInstance.get<{ features: Feature[] }>(url, config);

    // console.log('Features', data.features);
    return data.features.map((feature) => {
      const street =
        feature.properties.address ??
        (feature.address ? `${feature.address} ${feature.text}` : feature.place_name.split(',')[0]);
      const city = feature.context.find((context) => context.id.includes('place'))?.text || '';
      const zip = feature.context.find((context) => context.id.includes('postcode'))?.text || '';
      const state = feature.context.find((context) => context.id.includes('region'))?.text || '';
      const country = feature.context.find((context) => context.id.includes('country'))?.text || '';

      return {
        name: feature.text,
        city,
        zip,
        country,
        state,
        street,
        coordinates: {
          longitude: feature.center[0],
          latitude: feature.center[1],
        },
      };
    });
  }
}
