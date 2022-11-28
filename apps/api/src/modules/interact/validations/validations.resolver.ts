
import {
  Args,
  Int,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from '@common/lib/decorators/current-user.decorator';
import { User } from '@modules/uaa/users/user.entity';
import { Validation } from './validation.entity';
import { ValidationsService } from './validations.service';

@Resolver(() => Validation)
export class ValidationsResolver {
  constructor(
    private readonly validationsService: ValidationsService,
  ) {}

  // TODO: Add permission checks
  @Query(() => Validation)
  public async validationById(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Validation> {
    return await this.validationsService.findOne(user, id);
  }
}
