import {
  Args,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { Class, PaginatedClass } from './class.entity';
import { ClassesService } from './class.service';

@Resolver(() => Class)
export class ClassesResolver {
  constructor(
    private readonly classesService: ClassesService,
  ) {}

  // TODO: Add permission checks
  @Query(() => PaginatedClass)
  public async classes(): Promise<PaginatedClass> {
    return await this.classesService.findAll();
  }

  @Query(() => Class)
  public async classById(@Args('id') id: string): Promise<Class> {
    return await this.classesService.findOne(id);
  }
}
