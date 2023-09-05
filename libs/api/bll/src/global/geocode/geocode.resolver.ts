import { GeocodeService } from './geocode.service';
import { Args, Query, Resolver } from '@nestjs/graphql';

import type { GeocodeAddress } from '@okampus/shared/types';

@Resolver('Location')
export class GeocodeResolver {
  constructor(private readonly geocodeService: GeocodeService) {}

  @Query()
  public async searchLocation(@Args('query') query: string): Promise<GeocodeAddress[]> {
    return await this.geocodeService.searchLocation(query);
  }
}
