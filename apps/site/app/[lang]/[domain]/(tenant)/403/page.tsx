import HomeSideBar from '../../../../_components/layouts/SideBar/HomeSideBar';
import CTAButton from '../../../../_components/molecules/Button/CTAButton';
import EmptyStateImage from '../../../../_components/atoms/Image/EmptyStateImage';
import ViewLayout from '../../../../_components/atoms/Layout/ViewLayout';

import { ActionType } from '@okampus/shared/types';

import { XCircle } from '@phosphor-icons/react/dist/ssr';

export default function ErrorForbiddenPage() {
  return (
    <>
      <HomeSideBar />
      <ViewLayout className="bg-main" sidePanelIcon={false}>
        <EmptyStateImage
          className="my-20 mx-10"
          image={<XCircle className="h-48 w-48 text-[var(--danger)]" />}
          title="Impossible d'accéder à cette page"
          subtitle="Vous n'avez pas le droit d'accéder à cette ressource, ou cette ressource n'existe plus."
          cta={
            <CTAButton action="/" type={ActionType.Primary}>
              Retourner à l&apos;accueil
            </CTAButton>
          }
        />
      </ViewLayout>
    </>
  );
}
