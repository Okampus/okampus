import { getLink } from '#site/app/utils/get-link';

import { SelectMenu } from '@okampus/ui/molecules';
import { NavigationContext, useCurrentContext } from '@okampus/ui/hooks';

import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

import type { Menu } from '#site/app/menus';
import type { SelectMenuProps } from '@okampus/ui/molecules';

export type SidebarMenuLinkProps = {
  icon: Menu['icon'];
  label: Menu['label'];
  link: Menu['link'];
  isSubmenu: boolean;
  onClick?: () => void;
  orgSlug?: string;
  className?: string;
};

export function SidebarMenuLink({ icon, label, link, isSubmenu, orgSlug, className }: SidebarMenuLinkProps) {
  return (
    // TODO: this should be refreshed quicker just after the subspace changes (to avoid error getLink calls)
    <Link to={getLink(link, { orgSlug })} className={clsx('flex items-center gap-4 rounded-lg', className)}>
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
  const { selected, setSelected } = useContext(NavigationContext);

  const items: SelectMenuProps<string>['items'] =
    menu.sub?.map?.((subMenu, subIdx) => {
      return {
        element: (
          <SidebarMenuLink
            icon={subMenu.icon}
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
      onClick={() => setSelected({ subSpace: selected.subSpace, menu: idx, subMenu: 0 })}
      items={items}
      placeholder={
        <SidebarMenuLink
          icon={menu.icon}
          isSubmenu={false}
          label={menu.label}
          link={menu.link}
          orgSlug={org?.actor?.slug}
        />
      }
      dropdown={null}
      fullWidth={true}
      isContentAbsolute={false}
      showSelected={false}
      isControlled={true}
      open={selected.menu === idx}
      placeholderClassName="lg:px-4 lg:py-2 lg-max:p-2"
      contentClassName={clsx('py-0 mt-2', selected.menu === idx ? 'text-0' : 'text-2')}
      itemClassName="p-0"
      placeholderBackgroundClass={selected.menu === idx ? 'text-0 bg-active' : 'text-2 hoverable'}
    />
  ) : (
    <motion.div whileTap={{ scale: 0.97 }}>
      <SidebarMenuLink
        icon={menu.icon}
        isSubmenu={false}
        label={menu.label}
        link={menu.link}
        orgSlug={org?.actor?.slug}
        className={clsx('lg:px-4 lg:py-2 lg-max:p-2', selected.menu === idx ? 'text-0 bg-active' : 'text-2 hoverable')}
      />
    </motion.div>
  );
}
