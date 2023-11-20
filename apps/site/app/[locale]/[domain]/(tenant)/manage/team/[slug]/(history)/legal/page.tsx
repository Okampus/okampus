import BaseView from '../../../../../../../../_components/templates/BaseView';
import SelectInput from '../../../../../../../../_components/molecules/Input/Controlled/Select/SelectInput';
import TeamLabeled from '../../../../../../../../_components/molecules/Labeled/TeamLabeled';

// import { useTeamManage } from '../../../../../../../../_context/navigation';

import prisma from '../../../../../../../../../database/prisma/db';
import { teamDetails } from '../../../../../../../../../types/prisma/Team/team-details';
import { TeamType } from '@prisma/client';
import { ClockCounterClockwise, Question } from '@phosphor-icons/react/dist/ssr';
import { notFound } from 'next/navigation';
import type { DomainSlugParams } from '../../../../../../../../params.type';

// TODO: static params

export default async function TeamManageLegalPage({ params }: DomainSlugParams) {
  const teamManage = await prisma.team.findFirst({
    where: { slug: params.slug, tenantScope: { domain: params.domain } },
    select: teamDetails.select,
  });

  if (!teamManage) notFound();

  const teamTypeLabel =
    teamManage.type === TeamType.Club ? (
      <span className="flex items-center gap-2">
        Club de <TeamLabeled small={true} team={teamManage} showCardOnClick={false} />
      </span>
    ) : teamManage.type === TeamType.Association ? (
      'Association indépendate'
    ) : (
      'Autre'
    );

  // TODO
  return (
    <BaseView header="Situation légale" sidePanelButton={<ClockCounterClockwise className="h-7 w-7" />}>
      <span className="flex gap-4 items-center">
        <SelectInput
          name="type"
          label="Forme juridique"
          disabled={true}
          options={[{ label: teamTypeLabel, value: teamManage.type }]}
          value={teamManage.type}
          onChange={() => {}}
        />
        <Question className="h-7 w-7" />
      </span>
    </BaseView>
  );
}
