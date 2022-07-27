import {
  Args,
  Int,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { SchoolGroupMembershipsService } from './memberships.service';
import { SchoolGroupMembership } from './school-group-membership.entity';

@Resolver(() => SchoolGroupMembership)
export class SchoolYearsResolver {
  constructor(
    private readonly schoolGroupMembershipsService: SchoolGroupMembershipsService,
  ) {}

  // TODO: Add permission checks
  @Query(() => SchoolGroupMembership)
  public async schoolGroupMembershipsById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<SchoolGroupMembership[]> {
    const paginatedMemberships = await this.schoolGroupMembershipsService.findMembers(id);
    return paginatedMemberships.items;
  }
}
