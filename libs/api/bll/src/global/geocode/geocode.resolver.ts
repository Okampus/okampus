// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { GeocodeService } from './geocode.service';
import { Args, Query, Resolver } from '@nestjs/graphql';

import type { GeocodeLocation } from '@okampus/shared/types';

@Resolver('Location')
export class GeocodeResolver {
  constructor(private readonly geocodeService: GeocodeService) {}

  @Query()
  public async searchLocation(@Args('query') query: string): Promise<GeocodeLocation[]> {
    console.log('query', query);
    return await this.geocodeService.searchLocation(query);
    // if (!requester.user) throw new BadRequestException('No user found');
    // const data = await this.hasuraService.findByPk('userInfoByPk', getSelectionSet(info), { id: requester.user.id });
    // return data.userInfoByPk;
  }
}
