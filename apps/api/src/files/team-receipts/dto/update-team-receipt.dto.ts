import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateTeamReceiptDto } from './create-team-receipt.dto';

@InputType()
export class UpdateTeamReceiptDto extends PartialType(OmitType(CreateTeamReceiptDto, ['teamId'])) {}
