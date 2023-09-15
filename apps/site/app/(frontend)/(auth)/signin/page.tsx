'use client';

import AvatarImage from '../../../../components/atoms/Image/AvatarImage';
import ActionButton from '../../../../components/molecules/Button/ActionButton';
import SubmitButton from '../../../../components/molecules/Button/SubmitButton';
import SelectInput from '../../../../components/molecules/Input/Select/SelectInput';
import TextInput from '../../../../components/molecules/Input/TextInput';
import FormErrors from '../../../../components/organisms/Form/FormErrors';

import { API_URL } from '../../../../context/consts';
import { meSlugAtom } from '../../../../context/global';

import { getGraphQLErrors } from '../../../../utils/apollo/get-graphql-errors';
import { getTenantFromHost } from '../../../../utils/host/get-tenant-from-host';

import { ReactComponent as OkampusLogoLarge } from '@okampus/assets/svg/brands/okampus-large.svg';
import { NEXT_PAGE_COOKIE } from '@okampus/shared/consts';
import { useGetTenantOidcInfoQuery, useLoginMutation } from '@okampus/shared/graphql';
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

export default function SigninPage() {
  const [, setMeSlug] = useAtom(meSlugAtom);
  const router = useRouter();
  const cookieStore = new Cookies();

  const { data } = useGetTenantOidcInfoQuery();
  const [login] = useLoginMutation();

  const [showLogin, setShowLogin] = useState(false);
  const { control, register, handleSubmit, formState, setError } = useForm<z.infer<typeof signinFormSchema>>({
    resolver: zodResolver(signinFormSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    await login({
      variables: { dto: { username: values.username, password: values.password } },
      context: { tenant: values.tenant },
    })
      .then(({ data }) => {
        if (data?.login) {
          setMeSlug(data.login);
          const next = cookieStore.get(NEXT_PAGE_COOKIE);
          cookieStore.remove(NEXT_PAGE_COOKIE);

          const isSameTenant = getTenantFromHost(window.location.host) === values.tenant;
          const defaultNext = isSameTenant ? '/' : `https://${values.tenant}.okampus.fr/`;
          router.push(
            next === '/signin' || !next
              ? defaultNext
              : isSameTenant
              ? next
              : `https://${values.tenant}.okampus.fr${next}`,
          );
        }
      })
      // eslint-disable-next-line unicorn/catch-error-name
      .catch((apolloErrors) => {
        for (const error of getGraphQLErrors(apolloErrors)) {
          setError('root', error);
        }
      });
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
              {data?.tenant.map(
                (tenant) =>
                  tenant.isOidcEnabled &&
                  tenant.oidcName && (
                    <ActionButton
                      key={tenant.id}
                      className="!h-[4.5rem] !text-xl"
                      action={{
                        type: ActionType.Action,
                        label: `Continuer avec ${tenant.actor.name}`,
                        iconOrSwitch: <AvatarImage actor={tenant.actor} />,
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
                          data?.tenant.map((tenant) => ({
                            label: tenant.actor.name,
                            value: tenant.domain,
                          })) || []
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
                <FormErrors className="mt-6" errors={formState.errors} />
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
