import { InputType, PartialType } from '@nestjs/graphql';
import { CreateInterestDto } from './create-interest.dto';

@InputType()
export class UpdateInterestDto extends PartialType(CreateInterestDto) {}
