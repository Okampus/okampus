import { getLink } from '#site/app/utils/get-link';

import { SelectMenu } from '@okampus/ui/molecules';
import { NavigationContext, useCurrentContext } from '@okampus/ui/hooks';

import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

import type { Menu } from '#site/app/menus';

export type SidebarLinkProps = {
  menu: Menu;
  link: Menu['link'];
  selected: boolean;
};

const iconProps = { style: { width: '2rem' } };
const sidebarLinkClass = 'p-2 text-hover flex items-center gap-3 rounded-lg lg:justify-start justify-center';

export function SidebarLink({ menu, selected, link }: SidebarLinkProps) {
  const icon = selected && menu.iconSelected ? menu.iconSelected : menu.icon;
  return (
    // TODO: this should be refreshed quicker just after the subspace changes (to avoid error getLink calls)
    <motion.div whileTap={{ scale: 0.97 }} className="w-full">
      <Link to={link} className={clsx(selected ? 'text-0' : 'text-2', sidebarLinkClass)}>
        {icon && icon(iconProps)}
        <div className="lg-max:hidden font-title font-semibold tracking-wide text-[0.95rem]">{menu.label}</div>
      </Link>
    </motion.div>
  );
}

export type SidebarMenuProps = {
  idx: number;
  menu: Menu;
};

export function SidebarMenu({ menu, idx }: SidebarMenuProps) {
  const [{ org, user }] = useCurrentContext();
  const { selected, setSelected } = useContext(NavigationContext);

  const linkSlugs = { orgSlug: org?.actor?.slug, userSlug: user?.actor?.slug };
  const menuLink = getLink(menu.link, linkSlugs);

  if (!menu.sub || menu.sub.length === 0)
    return <SidebarLink link={menuLink} menu={menu} selected={selected.menu === idx} />;

  const getItem = (subMenu: Menu, subIdx: number) => {
    const link = getLink(subMenu.link, linkSlugs);
    console.log('link', link, 'selected', selected.subMenu === subIdx);
    return {
      element: <SidebarLink link={link} menu={subMenu} selected={selected.subMenu === subIdx} />,
      value: link,
    };
  };

  return (
    <SelectMenu
      onClick={() => setSelected({ subSpace: selected.subSpace, menu: idx, subMenu: 0 })}
      items={menu.sub.map(getItem)}
      placeholder={<SidebarLink link={menuLink} menu={menu} selected={selected.menu === idx} />}
      dropdown={null}
      fullWidth={true}
      isContentAbsolute={false}
      showSelected={false}
      isControlled={true}
      open={selected.menu === idx}
      placeholderClassName={'!p-0'}
      contentClassName={'bg-2 !p-0'}
      itemClassName="p-0"
    />
  );
}
