import AvatarImage from '../../_components/atoms/Image/AvatarImage';
import Choice from '../../_components/molecules/Choice';
import BadgeList from '../../_components/molecules/List/BadgeList';

import { SearchView } from '../../_components/templates/SearchView';
import { getRoles } from '../../../utils/models/get-roles';

import { COLORS } from '@okampus/shared/consts';

import type { TeamMemberMinimal } from '../../../types/prisma/TeamMember/team-member-minimal';

export type MemberListProps = { members: TeamMemberMinimal[] };
export default function MemberList({ members }: MemberListProps) {
  return (
    <SearchView
      emptyState="Aucune banque trouvée. Veuillez vérifier votre orthographe."
      innerClassName="choices-layout"
      options={members.map((member) => {
        const roles = getRoles(member);

        return {
          label: (
            <Choice action={`/user/${member.user.slug}`} prefix={<AvatarImage actor={member.user.actor} />}>
              <div>
                <div className="text-0 font-semibold text-lg line-clamp-1">{member.user.actor.name}</div>
                <BadgeList badges={roles.map((role) => ({ children: role.name, color: COLORS[role.color] }))} />
              </div>
            </Choice>
          ),
          // TODO: structured search text with priority with fuse
          searchText: `${member.user.actor.name} ${member.user.actor.email} ${member.user.actor.status} ${roles
            .map((role) => role.name)
            .join(' ')}`,
        };
      })}
    />
  );
}
