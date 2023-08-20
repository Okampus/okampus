import clsx from 'clsx';

export type EmptyStateImageProps = {
  image: React.ReactNode;
  title?: string;
  subtitle?: string;
  cta?: React.ReactNode;
  className?: string;
};
export default function EmptyStateImage({ image, title, subtitle, cta, className = 'm-8' }: EmptyStateImageProps) {
  return (
    <div className={clsx('flex flex-col items-center justify-center max-w-2xl', className)}>
      {image}
      {title && <h2 className="text-0 text-2xl font-semibold text-center">{title}</h2>}
      {subtitle && <p className="text-2 text-sm text-center">{subtitle}</p>}
      {cta && <div className="mt-4">{cta}</div>}
    </div>
  );
}
