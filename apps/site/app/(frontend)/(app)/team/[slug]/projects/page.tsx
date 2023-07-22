'use client';

import { useTeam } from '../../../../../../context/navigation';

export default function TeamProjectsPage({ params }: { params: { slug: string } }) {
  const { team } = useTeam(params.slug);

  return <div>Vos informations bancaires: {team?.actor?.name}</div>;
}
