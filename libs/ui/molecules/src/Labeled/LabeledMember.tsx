import { Avatar } from '@okampus/ui/atoms';

export type MemberLabelProps = {
  avatar?: string;
  name?: string;
  role?: string;
};

export function LabeledMember({ avatar, name, role }: MemberLabelProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <Avatar src={avatar} name={name} size={24} />
      <div className="line-clamp-1 text-white font-heading">{name}</div>
      <div className="text-gray-200 -mt-0.5 text-xs line-clamp-2 leading-[1.1]">{role}</div>
    </div>
  );
}
