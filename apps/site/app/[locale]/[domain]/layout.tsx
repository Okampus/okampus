import prisma from '../../../database/prisma/db';

export async function generateStaticParams() {
  const tenantDomain = await prisma.tenant.findMany({ select: { domain: true } });
  return tenantDomain.map((tenant) => ({ domain: tenant.domain }));
}

type DomainLayoutProps = { children: React.ReactNode };
export default async function DomainLayout({ children }: DomainLayoutProps) {
  return <>{children}</>;
}
