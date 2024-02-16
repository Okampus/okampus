import { CaretLeft } from '@phosphor-icons/react';
import Link from 'next/link';

export type BreadcrumbLinkProps = { href: string; children: React.ReactNode };

export default function BreadcrumbLink({ href, children }: BreadcrumbLinkProps) {
  return (
    <Link href={href} className="text-[var(--info)]">
      <CaretLeft className="w-4 h-4" />
      <span className="ml-2">{children}</span>
    </Link>
  );
}
