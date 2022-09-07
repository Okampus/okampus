import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { Interest } from './interest.entity';
import { InterestsService } from './interests.service';

// TODO: Add permission checks
@Resolver(() => Interest)
export class InterestsResolver {
  constructor(
    private readonly interestsService: InterestsService,
  ) {}

  @Query(() => Interest)
  public async interestById(@Args('id', { type: () => Int }) id: number): Promise<Interest> {
    return await this.interestsService.findOne(id);
  }

  @Query(() => [Interest])
  public async interests(): Promise<Interest[]> {
    const paginatedEvents = await this.interestsService.findAll();
    return paginatedEvents.items;
  }

  @Mutation(() => Interest)
  public async createInterest(@Args('input') input: CreateInterestDto): Promise<Interest> {
    return await this.interestsService.create(input);
  }

  @Mutation(() => Interest)
  public async updateInterest(@Args('id', { type: () => Int }) id: number, @Args('input') input: UpdateInterestDto): Promise<Interest> {
    return await this.interestsService.update(id, input);
  }

  @Mutation(() => Interest)
  public async deleteInterest(@Args('id', { type: () => Int }) id: number): Promise<Interest> {
    return await this.interestsService.remove(id);
  }
}
