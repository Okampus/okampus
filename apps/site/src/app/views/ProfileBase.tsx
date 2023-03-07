import { Avatar, Banner, GradientDark, GradientTransparent } from '@okampus/ui/atoms';
import { AvatarEditor, BannerEditor } from '@okampus/ui/molecules';
import { ActorImageType } from '@okampus/shared/enums';
import { clsx } from 'clsx';
import { motion, LayoutGroup } from 'framer-motion';
import { useMeasure } from 'react-use';

import type { AvatarProps, BannerProps } from '@okampus/ui/atoms';

export type ProfileBaseProps = {
  color: string;
  small?: boolean;
  avatar: Partial<AvatarProps> & { rounded: number };
  actorImageEdit?: (file: File | null, actorImageType: ActorImageType) => void;
  banner?: BannerProps;
  type: string;
  name: string;
  details?: React.ReactNode;
  buttonList?: React.ReactNode;
  children: React.ReactNode;
};

const transitionDuration = 0.35;
const transition = { duration: transitionDuration, ease: 'easeInOut' };
const buttonListPadding = 32;

export function ProfileBase({
  color,
  small,
  avatar,
  actorImageEdit,
  banner,
  type,
  name,
  details,
  buttonList,
  children,
}: ProfileBaseProps) {
  const [ref, { height }] = useMeasure<HTMLDivElement>();
  const [refButtonList, { height: buttonListHeight }] = useMeasure<HTMLDivElement>();

  const styleBig = {
    ...(details ? { marginBottom: '0.25rem' } : {}),
    lineHeight: '125%',
  };

  // TODO: Very ugly hack to get correct height animations with complex flex behavior & framer layout animations
  // Please fix this
  return (
    <div className="relative flex flex-col">
      <div
        className="absolute top-0 left-0 w-full overflow-hidden"
        style={{
          height: height || (small ? '8rem' : '19rem'),
          transition: `height ${small ? transitionDuration : transitionDuration - 0.1}s ease-in-out`,
        }}
      >
        <GradientDark className="min-h-full">
          {actorImageEdit ? (
            <BannerEditor
              banner={{ ...banner, name }}
              onChange={(file) => actorImageEdit(file, ActorImageType.Banner)}
            />
          ) : (
            <Banner {...banner} name={name} className="absolute inset-0" />
          )}
        </GradientDark>
      </div>
      <motion.div
        transition={transition}
        className={clsx('relative flex', small ? 'flex-row items-center' : 'flex-col')}
        style={{ maxHeight: small ? '8rem' : '19rem', transition: `max-height ${transitionDuration}s ease-in-out` }}
        initial={{ height: '100%' }}
        animate={{ height }}
      >
        <LayoutGroup>
          <div ref={ref} className="shrink-0">
            <motion.div
              transition={transition}
              layout
              className={clsx('flex items-end', small ? 'items-center gap-4 p-view-inner' : 'items-end gap-8 p-view')}
            >
              {actorImageEdit ? (
                <AvatarEditor
                  avatar={{
                    ...avatar,
                    size: small ? 24 : 90,
                    name,
                    layout: true,
                    transition,
                    className: 'relative',
                  }}
                  small={small}
                  onChange={(file) => actorImageEdit(file, ActorImageType.Avatar)}
                />
              ) : (
                <Avatar
                  {...avatar}
                  name={name}
                  size={small ? 24 : 90}
                  layout={true}
                  transition={transition}
                  className="relative"
                />
              )}
              <div className="text-white z-10 py-3">
                <motion.div
                  transition={transition}
                  layout
                  className={clsx(small && 'hidden', 'font-title font-bold text-lg')}
                >
                  {type}
                </motion.div>
                <motion.span
                  layout
                  className={clsx(
                    small ? 'text-3xl font-semibold' : 'text-8xl font-bold',
                    'inline font-heading tracking-tighter line-clamp-1 pr-1 align-top'
                  )}
                  style={small ? {} : styleBig}
                  transition={transition}
                >
                  {name}
                </motion.span>
                <motion.div transition={transition} layout className={clsx(small ? 'hidden' : 'block', 'font-title')}>
                  {details}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </LayoutGroup>
        <motion.div
          layout
          transition={transition}
          className="relative z-10 w-full px-view"
          style={{ paddingTop: buttonListPadding, paddingBottom: buttonListPadding }}
          ref={refButtonList}
        >
          <div className="button-list scrollbar">{buttonList}</div>
        </motion.div>
      </motion.div>
      <div className="relative">
        <GradientTransparent className="absolute top-0 left-0 w-full h-72">
          <div className="absolute inset-0" style={{ backgroundColor: color }} />
        </GradientTransparent>
        <motion.div
          className="relative w-full"
          style={{ marginTop: buttonList && !small ? buttonListHeight + 2 * buttonListPadding : buttonListPadding }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
