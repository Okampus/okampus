import {
  Args,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { SchoolGroup } from '../school-group.entity';
import { SchoolGroupsService } from '../school-groups.service';
import { SchoolGroupMembershipsService } from './memberships.service';
import { SchoolGroupMembership } from './school-group-membership.entity';

@Resolver(() => SchoolGroupMembership)
export class SchoolGroupMembershipsResolver {
  constructor(
    private readonly schoolGroupMembershipsService: SchoolGroupMembershipsService,
    private readonly schoolGroupsService: SchoolGroupsService,
  ) {}

  @ResolveField(() => [SchoolGroup])
  public async getParents(@Parent() schoolGroupMembership: SchoolGroupMembership): Promise<SchoolGroup[]> {
    const nParents = 4;
    const parents = [schoolGroupMembership.schoolGroup];
    if (typeof schoolGroupMembership.schoolGroup.parent?.id !== 'string')
      return parents;

    for (let i = 0; i < nParents; i++) {
      const parentId = parents[parents.length - 1].parent?.id;
      if (typeof parentId !== 'string')
        break;

      // eslint-disable-next-line no-await-in-loop
      parents.push(await this.schoolGroupsService.findOne(parentId));
    }

    return parents;
  }

  // TODO: Add permission checks
  @Query(() => SchoolGroupMembership)
  public async schoolGroupMembershipsById(
    @Args('id') id: string,
  ): Promise<SchoolGroupMembership[]> {
    const paginatedMemberships = await this.schoolGroupMembershipsService.findMembers(id);
    return paginatedMemberships.items;
  }
}
