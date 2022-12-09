import {
  Args,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { PaginationOptions } from '@common/modules/pagination';
import { Class, PaginatedClass } from './class.entity';
import { ClassesService } from './class.service';

@Resolver(() => Class)
export class ClassesResolver {
  constructor(
    private readonly classesService: ClassesService,
  ) {}

  // TODO: Add permission checks
  @Query(() => PaginatedClass)
  public async classes(@Args('pagination') paginationOptions: PaginationOptions): Promise<PaginatedClass> {
    return await this.classesService.findAll(paginationOptions);
  }

  @Query(() => Class)
  public async classById(@Args('id') id: string): Promise<Class> {
    return await this.classesService.findOne(id);
  }
}
