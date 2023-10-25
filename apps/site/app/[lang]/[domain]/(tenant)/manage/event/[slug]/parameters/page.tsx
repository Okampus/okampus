'use client';

import ViewLayout from '../../../../../../../_components/atoms/Layout/ViewLayout';

import { useEventManage } from '../../../../../../../_context/navigation';

export default function ManageEventParametersPage({ params }: { params: { slug: string } }) {
  const { eventManage } = useEventManage(params.slug);

  if (!eventManage) return null;

  return (
    <ViewLayout header="Paramètres d'inscription" bottomPadded={false} scrollable={false}>
      {/* TODO: max participants, isAutoAccepting... */}
    </ViewLayout>
  );
}
