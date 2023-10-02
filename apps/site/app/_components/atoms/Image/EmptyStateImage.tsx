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
    <div className="w-full flex justify-center items-center">
      <div className={clsx('w-full flex flex-col justify-center items-center max-w-[40rem]', className)}>
        {image}
        {title && <h2 className="text-0 text-3xl font-semibold text-center mt-6">{title}</h2>}
        {subtitle && <p className="text-2 text-base text-center">{subtitle}</p>}
        {cta && <div className="mt-6">{cta}</div>}
      </div>
    </div>
  );
}
