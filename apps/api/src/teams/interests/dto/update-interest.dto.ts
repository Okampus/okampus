import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateInterestDto } from './create-interest.dto';

@InputType()
export class UpdateInterestDto extends PartialType(OmitType(CreateInterestDto, ['teamId', 'userId'])) {}
