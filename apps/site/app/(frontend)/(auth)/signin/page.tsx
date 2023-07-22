'use client';

import TextInput from '../../../../components/molecules/Input/TextInput';
import ActionButton from '../../../../components/molecules/Button/ActionButton';

import { meSlugAtom } from '../../../../context/global';

import { ReactComponent as OkampusLogoLarge } from '@okampus/assets/svg/brands/okampus-large.svg';
import { loginMutation } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';

import { useMutation } from '@apollo/client';

import { IconArrowRight } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const OAuthSrcLink =
  'https://media.discordapp.net/attachments/965927279643488297/1060235625623732244/logo-efrei-print-efrei-web.png';

export default function SigninPage() {
  const [, setMeSlug] = useAtom(meSlugAtom);
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // @ts-ignore - Type instantiation is excessively deep and possibly infinite.
  const [login] = useMutation(loginMutation, {
    onCompleted: (data) => {
      if (data.login) {
        setMeSlug(data.login.user.individual.actor.slug);
        const next = localStorage.getItem('next') ?? '/';
        localStorage.removeItem('next');
        router.push(next);
      }
    },
  });
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="flex w-full h-full overflow-hidden">
      <div className="relative bg-main w-full h-full flex flex-col justify-center items-center overflow-scroll scrollbar">
        <div className="flex flex-col items-center py-12 overflow-y-auto scrollbar w-full">
          <div className="max-w-[30rem] w-full px-12 flex flex-col gap-8">
            <div className="text-0 flex flex-col items-start gap-8">
              <OkampusLogoLarge style={{ height: '4rem' }} />
              <h1 className="text-2xl text-left font-semibold text-0 tracking-tighter">Bienvenue 👋</h1>
            </div>

            <ActionButton
              className="!h-[4.5rem] !text-xl gap-4"
              action={{
                type: ActionType.Action,
                label: 'Continuer avec myEfrei',
                iconOrSwitch: (
                  <Image
                    src={OAuthSrcLink}
                    className="w-9 h-9 pb-0.5"
                    alt="Logo Efrei"
                    width={30}
                    height={30}
                    unoptimized
                  />
                ),
                linkOrActionOrMenu: () => console.log('TODO: OAuth/OIDC login'),
              }}
            />
            <div className="flex items-center gap-1.5 text-xs text-1 before:h-[1px] before:flex-1 before:bg-gray-300 after:h-[1px] after:flex-1 after:bg-gray-300">
              OU
            </div>
            {showLogin ? (
              <>
                <div className="flex flex-col gap-4">
                  <TextInput
                    options={{ name: 'username', label: "Nom d'utilisateur" }}
                    value={username}
                    onChange={setUsername}
                  />
                  <TextInput
                    options={{ name: 'password', label: 'Mot de passe' }}
                    type="password"
                    value={password}
                    onChange={setPassword}
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
