import {
  Args,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Class } from '../class.entity';
import { ClassesService } from '../class.service';
import { ClassMembership } from './class-membership.entity';
import { ClassMembershipsService } from './memberships.service';

@Resolver(() => ClassMembership)
export class ClassMembershipsResolver {
  constructor(
    private readonly classMembershipsService: ClassMembershipsService,
    private readonly classesService: ClassesService,
  ) {}

  @ResolveField(() => [Class])
  public async getParents(@Parent() classMembership: ClassMembership): Promise<Class[]> {
    const nParents = 4;
    const parents = [classMembership.schoolClass];
    if (typeof classMembership.schoolClass.parent?.id !== 'string')
      return parents;

    for (let i = 0; i < nParents; i++) {
      const parentId = parents[parents.length - 1].parent?.id;
      if (typeof parentId !== 'string')
        break;

      // eslint-disable-next-line no-await-in-loop
      parents.push(await this.classesService.findOne(parentId));
    }

    return parents;
  }

  // TODO: Add permission checks
  @Query(() => ClassMembership)
  public async classMembershipsById(
    @Args('id') id: string,
  ): Promise<ClassMembership[]> {
    const paginatedMemberships = await this.classMembershipsService.findMembers(id);
    return paginatedMemberships.items;
  }
}
