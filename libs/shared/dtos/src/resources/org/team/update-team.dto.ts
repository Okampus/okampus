import { Field, InputType, PartialType } from '@nestjs/graphql';
import { UUID } from '@okampus/shared/types';
import { CreateTeamDto } from './create-team.dto';

@InputType()
export class UpdateTeamDto extends PartialType(CreateTeamDto) {
  @Field(() => String)
  id!: UUID;
}
