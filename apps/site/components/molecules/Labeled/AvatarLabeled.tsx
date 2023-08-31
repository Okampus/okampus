import AvatarImage from '../../atoms/Image/AvatarImage';
import Skeleton from '../../atoms/Skeleton/Skeleton';
import clsx from 'clsx';
import type { AvatarImageProps } from '../../atoms/Image/AvatarImage';

export type AvatarWrapperProps = { children: React.ReactNode; className?: string };

export type AvatarLabeledProps = {
  avatar?: string;
  avatarSize?: number;
  type: AvatarImageProps['type'];
  full?: boolean;
  name?: string;
  website?: string;
  small?: boolean;
  label?: React.ReactNode;
  content?: React.ReactNode;
  wrapper?: ({ children, className }: AvatarWrapperProps) => NonNullable<React.ReactNode>;
  skeletonLabelClassName?: string;
  skeletonContentClassName?: string;
  className?: string;
  labelClassName?: string;
  contentClassName?: string;
};

export default function AvatarLabeled({
  avatar,
  avatarSize,
  type,
  full,
  name,
  website,
  small,
  label,
  content,
  wrapper,
  skeletonLabelClassName,
  skeletonContentClassName,
  className,
  labelClassName,
  contentClassName,
}: AvatarLabeledProps) {
  const align = content ? 'items-start' : 'items-center';
  const avatarClass = clsx('flex', className, small ? 'gap-2' : 'gap-2.5', align);
  const labelClass = clsx('font-medium leading-5', small ? 'text-sm' : 'text-base', labelClassName);
  const contentClass = clsx('text-sm', contentClassName);

  const wrapperClass = 'text-0 flex flex-col items-start';

  const avatarElement = (
    <AvatarImage
      src={avatar}
      name={name}
      size={avatarSize ?? (small ? 14 : 28)}
      className={clsx(content && 'my-0.5 shrink-0')}
      type={type}
      website={website}
    />
  );

  if (!name && !avatar)
    return (
      <span className={avatarClass}>
        {avatarElement}
        <div className={clsx(wrapperClass, 'gap-1')}>
          <Skeleton className={skeletonLabelClassName ?? 'w-44 h-6'} />
          {content && <Skeleton className={skeletonContentClassName ?? 'w-32 h-6'} />}
        </div>
      </span>
    );

  if (wrapper) {
    if (full)
      return wrapper({
        className: 'w-full',
        children: (
          <span className={avatarClass}>
            {avatarElement}
            <div className={wrapperClass}>
              <div className={labelClass}>{label ?? name}</div>
              {content && <div className={contentClass}>{content}</div>}
            </div>
          </span>
        ),
      });

    return (
      <span className={avatarClass}>
        {wrapper({ children: avatarElement })}
        <div className={wrapperClass}>
          <div className={labelClass}>{wrapper({ children: label ?? name })}</div>
          {content && <div className={contentClass}>{content}</div>}
        </div>
      </span>
    );
  }

  return (
    <span className={avatarClass}>
      {avatarElement}
      <div className={wrapperClass}>
        <div className={labelClass}>{label ?? name}</div>
        {content && <div className={contentClass}>{content}</div>}
      </div>
    </span>
  );
}
