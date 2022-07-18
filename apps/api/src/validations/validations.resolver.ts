
import { Inject } from '@nestjs/common';
import {
 Args, Int, Mutation, Query, Resolver, Subscription,
} from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { APP_PUB_SUB } from '../shared/lib/constants';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Validation } from './entities/validation.entity';
import { ValidationsService } from './validations.service';

@Resolver(() => Validation)
export class ValidationsResolver {
  constructor(
    @Inject(APP_PUB_SUB) private readonly pubSub: PubSubEngine,
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

  @Mutation(() => Validation)
  public async addValidation(@CurrentUser() user: User, @Args('contentId') contentId: number): Promise<Validation> {
    const createdValidation = await this.validationsService.create(contentId, user);
    await this.pubSub.publish('validationAdded', { createdValidation });
    return createdValidation;
  }

  @Subscription(() => Validation)
  public threadAdded(): AsyncIterator<Validation> {
    return this.pubSub.asyncIterator('validationAdded');
  }
}
