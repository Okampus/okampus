'use client';

import NextForm from './NextForm/NextForm';
import TextInput from '../_components/molecules/Input/TextInput';
import { login } from '../../server/actions/login';

export default function SigninForm() {
  return (
    <NextForm
      action={login}
      submitLabel="Se connecter par mot de passe"
      render={({ errors }) => (
        <div className="flex flex-col gap-3.5 mb-5">
          <TextInput name="username" error={errors?.username} placeholder="Nom d'utilisateur" />
          <TextInput name="password" error={errors?.password} type="password" placeholder="Mot de passe" />
        </div>
      )}
    />
  );
}
