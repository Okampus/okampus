import { getLink } from '#site/app/utils/get-link';

import { clsx } from 'clsx';
import { SelectMenu, SelectMenuProps } from '@okampus/ui/molecules';
import { Menu } from '#site/app/menus';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { NavigationContext, useCurrentContext } from '@okampus/ui/hooks';

export type SidebarMenuLinkProps = {
  icon: Menu['icon'];
  label: Menu['label'];
  link: Menu['link'];
  isSubmenu: boolean;
  onClick?: () => void;
  orgSlug?: string;
  className?: string;
};

export function SidebarMenuLink({ icon, label, link, onClick, isSubmenu, orgSlug, className }: SidebarMenuLinkProps) {
  return (
    // TODO: this should be refreshed quicker just after the subspace changes (to avoid error getLink calls)
    <Link
      to={getLink(link, { orgSlug })}
      className={clsx('flex items-center gap-4 rounded-lg', className)}
      onClick={() => onClick?.()}
    >
      {icon && icon({ className: 'lg:w-7 w-8' })}
      {isSubmenu ? <h3 className="lg-max:hidden">{label}</h3> : <h2 className="lg-max:hidden">{label}</h2>}
    </Link>
  );
}

export type SidebarMenuProps = {
  idx: number;
  menu: Menu;
};

export function SidebarMenu({ menu, idx }: SidebarMenuProps) {
  const [{ org }] = useCurrentContext();
  const { selected } = useContext(NavigationContext);

  const items: SelectMenuProps<string>['items'] =
    menu.sub?.map?.((subMenu, subIdx) => {
      return {
        element: (
          <SidebarMenuLink
            icon={subMenu.icon}
            // onClick={() => setSelected({ subspace: selected.subspace, menu: idx, subMenu: subIdx })}
            isSubmenu={true}
            label={subMenu.label}
            link={subMenu.link}
            orgSlug={org?.actor?.slug}
            key={subIdx}
            className={clsx('lg:px-4 lg:py-2 lg-max:p-2', selected.subMenu === subIdx && 'bg-active')}
          />
        ),
        value: subMenu.link,
      };
    }) ?? [];

  return items.length > 0 ? (
    <SelectMenu
      items={items}
      placeholder={
        <SidebarMenuLink
          icon={menu.icon}
          // onClick={() => setSelected({ menu: idx, subMenu: 0 })}
          isSubmenu={false}
          label={menu.label}
          link={menu.link}
          orgSlug={org?.actor?.slug}
        />
      }
      // onClick={() => setSelected({ menu: idx, subMenu: 0 })}
      dropdown={null}
      fullWidth={true}
      isContentAbsolute={false}
      showSelected={false}
      isControlled={true}
      open={selected.menu === idx}
      placeholderClassName="lg:px-4 lg:py-2 lg-max:p-2"
      contentClassName={clsx('py-0', selected.menu === idx ? 'text-0' : 'text-2')}
      itemClassName="p-0"
      placeholderBackgroundClass={selected.menu === idx ? 'text-0 bg-active' : 'text-2 hoverable'}
    />
  ) : (
    <motion.div whileTap={{ scale: 0.97 }}>
      <SidebarMenuLink
        icon={menu.icon}
        // onClick={() => setSelected({ menu: idx, subMenu: 0 })}
        isSubmenu={false}
        label={menu.label}
        link={menu.link}
        orgSlug={org?.actor?.slug}
        className={clsx('lg:px-4 lg:py-2 lg-max:p-2', selected.menu === idx ? 'text-0 bg-active' : 'text-2 hoverable')}
      />
    </motion.div>
  );

  // <Link
  //   className="active:scale-[97%]"
  //   to={getLink(menu.link, { orgSlug: org?.actor?.slug })}
  //   onDragEnd={(event) => deactivateLink(event.target as HTMLElement)}
  // >
  //   <span
  //     title={menu.tip}
  //     className={clsx(
  //       'hoverable',
  //       idx === selected.menu ? 'bg-active text-1' : 'cursor-pointer text-2 opacity-90',
  //       'cursor-pointer py-3 px-3 rounded-lg flex gap-4 items-center'
  //     )}
  //     onClick={() => setSelected({ menu: idx, subMenu: 0 })}
  //   >
  //     {menu.icon && menu.icon({ className: 'lg-max:h-7 h-6' })}
  //     <h5 className="lg-max:hidden">{menu.label}</h5>
  //   </span>
  // </Link>
  // {menu?.sub && (
  //   <ul className={clsx('accordeon flex flex-col px-2', idx === selected.menu ? 'active py-2' : '')}>
  //     {Object.entries(menu.sub).map(([subRoute, subMenu], subIdx) => (
  //       <Link to={getLink(subMenu.link, { orgSlug: org?.actor?.slug })} key={subRoute}>
  //         <span
  //           key={subRoute}
  //           title={subMenu.tip}
  //           className={clsx(
  //             'child transition-all',
  //             'flex items-center justify-start cursor-pointer text-2 gap-4 overflow-hidden rounded-lg px-2 text-sm [&.active]:text-orange-400 [&.active]:bg-orange-300/30 [&.active]:cursor-default',
  //             subIdx === selected.subMenu && 'active'
  //           )}
  //           onClick={() => setSelected({ menu: idx, subMenu: subIdx })}
  //         >
  //           {subMenu.icon && subMenu.icon({ className: 'h-6' })}
  //           <h5 className="text-sm lg-max:hidden">{subMenu.label}</h5>
  //           {/* <slot name={subRoute} /> */}
  //           {/* <i class={subMenu.icon} /> */}
  //         </span>
  //       </Link>
  //     ))}
  //   </ul>
  // )}
  // </div>
}
