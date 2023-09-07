import { getLegalUnitsData } from './data/legal-units.data';
import { LegalUnit } from '@okampus/api/dal';
import { LegalUnitType } from '@okampus/shared/enums';

import type { S3Client } from '@aws-sdk/client-s3';

export async function seedLegalUnits(s3Client: S3Client | null): Promise<LegalUnit[]> {
  const legalUnitsData = await getLegalUnitsData(s3Client);
  return legalUnitsData.map(
    (legalUnit) =>
      new LegalUnit({
        name: legalUnit.name,
        legalName: legalUnit.name,
        slug: legalUnit.slug,
        siren: legalUnit.siren,
        type: LegalUnitType.Company,
        createdBy: null,
      }),
  );
}
