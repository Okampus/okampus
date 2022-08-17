import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateTeamReceiptDto } from './create-team-receipt.dto';

export class UpdateTeamReceiptDto extends PartialType(OmitType(CreateTeamReceiptDto, ['id'])) {}
