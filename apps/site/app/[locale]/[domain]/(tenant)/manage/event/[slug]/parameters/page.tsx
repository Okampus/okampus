'use client';

import BaseView from '../../../../../../../_components/templates/BaseView';

// import { useEventManage } from '../../../../../../../_context/navigation';

export default function ManageEventParametersPage({ params }: { params: { slug: string } }) {
  // TODO event parameters
  // const { eventManage } = useEventManage(params.slug);

  // if (!eventManage) return null;

  return (
    <BaseView header="Paramètres d'inscription" unscrollable={true}>
      {/* TODO: max participants, isAutoAccepting... */}
    </BaseView>
  );
}
