import prisma from '../../../../database/prisma/db';

import { BadRequestError } from '../../../../server/error';
import { getGoCardLessRequisition } from '../../../../server/services/bank';
import { withAuth } from '../../../../server/utils/withAuth';
import { withTeamPermission } from '../../../../server/utils/withTeamPermission';
import { parseSnowflake } from '../../../../utils/parse-snowflake';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const goCardLessInstitutionId = url.searchParams.get('institutionId');
  const teamId = parseSnowflake(url.searchParams.get('teamId'));

  if (!goCardLessInstitutionId || !teamId) throw new BadRequestError('INVALID_FIELD');

  const authContext = await withAuth();
  const { team } = await withTeamPermission({ authContext, teamIdOrSlug: teamId, role: { canManageTreasury: true } });

  const bank = await prisma.bank.findFirst({ where: { goCardLessInstitutionId } });
  if (!bank) throw new BadRequestError('INVALID_FIELD', { goCardLessInstitutionId: 'Bank not found' });

  const existingRequisition = await prisma.bankRequisition.findFirst({
    where: { bankId: bank.goCardLessInstitutionId, teamId, accountsLastAccessedAt: null },
  });

  if (existingRequisition) {
    if (existingRequisition.validatedAt)
      redirect(`/manage/team/${team.slug}/bank/onboard/${bank.goCardLessInstitutionId}`);
    redirect(existingRequisition.authorizationLink);
  }

  const { id, link } = await getGoCardLessRequisition(
    bank.goCardLessInstitutionId,
    team.slug,
    authContext.tenant.domain,
  );

  await prisma.bankRequisition.create({
    data: { goCardLessRequisitionId: id, bankId: bank.goCardLessInstitutionId, teamId, authorizationLink: link },
  });

  redirect(link);
}
