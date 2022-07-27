
import {
  Args,
  Int,
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
  @Query(() => SchoolGroup)
  public async schoolGroupById(@Args('id', { type: () => Int }) id: number): Promise<SchoolGroup> {
    return await this.schoolGroupsService.findOne(id);
  }
}
