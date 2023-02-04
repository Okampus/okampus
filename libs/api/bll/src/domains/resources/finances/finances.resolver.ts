import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import type { CreateFinanceDto, UpdateFinanceDto } from '@okampus/shared/dtos';
import type { PaginationOptions } from '../../../shards/types/pagination-options.type';
import type { MulterFileType, Snowflake } from '@okampus/shared/types';
import type { FinancesService } from './finances.service';
import { FinanceModel, PaginatedFinanceModel } from '../../factories/domains/teams/finance.model';
import { GraphQLUpload } from 'graphql-upload-minimal';

@Resolver(() => FinanceModel)
export class FinancesResolver {
  constructor(private readonly financesService: FinancesService) {}

  @Query(() => FinanceModel)
  financeById(@Args('id', { type: () => String }) id: Snowflake) {
    return this.financesService.findOneById(id);
  }

  @Query(() => PaginatedFinanceModel)
  finances(@Args('options', { nullable: true }) options: PaginationOptions) {
    return this.financesService.find(options);
  }

  @Query(() => PaginatedFinanceModel)
  financesByTeam(@Args('teamId') teamId: string, @Args('options', { nullable: true }) options: PaginationOptions) {
    return this.financesService.findByTeam(teamId, options);
  }

  @Mutation(() => FinanceModel)
  createFinance(
    @Args('finance') finance: CreateFinanceDto,
    @Args('receipts', { type: () => [GraphQLUpload], nullable: true }) receipts?: MulterFileType[]
  ) {
    return this.financesService.create(finance, receipts);
  }

  @Mutation(() => FinanceModel)
  updateFinance(@Args('updateFinance') updateFinance: UpdateFinanceDto) {
    return this.financesService.update(updateFinance);
  }

  @Mutation(() => Boolean)
  deleteFinance(@Args('id', { type: () => String }) id: Snowflake) {
    return this.financesService.delete(id);
  }
}
