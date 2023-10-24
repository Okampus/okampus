import SigninForm from '../../../../app/_forms/SigninForm';
import AvatarImage from '../../../_components/atoms/Image/AvatarImage';
import ActionButton from '../../../_components/molecules/Button/ActionButton';

import { baseUrl } from '../../../../config';
import { getApolloQuery } from '../../../../server/ssr/getApolloQuery';

import { getTranslation } from '../../../../server/ssr/getTranslation';
import { ReactComponent as OkampusLogoLarge } from '@okampus/assets/svg/brands/okampus.svg';

import { GetTenantOidcInfoDocument } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';

import clsx from 'clsx';

import type { LocalePath } from '../../../../config/i18n';
import type { GetTenantOidcInfoQuery } from '@okampus/shared/graphql';

const ruleClassName = 'before:h-[1px] before:flex-1 before:bg-gray-200 after:h-[1px] after:flex-1 after:bg-gray-200';

export type SigninPageProps = { params: { lang: LocalePath } };
export default async function SigninPage({ params: { lang } }: SigninPageProps) {
  const { t } = await getTranslation(lang);
  const { data } = await getApolloQuery<GetTenantOidcInfoQuery>({ query: GetTenantOidcInfoDocument });

  const tenants = data?.tenant.map(({ actor, oidcName, isOidcEnabled, id }) => {
    if (!isOidcEnabled || !oidcName) return null;
    const iconOrSwitch = <AvatarImage actor={actor} />;
    const linkOrActionOrMenu = `${baseUrl}/auth/oidc/${oidcName}`;

    const action = { type: ActionType.Action, label: `Continuer avec ${actor.name}`, iconOrSwitch, linkOrActionOrMenu };
    return <ActionButton key={id} action={action} className="!h-[4.5rem] !text-xl" />;
  });

  return (
    <div className="flex w-full h-full overflow-hidden">
      <div className="relative bg-main w-full h-full flex flex-col justify-center items-center overflow-scroll scrollbar">
        <div className="flex flex-col items-center py-12 overflow-y-auto scrollbar w-full">
          <div className="max-w-[30rem] w-full px-12">
            <div className="text-0 flex flex-col items-start gap-8 mb-12">
              <OkampusLogoLarge style={{ height: '4rem' }} />
              <h1 className="text-2xl text-left font-semibold text-0">{t('common', 'welcome')} 👋</h1>
            </div>
            {tenants && <div className="flex flex-col gap-3.5">{tenants}</div>}
            <div className={clsx('flex items-center gap-6 text-2 font-medium uppercase my-6', ruleClassName)}>
              {t('common', 'or')}
            </div>
            <SigninForm />
          </div>
        </div>
      </div>
      <div className="xl-max:hidden bg-opposite w-full h-full relative" />
    </div>
  );
}
