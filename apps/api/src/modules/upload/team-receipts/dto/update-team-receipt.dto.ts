import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateTeamReceiptDto } from '@upload/team-receipts/dto/create-team-receipt.dto';

@InputType()
export class UpdateTeamReceiptDto extends PartialType(OmitType(CreateTeamReceiptDto, ['teamId'])) {}
