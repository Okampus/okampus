import IDiscordServer from '../../components/atoms/Inline/IDiscordServer';
import { isKey, isNonNullObject } from '@okampus/shared/utils';
import axios from 'axios';
import type { Format } from '../../config/i18n';

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
};
export async function validateDiscordInvite({ invite, format, noExpiry = true }: ValidateDiscordInvite) {
  const inviteCode = invite.match(
    /^(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|(discordapp|discord)\.com\/invite)\/(.+)$/,
  )?.[6];
  if (!inviteCode) return 'Veuillez entrer une invitation Discord valide.';

  try {
    const { data } = await axios.get<ServerInviteV8ApiData>(
      `https://discord.com/api/v8/invites/${inviteCode}?with_counts=true`,
    );
    if (data.expires_at && noExpiry) {
      const expiresAt = new Date(data.expires_at);
      return `Veuillez utiliser une invitation Discord sans expiration. Celle-ci expire le ${format(
        'weekDay',
        expiresAt,
      )}.`;
    }

    const guildData = {
      channelName: data.channel.name,
      guildIcon: data.guild.icon,
      guildName: data.guild.name,
      memberCount: data.approximate_member_count,
      code: data.code,
      guildId: data.guild.id,
    };

    return {
      info: <IDiscordServer {...guildData} />,
      data: guildData,
    };
  } catch (error) {
    if (
      isNonNullObject(error) &&
      isKey('response', error) &&
      isNonNullObject(error.response) &&
      isKey('status', error.response) &&
      error.response.status === 404
    )
      return 'Cette invitation Discord ne correspond à aucun serveur. Veuillez entrer une invitation Discord valide.';
    throw error;
  }
}
