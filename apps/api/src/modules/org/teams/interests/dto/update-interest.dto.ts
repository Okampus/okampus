import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateInterestDto } from '@modules/org/teams/interests/dto/create-interest.dto';

@InputType()
export class UpdateInterestDto extends PartialType(OmitType(CreateInterestDto, ['teamId', 'userId'])) {}
