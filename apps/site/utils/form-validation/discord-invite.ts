import axios from 'axios';
import type { Format } from '../../locales/i18n';

export type ServerInviteData = {
  code: string;
  guildName: string;
  guildId: string;
  guildIcon: string;
  channelName: string;
  memberCount: number;
};

type ServerInviteV8ApiData = {
  code: string;
  expires_at: string | null;
  guild: {
    id: string;
    name: string;
    icon: string;
  };
  channel: {
    name: string;
  };
  approximate_member_count: number;
};

type ValidateDiscordInvite = {
  invite: string;
  format: Format;
  noExpiry?: boolean;
  setData?: (data: ServerInviteData) => void;
};
export async function validateDiscordInvite({ invite, format, noExpiry, setData }: ValidateDiscordInvite) {
  const isValid = invite.match(
    /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|(discordapp|discord)\.com\/invite)\/.+[a-z]/
  );
  if (!isValid) throw new Error('Veuillez entrer une invitation Discord valide.');

  const inviteCode = invite.match(
    /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|(discordapp|discord)\.com\/invite)\/(.+)/
  )?.[6];
  if (!inviteCode) throw new Error('Veuillez entrer une invitation Discord valide.');

  try {
    const { data } = await axios.get<ServerInviteV8ApiData>(
      `https://discord.com/api/v8/invites/${inviteCode}?with_counts=true`
    );
    if (data.expires_at && noExpiry) {
      const expiresAt = new Date(data.expires_at);
      throw new Error(
        `Veuillez utiliser une invitation Discord sans expiration. Celle-ci expire le ${format('weekDay', expiresAt)}.`
      );
    }

    setData?.({
      code: data.code,
      guildId: data.guild.id,
      guildName: data.guild.name,
      guildIcon: data.guild.icon,
      channelName: data.channel.name,
      memberCount: data.approximate_member_count,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 404)
      throw new Error(
        'Cette invitation Discord ne correspond à aucun serveur. Veuillez entrer une invitation Discord valide.'
      );

    throw error;
  }
}
