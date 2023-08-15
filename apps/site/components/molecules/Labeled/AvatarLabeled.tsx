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
}: AvatarLabeledProps) {
  const align = content ? 'items-start' : 'items-center';
  const wrapperClass = clsx(
    'flex',
    className,
    content ? 'gap-4' : small ? 'gap-2 text-sm' : 'gap-2.5 text-base',
    align,
  );
  const labelClass = clsx('font-medium', small ? 'text-sm' : 'text-base');
  const avatarElement = (
    <AvatarImage
      src={avatar}
      name={name}
      size={avatarSize ?? (content ? 16 : small ? 8 : 12)}
      className={clsx(content && 'my-0.5')}
      type={type}
      website={website}
    />
  );

  if (!name && !avatar)
    return (
      <span className={wrapperClass}>
        {avatarElement}
        <div className="flex flex-col gap-1">
          <Skeleton className={skeletonLabelClassName || 'w-44 h-6'} />
          {content && <Skeleton className={skeletonContentClassName || 'w-32 h-6'} />}
        </div>
      </span>
    );

  return wrapper ? (
    full ? (
      <>
        {wrapper({
          className: 'w-full',
          children: (
            <span className={wrapperClass}>
              {avatarElement}
              <div className="flex flex-col">
                <div className={labelClass}>{label ?? name}</div>
                {content && <div>{content}</div>}
              </div>
            </span>
          ),
        })}
      </>
    ) : (
      <span className={wrapperClass}>
        {wrapper({ children: avatarElement })}
        <div className="flex flex-col">
          <div className={labelClass}>{wrapper({ children: label ?? name })}</div>
          {content && <div>{content}</div>}
        </div>
      </span>
    )
  ) : (
    <span className={wrapperClass}>
      {avatarElement}
      <div className="flex flex-col">
        <div className={labelClass}>{label ?? name}</div>
        {content && <div>{content}</div>}
      </div>
    </span>
  );
}
