import ErrorToast from '../../_components/providers/ErrorToast';
import prisma from '../../../database/prisma/db';
import { DomainParams } from '../../params.type';
import { unstable_setRequestLocale } from 'next-intl/server';

export async function generateStaticParams() {
  const tenantDomain = await prisma.tenant.findMany({ select: { domain: true } });
  return tenantDomain.map((tenant) => ({ domain: tenant.domain }));
}

type DomainLayoutProps = { children: React.ReactNode } & DomainParams;
export default async function DomainLayout({ children, params }: DomainLayoutProps) {
  unstable_setRequestLocale(params.locale);

  return (
    <>
      {children}
      <ErrorToast />
    </>
  );
}
