'use client';

import TabBarItem from './TabBarItem';
import AvatarImage from '../../atoms/Image/AvatarImage';
import DarkModeToggle from '../../../_views/DarkModeToggle';

// import { useLocale } from '../../../_hooks/context/useLocale';
import { useMe } from '../../../_hooks/context/useMe';
import { useTenant } from '../../../_hooks/context/useTenant';
import { useTheme } from '../../../_hooks/context/useTheme';

export default function TabBarBottom() {
  const { data: me } = useMe();
  const { data: tenant } = useTenant();

  // const [locale, setLocale] = useLocale();
  const [theme, toggleTheme] = useTheme();

  // const toggleLocale = () => setLocale(locale === 'fr-FR' ? 'en-US' : 'fr-FR');
  // const flagUrl = `https://purecatamphetamine.github.io/country-flag-icons/3x2/${locale.slice(-2)}.svg`;
  // const localeFlag = { base: <img alt={locale} className="w-7 h-7 rounded-lg" src={flagUrl} /> };

  const tenantRegex = '(?:/tenant|/manage/tenant)';
  const tenantAvatar = { base: <AvatarImage size={32} actor={tenant.actor} /> };

  const toggleIcon = { base: <DarkModeToggle className="w-8 h-8" /> };
  const userAvatar = { base: <AvatarImage size={32} actor={me.actor} /> };

  const isCustomIcon = true;
  const links = [
    { icons: tenantAvatar, isCustomIcon, regex: tenantRegex, label: tenant.actor.name, action: '/tenant' },
    { icons: userAvatar, isCustomIcon, regex: '/me', label: 'Mon profil', action: '/me' },
    // { icons: localeFlag, label: 'Langue', action: toggleLocale },
  ];

  const toggleLink = { icons: toggleIcon, label: theme === 'dark' ? 'Mode sombre' : 'Mode clair', action: toggleTheme };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 md-max:hidden">
        {links.map((props, idx) => (
          <TabBarItem key={idx} {...props} />
        ))}
      </div>
      <TabBarItem {...toggleLink} />
    </div>
  );
}
