import {
  Args,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { SchoolGroup } from './school-group.entity';
import { SchoolGroupsService } from './school-groups.service';

@Resolver(() => SchoolGroup)
export class SchoolGroupsResolver {
  constructor(
    private readonly schoolGroupsService: SchoolGroupsService,
  ) {}

  // TODO: Add permission checks
  @Query(() => [SchoolGroup])
  public async schoolGroups(): Promise<SchoolGroup[]> {
    const paginatedSchoolGroups = await this.schoolGroupsService.findAll();
    return paginatedSchoolGroups.items;
  }

  @Query(() => SchoolGroup)
  public async schoolGroupById(@Args('id') id: string): Promise<SchoolGroup> {
    return await this.schoolGroupsService.findOne(id);
  }
}
