// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { NationalIdentificationService } from './national-identification.service';
import { Args, Query, Resolver } from '@nestjs/graphql';
import type { AddressInfo, CompanyInfo } from '@okampus/shared/types';

@Resolver()
export class NationalIdentificationResolver {
  constructor(private readonly nationalIdentificationService: NationalIdentificationService) {}

  @Query()
  public async searchFrenchCompany(
    @Args('query') query: { name: string; address: AddressInfo }
  ): Promise<CompanyInfo[]> {
    return await this.nationalIdentificationService.searchFrenchCompany(query.name, query.address);
  }
}
