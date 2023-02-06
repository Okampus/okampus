// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FinancesService } from './finances.service';

import { FinanceModel, PaginatedFinanceModel } from '../../factories/domains/teams/finance.model';
import { PaginationOptions } from '../../../shards/types/pagination-options.type';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload-minimal';
import { CreateFinanceDto, UpdateFinanceDto } from '@okampus/shared/dtos';
import type { MulterFileType, Snowflake } from '@okampus/shared/types';

@Resolver(() => FinanceModel)
export class FinancesResolver {
  constructor(private readonly financesService: FinancesService) {}

  @Query(() => FinanceModel)
  financeById(@Args('id', { type: () => String }) id: Snowflake) {
    return this.financesService.findOneById(id);
  }

  @Query(() => PaginatedFinanceModel)
  finances(@Args('options', { type: () => PaginationOptions, nullable: true }) options: PaginationOptions) {
    return this.financesService.find(options);
  }

  @Query(() => PaginatedFinanceModel)
  financesByTeam(
    @Args('teamId', { type: () => String }) teamId: Snowflake,
    @Args('options', { type: () => PaginationOptions, nullable: true }) options: PaginationOptions
  ) {
    return this.financesService.findByTeam(teamId, options);
  }

  @Mutation(() => FinanceModel)
  createFinance(
    @Args('finance', { type: () => CreateFinanceDto }) finance: CreateFinanceDto,
    @Args('receipts', { type: () => [GraphQLUpload], nullable: true }) receipts?: MulterFileType[]
  ) {
    return this.financesService.create(finance, receipts);
  }

  @Mutation(() => FinanceModel)
  updateFinance(@Args('updateFinance', { type: () => UpdateFinanceDto }) updateFinance: UpdateFinanceDto) {
    return this.financesService.update(updateFinance);
  }

  @Mutation(() => Boolean)
  deleteFinance(@Args('id', { type: () => String }) id: Snowflake) {
    return this.financesService.delete(id);
  }
}
