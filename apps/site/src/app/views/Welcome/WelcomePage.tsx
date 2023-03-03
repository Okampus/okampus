import { ReactComponent as ArrowDownRightIcon } from '@okampus/assets/svg/icons/arrow-down-right.svg';

import { getFragmentData, getMe, loginMutation, tenantFragment } from '@okampus/shared/graphql';
import { NavigationContext, useTheme } from '@okampus/ui/hooks';
import { DarkModeToggle } from '@okampus/ui/atoms';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import type { LoginMutation, MeQuery } from '@okampus/shared/graphql';

const OAuthSrcLink =
  'https://media.discordapp.net/attachments/965927279643488297/1060235625623732244/logo-efrei-print-efrei-web.png';

type LoginForm = {
  username: string;
  password: string;
};

const schema = z.object({
  username: z.string().min(1, { message: "Rentrez votre nom d'utilisateur pour vous connecter." }),
  password: z.string().min(1, { message: "N'oubliez pas d'entrer votre mot de passe." }),
});

export function WelcomePage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(schema) });

  const { data } = useQuery(getMe);
  const [loggedIn, setLoggedIn] = useState(!!data);

  const { isLoading, setIsLoading, setTenant } = useContext(NavigationContext);
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    loggedIn && navigate(localStorage.getItem('next') || '/clubs', { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  const onLoggedIn = (data: LoginMutation | MeQuery) => {
    setLoggedIn(true);
    setIsLoading(true);
    const authContext = 'login' in data ? data.login : data.me;
    setTenant(getFragmentData(tenantFragment, authContext.tenant));
    setTimeout(() => setIsLoading(false), 350);
  };

  const { loading: initialLoading } = useQuery(getMe, {
    onCompleted: onLoggedIn,
    onError: () => setIsLoading(false),
  });

  const [login, { loading: loginLoading }] = useMutation(loginMutation, {
    onCompleted: onLoggedIn,
    onError: () => setIsLoading(false),
  });

  const onLogin = (variables: LoginForm) => {
    login({ variables: { username: variables.username.trim(), password: variables.password } });
  };

  useEffect(() => {
    if ((initialLoading || loginLoading) && !isLoading) {
      setIsLoading(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLoading, loginLoading]);

  return (
    <div className="flex w-full h-full overflow-hidden">
      <div className="relative bg-1 w-full h-full flex flex-col tall:justify-center items-center overflow-scroll scrollbar">
        <div className="w-96 flex flex-col py-10">
          {/* Logo */}
          <div className="h-14 overflow-hidden relative">
            <div className="text-3xl flex gap-4 items-center absolute bottom-4">
              <div className="bg-gray-50 border border-color-2 flex items-center justify-center rounded-lg w-10 h-10">
                <span className="text-brand font-bold italic text-base">ok!</span>
              </div>
              <span className="font-extrabold italic text-brand mr-4">okampus</span>
              <DarkModeToggle
                style={{ color: 'black' }}
                checked={theme === 'light'}
                onChange={(isDark) => (isDark ? setTheme('dark') : setTheme('light'))}
                size={24}
              />
            </div>
          </div>
          {/* Important content */}
          <div className="flex flex-col gap-6 min-h-max shrink-0 h-max py-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-semibold text-0 sm-max:text-2xl mb-2">
                Bienvenue{' '}
                <span role="heading" aria-level={1} className="whitespace-nowrap">
                  <span role="img" aria-label="Waving hand">
                    👋
                  </span>
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
            <div>
              <button className="flex items-center justify-center gap-2 font-medium gray-button py-1.5 px-3 w-full">
                <img src={OAuthSrcLink} className="w-6" alt="Logo Efrei" />
                Continuer avec myEfrei
              </button>
            </div>
            {/* Separator */}
            <div className="flex items-center gap-1.5 text-xs text-1 before:h-[1px] before:flex-1 before:bg-gray-300 after:h-[1px] after:flex-1 after:bg-gray-300">
              Ou connectez-vous via votre compte Okampus
            </div>
            {/* Login form */}
            <form onSubmit={handleSubmit(onLogin)}>
              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm"
                    placeholder="Pseudo / utilisateur@email.com"
                    {...register('username')}
                  />
                  {errors.username?.message && <p className="pt-1 text-red-400 text-sm">{errors.username?.message}</p>}
                </div>

                <div>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm"
                    placeholder="Mot de passe"
                    {...register('password')}
                  />
                  {errors.password?.message && <p className="pt-1 text-red-400 text-sm">{errors.password?.message}</p>}
                </div>
                {/* {(loadingError || error) && <p className="text-red-500">{parseGraphqlError(loadingError || error)}</p>} */}
              </div>
              <div className="flex items-center">
                <input
                  type="submit"
                  value="Se connecter"
                  className={
                    'hover:cursor-pointer rounded-lg bg-opposite text-opposite py-2 px-3 text-sm font-semibold text-white'
                  }
                />
                <h4 className="text-1 ml-4 text-xs font-medium underline">Mot de passe oublié ?</h4>
              </div>
            </form>
          </div>
        </div>{' '}
      </div>
      <div className="lg-max:hidden bg-opposite w-full h-full"></div>
    </div>
  );
}
