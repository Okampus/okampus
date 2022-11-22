import {
  Args,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { SchoolYear } from './school-year.entity';
import { SchoolYearsService } from './school-years.service';

@Resolver(() => SchoolYear)
export class SchoolYearsResolver {
  constructor(
    private readonly schoolYearsService: SchoolYearsService,
  ) {}

  // TODO: Add permission checks
  @Query(() => SchoolYear)
  public async schoolYearById(@Args('id') id: string): Promise<SchoolYear> {
    return await this.schoolYearsService.findOne(id);
  }
}
