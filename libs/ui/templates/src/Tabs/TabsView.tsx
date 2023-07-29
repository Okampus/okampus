/* eslint-disable no-lone-blocks */

import { ErrorPage } from '../ErrorPage';
import { TAB_PARAM } from '@okampus/shared/consts';
import { TabsList } from '@okampus/ui/molecules';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export type TabsViewProps<T> = {
  basePath: string;
  menus: { key: T; element: () => React.JSX.Element | null; label: React.ReactNode }[]; // TODO: context?
  topbarPrefix?: React.ReactNode;
  noMargin?: boolean;
};

export function TabsView<T extends string>({ basePath, menus, topbarPrefix }: TabsViewProps<T>) {
  const navigate = useNavigate();
  const params = useParams<{ [TAB_PARAM]: string }>();
  const defaultTab = menus[0].key;

  const [selectedTab, setSelectedTab] = useState<string>(defaultTab);

  useEffect(() => {
    const tab = params[TAB_PARAM] || defaultTab;
    setSelectedTab(tab);
  }, [defaultTab, params, menus]);

  const tabs = menus.map(({ key, element, label }) => {
    const onClick = () => navigate(`${basePath}/${key}`);
    return { key, element, label, onClick };
  });

  const currentTab = tabs.find((tab) => tab.key === selectedTab);
  return currentTab ? (
    <div className="flex flex-col h-full gap-8">
      <div className="flex gap-10 items-center">
        {topbarPrefix}
        <TabsList selected={selectedTab} tabClassName="text-lg" listClassName="shrink-0" tabs={tabs} />
      </div>
      <currentTab.element />
    </div>
  ) : (
    <ErrorPage error="404" />
  );
  /* <div className="w-full relative" style={{ aspectRatio: BANNER_ASPECT_RATIO }}>
        <DarkGradient>
          {actorImageEdit ? (
            <BannerEditor
              banner={{ ...banner, aspectRatio: BANNER_ASPECT_RATIO, name }}
              onChange={(file) => actorImageEdit(file, ActorImageType.Banner)}
            />
          ) : (
            <BannerImage aspectRatio={BANNER_ASPECT_RATIO} {...banner} name={name} className="absolute inset-0" />
          )}
        </DarkGradient>
        <div className="absolute bottom-4 px-view title lg-max:!text-5xl text-white line-clamp-1">{name}</div>
      </div> */
  /* <div className={clsx('px-view', isSmall ? 'pt-6' : 'pt-32')}>
        {/* <div className="flex flex-col gap-4">
          <div className="text-0 font-bold text-2xl">135</div>
          {details && <div className="text-0 mb-8">{details}</div>}
        </div>
        <span className="text-0 text-xl">
          <span className="font-bold">135</span> posts •<span className="font-bold">121K</span> subscribers •
          <span className="font-bold">1.2M</span> views
        </span>
        <TabsList
          color={color}
          tabClassName="text-lg"
          selected={selectedTab}
          tabs={tabs.map(({ key, label }) => ({ key, label, onClick: () => navigate(switchTabRoute(key)) }))}
        />
      </div> */
  /* <div className={clsx(isSmall ? 'absolute z-[90] left-40' : `${aspect} w-full`)}>
        <div className={clsx('h-full flex', isSmall ? 'flex-row items-center' : 'flex-col pt-[var(--topbar-height)]')}>
          <div className={clsx(isSmall ? 'items-center py-2' : 'items-end h-full py-3', 'flex gap-6 px-view')}>
            {actorImageEdit ? (
              <AvatarEditor
                avatar={{ ...avatarProps, className: 'relative' }}
                small={isSmall}
                onChange={(file) => actorImageEdit(file, ActorImageType.Avatar)}
              />
            ) : (
              <Avatar {...avatarProps} className="relative self-stretch" />
            )}
            <div
              className={clsx(
                'text-white z-10 flex w-full h-full',
                isSmall ? 'flex-row items-center gap-12' : 'flex-col py-3'
              )}
            >
              {!isSmall && (
                <Textfit
                  mode="multi"
                  style={{ height: `${(width / bannerRatio - 100) / 3}px` }}
                  className="font-extrabold leading-tight flex tracking-tighter pr-12"
                >
                  {name} {width / bannerRatio}
                </Textfit>
                // <motion.span
                //   layout
                //   transition={transition}
                //   className="font-extrabold leading-tight inline tracking-tighter line-clamp-1 pr-1"
                //   style={{
                //     fontSize: isSmall ? '1.5rem' : `${width / (3.5 * 5)}px`,
                //   }}
                // >
                //   {name}
                // </motion.span>
              )}
              <motion.div layout className={clsx('flex gap-item', isSmall ? 'flex-row items-center' : 'flex-col')}>
                {/* <motion.div
                  layout
                  transition={transition}
                  className={clsx(small && 'hidden', 'font-bold text-lg pl-1')}
                >
                  {details}
                </motion.div>
                {buttonList && (
                  <motion.div layout transition={transition} className="button-list scrollbar w-fit">
                    {buttonList(isSmall)}
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
          <div className={clsx('flex gap-2', !isSmall && 'px-view py-4')}>
            <TabsList
              color={color}
              tabClassName="text-lg"
              selected={selectedTab}
              tabs={tabs.map(({ key, label }) => ({ key, label, onClick: () => navigate(switchTabRoute(key)) }))}
            />
          </div>
        </div>
      </div> */
}
{
  /* //   <motion.div transition={transition} animate={{ height }} className="shrink-0">
    //     <motion.div
    //       layout
    //       transition={transition}
    //       className={clsx('relative flex flex-col overflow-hidden shrink-0 aspect-[3.5/1] pt-[var(--topbar-height)]')}
    //       ref={ref}
    //     >
    //       <LayoutGroup>
    //         <DarkGradient>
    //           {actorImageEdit ? (
    //             <BannerEditor
    //               banner={{ ...banner, name }}
    //               onChange={(file) => actorImageEdit(file, ActorImageType.Banner)}
    //             />
    //           ) : (
    //             <Banner {...banner} name={name} className="absolute inset-0" />
    //           )}
    //         </DarkGradient>
    //         <div
    //           className={clsx(
    //             small ? 'absolute top-0 left- items-center py-2' : 'items-end h-full py-3',
    //             'flex gap-6 px-view'
    //           )}
    //         >
    //           {actorImageEdit ? (
    //             <AvatarEditor
    //               avatar={{ ...avatarProps, className: 'relative' }}
    //               small={small}
    //               onChange={(file) => actorImageEdit(file, ActorImageType.Avatar)}
    //             />
    //           ) : (
    //             <Avatar {...avatarProps} className="relative self-stretch" />
    //           )}
    //           <div className={clsx('text-white z-10 flex', small ? 'flex-row items-center gap-12' : 'flex-col py-3')}>
    //             <motion.span
    //               layout
    //               transition={transition}
    //               className={clsx(
    //                 small ? 'text-3xl font-bold' : 'text-7xl font-extrabold leading-tight',
    //                 'inline tracking-tighter line-clamp-1 pr-1 align-top'
    //               )}
    //             >
    //               {name}
    //             </motion.span>
    //             <motion.div layout className={clsx('flex gap-item', small ? 'flex-row items-center' : 'flex-col')}>
    //               <motion.div
    //                 layout
    //                 transition={transition}
    //                 className={clsx(small && 'hidden', 'font-bold text-lg pl-1')}
    //               >
    //                 {details}
    //               </motion.div>
    //               {buttonList && (
    //                 <motion.div layout transition={transition} className="button-list scrollbar w-fit">
    //                   {buttonList(small)}
    //                 </motion.div>
    //               )}
    //             </motion.div>
    //           </div>
    //         </div>
    //       </LayoutGroup>
    //       {/* <LayoutGroup>
    //         <DarkGradient>
    //           {actorImageEdit ? (
    //             <BannerEditor
    //               banner={{ ...banner, name }}
    //               onChange={(file) => actorImageEdit(file, ActorImageType.Banner)}
    //             />
    //           ) : (
    //             <Banner {...banner} name={name} className="absolute inset-0" />
    //           )}
    //         </DarkGradient>
    //         <div className="shrink-0">
    //           <motion.div
    //             transition={transition}
    //             layout
    //             className={clsx('h-1/2 flex items-center', small ? 'items-center gap-4' : 'gap-8')}
    //           >
    //             {actorImageEdit ? (
    //               <AvatarEditor
    //                 avatar={{
    //                   ...avatar,
    //                   // size: small ? 28 : 90,
    //                   size: 'inherit',
    //                   name,
    //                   layout: true,
    //                   transition,
    //                   className: 'relative',
    //                 }}
    //                 small={small}
    //                 onChange={(file) => actorImageEdit(file, ActorImageType.Avatar)}
    //               />
    //             ) : (
    //               <Avatar
    //                 {...avatar}
    //                 name={name}
    //                 // size={small ? 28 : 90}
    //                 size="inherit"
    //                 layout={true}
    //                 transition={transition}
    //                 className="relative self-stretch"
    //               />
    //             )}
    //             <div className={clsx('text-white z-10 py-3 flex', small ? 'flex-row items-center gap-12' : 'flex-col')}>
    //               <motion.span
    //                 layout
    //                 transition={transition}
    //                 className={clsx(
    //                   small ? 'text-3xl font-bold' : 'text-7xl font-extrabold leading-tight',
    //                   'inline tracking-tighter line-clamp-1 pr-1 align-top'
    //                 )}
    //               >
    //                 {name}
    //               </motion.span>
    //               <motion.div layout className={clsx('flex gap-item', small ? 'flex-row items-center' : 'flex-col')}>
    //                 <motion.div
    //                   layout
    //                   transition={transition}
    //                   className={clsx(small && 'hidden', 'font-bold text-lg pl-1')}
    //                 >
    //                   {details}
    //                 </motion.div>
    //                 <motion.div layout transition={transition} className="button-list scrollbar w-fit">
    //                   {buttonList}
    //                 </motion.div>
    //               </motion.div>
    //             </div>
    //           </motion.div>
    //         </div>
    //       </LayoutGroup>
    //       <div className="z-20 flex gap-2 px-view my-[calc(var(--padding-view)/2)]">
    //         <TabsList
    //           color={color}
    //           tabClassName="text-lg"
    //           selected={selectedTab}
    //           tabs={tabs.map(({ key, label }) => ({ key, label, onClick: () => navigate(switchTabRoute(key)) }))}
    //         />
    //       </div>
    //     </motion.div>
    //   </motion.div> */
}
