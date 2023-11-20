import MemberCard from './Member/MemberCard';
import CollapseSeparator from '../_components/atoms/Decoration/CollapseSeparator';
import type { TeamMemberMinimal } from '../../types/prisma/TeamMember/team-member-minimal';

// TODO: sorting with position and recent activity
export type PoleChartProps = {
  name: string;
  leaders: { member: TeamMemberMinimal; title: string }[];
  members: TeamMemberMinimal[];
};

export function PoleChart({ name, leaders, members }: PoleChartProps) {
  return (
    <section className="flex flex-col gap-8">
      <h1 className="text-3xl font-semibold text-0">{name}</h1>
      <div>
        <div className="grid grid-cols-3 gap-12 md-max:grid-cols-1">
          {leaders.map(({ member, title }) => (
            <MemberCard key={member.id} title={title} data={member.user} />
          ))}
        </div>
        {members.length > 0 && (
          <>
            <CollapseSeparator />
            <div className="grid grid-cols-4 gap-6 md-max:grid-cols-1">
              {members.map((member) => (
                <MemberCard key={member.id} title={`Membre ${name}`} data={member.user} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
