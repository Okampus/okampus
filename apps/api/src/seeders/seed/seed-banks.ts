import { getBanksData } from './data/banks.data';
import { LegalUnit } from '@okampus/api/dal';
import { LegalUnitType } from '@okampus/shared/enums';

import type { S3Client } from '@aws-sdk/client-s3';

export async function seedBanks(s3Client: S3Client | null): Promise<LegalUnit[]> {
  const banksData = await getBanksData(s3Client);
  return banksData.map(
    (bank) =>
      new LegalUnit({
        name: bank.name,
        legalName: bank.name,
        slug: bank.slug,
        siren: bank.siren,
        bankCode: bank.bankCode,
        type: LegalUnitType.Bank,
        createdBy: null,
      }),
  );
}
