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
    private readonly classesService: ClassesService,
  ) {}

  // TODO: Add permission checks
  @Query(() => [Class])
  public async classes(): Promise<Class[]> {
    const paginatedClasses = await this.classesService.findAll();
    return paginatedClasses.items;
  }

  @Query(() => Class)
  public async classById(@Args('id') id: string): Promise<Class> {
    return await this.classesService.findOne(id);
  }
}
