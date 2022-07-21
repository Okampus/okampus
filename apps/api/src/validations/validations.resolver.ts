
import {
 Args, Int, Query, Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Validation } from './entities/validation.entity';
import { ValidationsService } from './validations.service';

@Resolver(() => Validation)
export class ValidationsResolver {
  constructor(
    private readonly validationsService: ValidationsService,
  ) {}

  // TODO: Add permission checks
  @Query(() => Validation)
  public async getValidationById(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Validation> {
    return await this.validationsService.findOne(user, id);
  }
}
