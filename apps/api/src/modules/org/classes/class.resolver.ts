import {
  Args,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { Class } from './class.entity';
import { ClassesService } from './class.service';

@Resolver(() => Class)
export class ClassesResolver {
  constructor(
    private readonly schoolGroupsService: ClassesService,
  ) {}

  // TODO: Add permission checks
  @Query(() => [Class])
  public async schoolGroups(): Promise<Class[]> {
    const paginatedClasses = await this.schoolGroupsService.findAll();
    return paginatedClasses.items;
  }

  @Query(() => Class)
  public async schoolGroupById(@Args('id') id: string): Promise<Class> {
    return await this.schoolGroupsService.findOne(id);
  }
}
