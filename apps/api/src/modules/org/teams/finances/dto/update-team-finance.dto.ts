import { InputType, PartialType } from '@nestjs/graphql';
import { CreateTeamFinanceDto } from '@teams/finances/dto/create-team-finance.dto';

@InputType()
export class UpdateTeamFinanceDto extends PartialType(CreateTeamFinanceDto) {}
