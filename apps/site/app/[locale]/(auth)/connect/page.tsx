import { baseUrl, protocol } from '../../../../config';
import prisma from '../../../../database/prisma/db';
import { getTranslation } from '../../../../server/ssr/getTranslation';

import AvatarImage from '../../../_components/atoms/Image/AvatarImage';
import Link from 'next/link';

import { redirect } from 'next/navigation';

import type { LangParams } from '../../../params.type';

export default async function TenantChoicePage({ params }: LangParams) {
  const { t } = await getTranslation(params.locale);

  const tenants = await prisma.tenant.findMany({
    select: {
      _count: { select: { tenantMembers: true } },
      actor: { select: { avatar: true, name: true, bio: true } },
      id: true,
      domain: true,
      oidcName: true,
    },
  });

  if (tenants.length === 1) redirect(`${protocol}://${tenants[0].domain}.${baseUrl}/signin`);
  if (tenants.length === 0)
    return (
      <div className="bg-main text-center justify-center items-center flex flex-col h-full">
        <h1 className="text-1 text-3xl font-semibold">{t('common', 'devSeedApply')} </h1>
      </div>
    );

  return (
    <div className="max-w-lg  w-full py-32 mx-auto">
      <h1 className="text-4xl text-left font-semibold text-0 mx-8 mb-12">{t('common', 'welcome')} 👋</h1>
      <div className="flex flex-col divide-y-[var(--border-2)]">
        {tenants.map(({ id, actor, domain, _count }) => {
          return (
            <Link className="pr-2" key={id} href={`${protocol}://${domain}.${baseUrl}`}>
              <div className="flex justify-center space-x-4">
                <AvatarImage actor={actor} key={id} size={100} />
                <div className="flex flex-col space-y-2 ">
                  <h3 className="font-semibold uppercase text-xl">{domain}</h3>
                  <p className="text-2 line-clamp-3">{actor.bio}</p>
                  <p className="text-2">{_count.tenantMembers} membres • Privé</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
