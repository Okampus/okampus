// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { GoogleService } from './google.service';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class GoogleResolver {
  constructor(private readonly googleSearch: GoogleService) {}

  @Query()
  public async getFirstResultLink(@Args('query') query: string): Promise<string> {
    return await this.googleSearch.getFirstResultLink(query);
  }
}
