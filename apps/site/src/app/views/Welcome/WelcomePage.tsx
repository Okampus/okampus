import { ReactComponent as ArrowDownRightIcon } from '@okampus/assets/svg/icons/arrow-down-right.svg';
import { ReactComponent as ArrowRightIcon } from '@okampus/assets/svg/icons/arrow-right-alt.svg';

import { loginMutation } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';

import { NavigationContext, useCurrentUser } from '@okampus/ui/hooks';
import { ActionButton, TextInput } from '@okampus/ui/molecules';

import { useMutation } from '@apollo/client';

import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { UserMeInfo } from '@okampus/shared/graphql';

const OAuthSrcLink =
  'https://media.discordapp.net/attachments/965927279643488297/1060235625623732244/logo-efrei-print-efrei-web.png';

export function WelcomePage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { isLoggedIn, setIsLoggedIn, setTenant } = useContext(NavigationContext);

  const { currentUser, error } = useCurrentUser();
  const setMe = (data: UserMeInfo) => (
    setIsLoggedIn(true), setTenant(data.tenant), navigate(localStorage.getItem('next') || '/', { replace: true })
  );

  useEffect(() => {
    if (currentUser) setMe(currentUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    if (isLoggedIn) navigate(localStorage.getItem('next') || '/', { replace: true });
  }, [isLoggedIn, navigate]);

  const [login, { loading }] = useMutation(loginMutation, { onCompleted: (data) => data.login && setMe(data.login) });
  if (loading || (!error && !currentUser)) return null;

  return (
    <div className="flex w-full h-full overflow-hidden">
      <div className="relative bg-main w-full h-full flex flex-col tall:justify-center items-center overflow-scroll scrollbar">
        <div className="w-96 flex flex-col py-10">
          {/* Logo */}
          <div className="h-14 overflow-hidden relative">
            <div className="text-3xl flex gap-4 items-center absolute bottom-4">
              <div className="bg-gray-50 border border-color-2 flex items-center justify-center rounded-lg w-10 h-10">
                <span className="text-black font-bold italic text-base">ok!</span>
              </div>
              <span className="font-extrabold text-0 italic mr-4">okampus</span>
            </div>
          </div>
          {/* Important content */}
          <div className="flex flex-col gap-6 min-h-max shrink-0 h-max py-8">
            {/* Header */}
            <div>
              <h1 className="title sm-max:text-2xl mb-2">
                Bienvenue{' '}
                <span role="img" aria-label="Waving hand">
                  👋
                </span>
              </h1>
              <h3 className="text-2 text-sm sm-max:text-xs flex gap-1.5 items-start">
                Connectez-vous sur le portail de votre école
                <span role="img" aria-label="Select down">
                  <ArrowDownRightIcon className="mt-1 h-5 sm-max:h-4" />
                </span>
              </h3>
            </div>
            {/* OAuth/OIDC login */}
            <ActionButton
              action={{
                label: 'Continuer avec myEfrei',
                iconOrSwitch: <img src={OAuthSrcLink} className="w-7 pb-0.5" alt="Logo Efrei" />,
                linkOrActionOrMenu: () => console.log('TODO: OAuth/OIDC login'),
              }}
            />
            {/* <button className="flex items-center justify-center gap-2 font-medium gray-button py-1.5 px-3 w-full">
              <img src={OAuthSrcLink} className="w-6" alt="Logo Efrei" />
              Continuer avec myEfrei
            </button> */}
            {/* Separator */}
            <div className="flex items-center gap-1.5 text-xs text-1 before:h-[1px] before:flex-1 before:bg-gray-300 after:h-[1px] after:flex-1 after:bg-gray-300">
              Ou connectez-vous via votre compte Okampus
            </div>
            {/* Login form */}
            {/* <form
              onSubmit={
                // handleSubmit((data) => console.log('Data', data))
                // handleSubmit(({ username, password }) =>
                //   login({ variables: { dto: { username: username.trim(), password } } })
                // )
              }
            > */}
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
            <div className="flex items-center">
              {/* <input
                type="submit"
                value="Se connecter"
                className="hover:cursor-pointer rounded-lg bg-opposite text-opposite py-2 px-3 text-sm font-semibold text-white"
                onClick={() => login({ variables: { dto: { username: username.trim(), password } } })}
              /> */}
              <ActionButton
                iconPosition="right"
                action={{
                  label: 'Se connecter',
                  iconOrSwitch: <ArrowRightIcon />,
                  linkOrActionOrMenu: () => login({ variables: { dto: { username: username.trim(), password } } }),
                  type: ActionType.Action,
                }}
              />
              {/* <h4 className="text-1 ml-4 text-xs font-medium underline">Mot de passe oublié ?</h4> */}
            </div>
            {/* </form> */}
          </div>
        </div>{' '}
      </div>
      <div className="xl-max:hidden bg-opposite w-full h-full"></div>
    </div>
  );
}
