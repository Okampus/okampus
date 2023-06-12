import { AvatarImage } from '@okampus/ui/atoms';
import type { MemberLabelProps } from './LabeledMember';

export function LabeledMemberHorizontal({ avatar, name, role }: MemberLabelProps) {
  return (
    <div className="flex items-start gap-4">
      <AvatarImage src={avatar} name={name} size={20} type="user" />
      <div className="flex flex-col gap-1">
        <div className="text-0 text-lg font-semibold">{name}</div>
        <div className="text-1 -mt-0.5 line-clamp-2 leading-[1.1]">{role}</div>
      </div>
    </div>
  );
}
