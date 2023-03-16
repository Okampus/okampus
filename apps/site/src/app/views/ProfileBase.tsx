import { ErrorPage } from './ErrorPage';

import { TAB_PARAM } from '@okampus/shared/consts';
import { ActorImageType } from '@okampus/shared/enums';

import { Avatar, Banner, GradientDark } from '@okampus/ui/atoms';
import { AvatarEditor, BannerEditor, TabsList } from '@okampus/ui/molecules';

import { clsx } from 'clsx';
import { motion, LayoutGroup } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMeasure } from 'react-use';

import type { AvatarProps, BannerProps } from '@okampus/ui/atoms';

export type ProfileBaseProps<T> = {
  switchTabRoute: (tab: T) => string;
  tabs: { key: T; element: React.ReactNode; label: React.ReactNode }[];
  actorImageEdit?: (file: File | null, actorImageType: ActorImageType) => void;
  avatar: Partial<AvatarProps> & { rounded: number };
  banner?: BannerProps;
  color: string;
  name: string;
  details?: React.ReactNode;
  buttonList?: React.ReactNode;
};

const transitionDuration = 0.3;
const transition = { duration: transitionDuration, ease: 'easeInOut' };

export function ProfileBase<T extends string>({
  switchTabRoute,
  tabs,
  actorImageEdit,
  avatar,
  banner,
  color,
  name,
  details,
  buttonList,
}: ProfileBaseProps<T>) {
  const [ref, { height }] = useMeasure<HTMLDivElement>();
  const navigate = useNavigate();
  const params = useParams<{ [TAB_PARAM]: string }>();
  const defaultTab = tabs[0].key;

  const [small, setSmall] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>(defaultTab);

  useEffect(() => {
    const tab = params[TAB_PARAM] || defaultTab;
    setSmall(tab !== defaultTab);
    setSelectedTab(tab);
  }, [defaultTab, params, tabs]);

  const currentTab = tabs.find((tab) => tab.key === selectedTab);
  return currentTab ? (
    <div className="relative flex flex-col h-full">
      <motion.div
        transition={transition}
        initial={{ height: small ? '22rem' : '34rem' }}
        animate={{ height }}
        className="shrink-0"
      >
        <motion.div
          layout
          transition={transition}
          className={clsx('relative flex flex-col overflow-hidden shrink-0')}
          ref={ref}
        >
          <LayoutGroup>
            <GradientDark>
              {actorImageEdit ? (
                <BannerEditor
                  banner={{ ...banner, name }}
                  onChange={(file) => actorImageEdit(file, ActorImageType.Banner)}
                />
              ) : (
                <Banner {...banner} name={name} className="absolute inset-0" />
              )}
            </GradientDark>
            <div className="shrink-0">
              <motion.div
                transition={transition}
                layout
                className={clsx('flex items-end p-view-topbar', small ? 'items-center gap-4' : 'gap-8')}
              >
                {actorImageEdit ? (
                  <AvatarEditor
                    avatar={{
                      ...avatar,
                      size: small ? 28 : 90,
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
                    size={small ? 28 : 90}
                    layout={true}
                    transition={transition}
                    className="relative"
                  />
                )}
                <div className={clsx('text-white z-10 py-3 flex', small ? 'flex-row items-center gap-12' : 'flex-col')}>
                  <motion.span
                    layout
                    transition={transition}
                    className={clsx(
                      small ? 'text-3xl font-bold' : 'text-7xl font-extrabold leading-tight',
                      'inline font-heading tracking-tighter line-clamp-1 pr-1 align-top'
                    )}
                  >
                    {name}
                  </motion.span>
                  <motion.div layout className={clsx('flex gap-item', small ? 'flex-row items-center' : 'flex-col')}>
                    <motion.div
                      layout
                      transition={transition}
                      className={clsx(small && 'hidden', 'font-title font-bold text-lg pl-1')}
                    >
                      {details}
                    </motion.div>
                    <motion.div layout transition={transition} className="button-list scrollbar w-fit">
                      {buttonList}
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </LayoutGroup>
          <div className="z-20 px-view my-2">
            <TabsList
              color={color}
              selected={selectedTab}
              tabClassName="text-lg"
              tabs={tabs.map(({ key, label }) => ({ key, label, onClick: () => navigate(switchTabRoute(key)) }))}
            />
          </div>
        </motion.div>
      </motion.div>
      <div className="relative w-full h-full">{currentTab.element}</div>
    </div>
  ) : (
    <ErrorPage error="404" />
  );
}
