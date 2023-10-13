'use client';

import AvatarImage from '../../../_components/atoms/Image/AvatarImage';
import ActionButton from '../../../_components/molecules/Button/ActionButton';
import SubmitButton from '../../../_components/molecules/Button/SubmitButton';
import SelectInput from '../../../_components/molecules/Input/Select/SelectInput';
import TextInput from '../../../_components/molecules/Input/TextInput';
import ErrorMessage from '../../../_components/organisms/Form/ErrorMessage';

import { baseUrl, protocol } from '../../../../config';
import { meSlugAtom } from '../../../_context/global';
import { trpcClient } from '../../../_context/trpcClient';

import { ReactComponent as OkampusLogoLarge } from '@okampus/assets/svg/brands/okampus-large.svg';

import { NEXT_PAGE_COOKIE } from '@okampus/shared/consts';
import { useGetTenantOidcInfoQuery } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Cookies from 'universal-cookie';
import * as z from 'zod';

const signinFormSchema = z.object({
  username: z.string().min(1, { message: "Nom d'utilisateur requis" }),
  password: z.string().min(1, { message: 'Mot de passe requis' }),
  tenant: z.string(),
});

const nextUrl = (url: string, domain: string) => {
  url = url === '/signin' || !url ? '/' : url;
  return `${protocol}://${domain}.${baseUrl}${url}`;
};

export default function SigninPage() {
  const [, setMeSlug] = useAtom(meSlugAtom);
  const router = useRouter();
  const cookieStore = new Cookies();

  const { data } = useGetTenantOidcInfoQuery();

  const [showLogin, setShowLogin] = useState(false);
  const { control, register, handleSubmit, formState, setError } = useForm<z.infer<typeof signinFormSchema>>({
    resolver: zodResolver(signinFormSchema),
  });
  const login = trpcClient.login.useMutation({
    onSettled: (slug, error, { tenant }) => {
      if (error) return setError('root', { message: error.message });
      if (!slug) return setError('root', { message: 'Une erreur est survenue. Veuillez réessayer plus tard.' });
      setMeSlug(slug);
      const next = cookieStore.get(NEXT_PAGE_COOKIE);
      cookieStore.remove(NEXT_PAGE_COOKIE);
      router.push(nextUrl(next, tenant));
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await login.mutateAsync(values).catch((error) => setError('root', { message: error.message, type: 'validate' }));
  });

  return (
    <div className="flex w-full h-full overflow-hidden">
      <div className="relative bg-main w-full h-full flex flex-col justify-center items-center overflow-scroll scrollbar">
        <div className="flex flex-col items-center py-12 overflow-y-auto scrollbar w-full">
          <div className="max-w-[30rem] w-full px-12 flex flex-col gap-8">
            <div className="text-0 flex flex-col items-start gap-8">
              <OkampusLogoLarge style={{ height: '4rem' }} />
              <h1 className="text-2xl text-left font-semibold text-0">Bienvenue 👋</h1>
            </div>

            <div className="flex flex-col gap-4">
              {data?.tenant.map((tenant) => {
                if (!tenant.isOidcEnabled || !tenant.oidcName) return null;
                const iconOrSwitch = <AvatarImage actor={tenant.actor} />;
                const linkOrActionOrMenu = `${baseUrl}/auth/oidc/${tenant.oidcName}`;
                const label = `Continuer avec ${tenant.actor.name}`;

                const action = { type: ActionType.Action, label, iconOrSwitch, linkOrActionOrMenu };
                return <ActionButton key={tenant.id} action={action} className="!h-[4.5rem] !text-xl" />;
              })}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-1 before:h-[1px] before:flex-1 before:bg-gray-300 after:h-[1px] after:flex-1 after:bg-gray-300">
              OU
            </div>
            {showLogin ? (
              <form onSubmit={onSubmit}>
                <div className="flex flex-col gap-4 mb-6">
                  <TextInput
                    error={formState.errors.username?.message}
                    placeholder="Nom d'utilisateur"
                    {...register('username', { required: true })}
                  />
                  <TextInput
                    error={formState.errors.password?.message}
                    type="password"
                    placeholder="Mot de passe"
                    {...register('password', { required: true })}
                  />
                  <Controller
                    control={control}
                    name="tenant"
                    render={({ field }) => (
                      <SelectInput
                        placeholder="Établissement"
                        options={
                          data?.tenant.map((tenant) => ({ label: tenant.actor.name, value: tenant.domain })) || []
                        }
                        name={field.name}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    )}
                  />
                </div>
                <SubmitButton label="Se connecter" loading={formState.isSubmitting} />
                <ErrorMessage className="mt-6" errors={formState.errors} />
              </form>
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
