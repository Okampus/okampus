'use client';

import ViewLayout from '../../../../../../../_components/atoms/Layout/ViewLayout';
import SimpleList from '../../../../../../../_components/molecules/List/SimpleList';
import SelectInput from '../../../../../../../_components/molecules/Input/Select/SelectInput';
import TeamLabeled from '../../../../../../../_components/molecules/Labeled/TeamLabeled';

import { useTeamManage } from '../../../../../../../_context/navigation';

import { TeamType } from '@okampus/shared/enums';
import { ClockCounterClockwise, Question } from '@phosphor-icons/react';

export default function TeamManageLegalPage({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);

  if (!teamManage) return null;

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

  return (
    <ViewLayout header="Situation légale" sidePanelIcon={<ClockCounterClockwise className="h-7 w-7" />}>
      <SimpleList heading="Situation générale">
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
      </SimpleList>
    </ViewLayout>
  );
}
