import prisma from '../../../../../database/prisma/db';
import { baseUrl, protocol } from '../../../../../config';

import { getApolloQuery } from '../../../../../server/ssr/getApolloQuery';

import { isNotNull } from '@okampus/shared/utils';
import { GetMeDocument } from '@okampus/shared/graphql';
import { redirect } from 'next/navigation';

import type { GetMeQuery, GetMeQueryVariables } from '@okampus/shared/graphql';

const getTenantIds = (adminRoles: { tenant: { id: string } | null }[]) =>
  adminRoles
    .map((role) => role.tenant)
    .filter(isNotNull)
    .map((tenant) => BigInt(tenant.id));

export default async function SigninTenantPage() {
  const { data, errors } = await getApolloQuery<GetMeQuery, GetMeQueryVariables>({
    query: GetMeDocument,
  });

  if (process.env.NODE_ENV !== 'production') console.warn({ data, errors: JSON.stringify(errors) });

  const user = data?.getCurrentUser;
  if (!user) redirect('/signin');

  const where = user.adminRoles.some((role) => !role.tenant)
    ? {}
    : { OR: [{ id: { in: getTenantIds(user.adminRoles) } }, { tenantMembers: { some: { userId: BigInt(user.id) } } }] };

  const tenant = await prisma.tenant.findMany({
    where,
    select: { domain: true, actor: { select: { avatar: true, name: true } }, oidcName: true },
  });

  if (tenant.length === 1) redirect(`${protocol}://${tenant[0].domain}.${baseUrl}`);

  return (
    <div>
      {tenant.map((tenant) => {
        return <div key={tenant.domain}>{tenant.actor.name}</div>;
      })}
    </div>
  );
}
