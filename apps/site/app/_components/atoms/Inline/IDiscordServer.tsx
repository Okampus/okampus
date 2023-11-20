import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';

/* eslint-disable @next/next/no-img-element */
export type IDiscordServerProps = {
  code: string;
  guildId: string;
  guildName: string;
  guildIcon: string;
  channelName: string;
  memberCount: number;
};

export default function IDiscordServer({
  code,
  guildId,
  guildName,
  guildIcon,
  channelName,
  memberCount,
}: IDiscordServerProps) {
  return (
    <data value={guildId} className="flex flex-wrap items-center gap-2">
      <img
        className="shrink-0 h-6 w-6 rounded-full"
        src={`https://cdn.discordapp.com/icons/${guildId}/${guildIcon}.webp`}
        alt=""
      />
      <b className="font-semibold text-0">
        {guildName} ({memberCount} membres)
      </b>
      <span className="bg-[var(--bg-main)] p-1 font-medium text-1">#{channelName}</span>
      <a
        href={`https://discord.gg/${code}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 text-blue-400 hover:underline"
      >
        <div>Rejoindre</div>
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </data>
  );
}
