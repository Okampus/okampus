import Link from 'next/link';

export type ILinkListProps = {
  className?: string;
  prefix?: string;
  suffix?: string;
  links: { href: string; label: string }[];
};

export default function ILinkList({ className = 'paragraph', links, prefix, suffix }: ILinkListProps) {
  const linksWithComma = [...links];
  const lastLink = linksWithComma.pop();

  if (!lastLink) return null;

  return (
    <div className={className}>
      {prefix ? `${prefix} ` : ''}
      {linksWithComma.map((link) => (
        <Link className="hover:underline" key={link.label} href={link.href}>
          {link.label},{' '}
        </Link>
      ))}
      <Link className="hover:underline" href={lastLink.href}>
        {lastLink.label}
      </Link>
      {suffix ? ` ${suffix}` : ''}
    </div>
  );
}
