import { ReactComponent as LogoutIcon } from '@okampus/assets/svg/icons/logout.svg';
import { ReactComponent as SettingsIcon } from '@okampus/assets/svg/icons/material/outlined/settings.svg';

import { ME_ROUTE, WELCOME_ROUTE } from '@okampus/shared/consts';
import { logoutMutation } from '@okampus/shared/graphql';

import { Popover, PopoverTrigger, AvatarImage, PopoverContent } from '@okampus/ui/atoms';
import { NavigationContext, useCurrentUser } from '@okampus/ui/hooks';
import { DarkModeToggle, MenuList } from '@okampus/ui/molecules';
import { getAvatar } from '@okampus/ui/utils';

import { apolloClient } from '#site/app/providers/apollo.client';
import { useMutation } from '@apollo/client';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export type TopbarUserProps = { theme: 'light' | 'dark'; setTheme: (theme: 'light' | 'dark') => void };
export function TopbarUser({ theme, setTheme }: TopbarUserProps) {
  const { setTenant, setIsLoggedIn } = useContext(NavigationContext);

  const { currentUser } = useCurrentUser();

  const navigate = useNavigate();

  const onCompleted = () => (setTenant(null), setIsLoggedIn(false), apolloClient.clearStore(), navigate(WELCOME_ROUTE));
  const [logout] = useMutation(logoutMutation, { onCompleted });

  const sections = [
    {
      actions: [
        { label: 'Gérer mon profil', iconOrSwitch: <SettingsIcon />, linkOrActionOrMenu: ME_ROUTE },
        {
          active: theme === 'dark',
          label: 'Mode sombre',
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          iconOrSwitch: (active: boolean) => <DarkModeToggle checked={active} onChange={() => {}} />,
          linkOrActionOrMenu: () => {
            theme === 'dark' ? setTheme('light') : setTheme('dark');
          },
        },
        { label: 'Se déconnecter', iconOrSwitch: <LogoutIcon className="p-0.5" />, linkOrActionOrMenu: logout },
      ],
    },
  ];

  const avatar = getAvatar(currentUser?.individualById?.actor?.actorImages);
  const name = currentUser?.individualById?.actor?.name;

  return (
    <Popover forcePlacement={true} placement="bottom-end" placementOffset={20}>
      <PopoverTrigger>
        <AvatarImage name={name} src={avatar} size={18} type="user" />
      </PopoverTrigger>
      <PopoverContent popoverClassName="!p-0">
        <MenuList
          header={
            <div className="mb-2 pb-2 border-b border-color-2">
              <div className="flex items-center gap-4 px-8 py-5 bg-0 -m-2">
                <AvatarImage src={avatar} name={name} size={22} type="user" />
                <div>
                  <div className="text-1 text-xl font-bold">{name}</div>
                  <div className="text-2">{currentUser?.individualById?.actor?.email}</div>
                </div>
              </div>
            </div>
          }
          sections={sections}
          footer={
            <div className="text-0 mt-2 border-t border-color-2 bg-0">
              <div className="text-xs py-3 text-center">RGPD • Conditions d'utilisation</div>
            </div>
          }
        />
      </PopoverContent>
    </Popover>
  );
}
