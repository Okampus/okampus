import { registerEnumType } from '@nestjs/graphql';

export enum TeamFileType {
  Constitution = 'Constitution',
  Rules = 'Rules',
  Transcript = 'Transcript',
  LegalReceipt = 'LegalReceipt',
  Brochure = 'Brochure',
  GraphicCharter = 'GraphicCharter',
}

registerEnumType(TeamFileType, { name: 'TeamFileType' });
