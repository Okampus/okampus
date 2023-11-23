'use client';

import FormWithAction from '../../_components/molecules/Form/FormWithAction';
import TextInput from '../../_components/molecules/Input/Uncontrolled/String/TextInput';
import signin from '../../../server/actions/signin';

import { signinSchema } from '../../../schemas/signin';
import { useSearchParams } from 'next/navigation';

export default function SigninForm() {
  const params = useSearchParams();
  const next = params.get('next');

  return (
    <FormWithAction
      action={signin}
      zodSchema={signinSchema}
      submitProps={{ label: 'Se connecter par mot de passe' }}
      render={({ errors }) => (
        <>
          {next && <input type="hidden" name="next" value={next} />}
          <TextInput name="username" error={errors?.username} placeholder="Nom d'utilisateur" />
          <TextInput name="password" error={errors?.password} type="password" placeholder="Mot de passe" />
        </>
      )}
    />
  );
}
