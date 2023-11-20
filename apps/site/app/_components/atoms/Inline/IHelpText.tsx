import { Info } from '@phosphor-icons/react';

export type IHelpTextProps = { text: string };
export default function IHelpText({ text }: IHelpTextProps) {
  return (
    <div className="flex gap-2 items-start text-sm text-2">
      <Info />
      <p>{text}</p>
    </div>
  );
}
