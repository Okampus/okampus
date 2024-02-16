import { baseUrl } from '../../../../config';

import prisma from '../../../../database/prisma/db';

import OrSeparator from '../../../_components/atoms/Decoration/OrSeparator';
import AvatarImage from '../../../_components/atoms/Image/AvatarImage';
import Button from '../../../_components/molecules/Button/Button';

import SigninForm from '../../../_views/Form/SigninForm';

import { tenantWithOidc } from '../../../../types/prisma/Tenant/tenant-oidc';

import { ReactComponent as OkampusLogoLarge } from '@okampus/assets/svg/brands/okampus.svg';

import { ActionType } from '@okampus/shared/enums';

import clsx from 'clsx';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import type { DomainParams } from '../../../params.type';
import type { TenantWithOidc } from '../../../../types/prisma/Tenant/tenant-oidc';

export type TenantOidcButtonProps = { tenant: TenantWithOidc; className: string };
function TenantOidcButton({ tenant, className }: TenantOidcButtonProps) {
  if (!tenant.oidcName || !tenant.isOidcEnabled) return null;
  const action = `${baseUrl}/auth/oidc/${tenant.oidcName}`;
  return (
    <Button type={ActionType.Action} action={action} className={clsx(className, '!h-[4.5rem] !text-xl')}>
      <AvatarImage actor={tenant.actor} />
      Continuer avec {tenant.actor.name}
    </Button>
  );
}

export default async function TenantSigninPage({ params }: DomainParams) {
  const t = await getTranslations();

  const tenantNameByDomain = await prisma.tenant.findFirst({
    where: { domain: params.domain },
    select: tenantWithOidc.select,
  });

  if (!tenantNameByDomain) notFound();

  return (
    <div className="flex w-full h-full overflow-hidden">
      <div className="relative bg-main w-full h-full flex flex-col justify-center items-center overflow-scroll scrollbar">
        <div className="flex flex-col items-center py-12 overflow-y-auto scrollbar w-full">
          <div className="max-w-[30rem] w-full px-12">
            <div className="text-0 flex flex-col items-start gap-8 mb-12">
              <OkampusLogoLarge style={{ height: '4rem' }} />
              <h1 className="text-2xl text-left font-semibold text-0">{t('Home.Welcome')} 👋</h1>
            </div>
            {tenantNameByDomain.oidcName && tenantNameByDomain.isOidcEnabled && (
              <>
                <TenantOidcButton tenant={tenantNameByDomain} className="mb-6" />
                <OrSeparator />
              </>
            )}
            <SigninForm />
          </div>
        </div>
      </div>
      <div className="xl-max:hidden bg-[var(--bg-opposite)] w-full h-full relative" />
    </div>
  );
}
