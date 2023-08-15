'use client';

import AvatarImage from '../../../../components/atoms/Image/AvatarImage';
import TextInput from '../../../../components/molecules/Input/TextInput';
import ActionButton from '../../../../components/molecules/Button/ActionButton';

import { API_URL } from '../../../../context/consts';
import { meSlugAtom } from '../../../../context/global';
import { useGetTenantOidcInfoQuery, useUserLoginMutation } from '@okampus/shared/graphql';

import { ReactComponent as OkampusLogoLarge } from '@okampus/assets/svg/brands/okampus-large.svg';
import { ActionType } from '@okampus/shared/types';

import { NEXT_PAGE_COOKIE } from '@okampus/shared/consts';

import { IconArrowRight } from '@tabler/icons-react';

import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Cookies from 'universal-cookie';

export default function SigninPage() {
  const [, setMeSlug] = useAtom(meSlugAtom);
  const router = useRouter();
  const cookieStore = new Cookies();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { data } = useGetTenantOidcInfoQuery();
  const [login] = useUserLoginMutation({
    onCompleted: (data) => {
      if (data.login) {
        setMeSlug(data.login.user.individual.actor.slug);
        const next = cookieStore.get(NEXT_PAGE_COOKIE);
        cookieStore.remove(NEXT_PAGE_COOKIE);
        router.push(next === '/signin' ? '/' : next || '/');
      }
    },
  });

  const [showLogin, setShowLogin] = useState(false);
  // const { register, handleSubmit, watch, formState } = useForm<SigninForm>({ values: { username, password } });
  // const { errors } = formState;

  // const registered = register('username', { value: username });

  return (
    <div className="flex w-full h-full overflow-hidden">
      <div className="relative bg-main w-full h-full flex flex-col justify-center items-center overflow-scroll scrollbar">
        <div className="flex flex-col items-center py-12 overflow-y-auto scrollbar w-full">
          <div className="max-w-[30rem] w-full px-12 flex flex-col gap-8">
            <div className="text-0 flex flex-col items-start gap-8">
              <OkampusLogoLarge style={{ height: '4rem' }} />
              <h1 className="text-2xl text-left font-semibold text-0 tracking-tighter">Bienvenue 👋</h1>
            </div>

            <div className="flex flex-col gap-4">
              {data?.tenant.map(
                (tenant) =>
                  tenant.isOidcEnabled &&
                  tenant.oidcName && (
                    <ActionButton
                      key={tenant.id}
                      className="!h-[4.5rem] !text-xl gap-4"
                      action={{
                        type: ActionType.Action,
                        label: `Continuer avec ${tenant.oidcName}`,
                        iconOrSwitch: <AvatarImage actor={tenant.adminTeam?.actor} />,
                        linkOrActionOrMenu: `${API_URL}/auth/${tenant.oidcName}`,
                      }}
                    />
                  ),
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-1 before:h-[1px] before:flex-1 before:bg-gray-300 after:h-[1px] after:flex-1 after:bg-gray-300">
              OU
            </div>
            {showLogin ? (
              <>
                <div className="flex flex-col gap-4">
                  <TextInput
                    name="username"
                    label="Nom d'utilisateur"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                  <TextInput
                    name="password"
                    label="Mot de passe"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                <ActionButton
                  iconPosition="right"
                  action={{
                    iconOrSwitch: <IconArrowRight />,
                    label: 'Se connecter',
                    linkOrActionOrMenu: () => login({ variables: { dto: { username: username.trim(), password } } }),
                    type: ActionType.Action,
                  }}
                />
              </>
            ) : (
              <span className="add-button" onClick={() => setShowLogin(true)}>
                J&apos;ai un compte Okampus
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="xl-max:hidden bg-opposite w-full h-full relative" />
    </div>
  );
}
