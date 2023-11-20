import { ReactComponent as DiscordLogo } from '@okampus/assets/svg/discord.svg';
import { SocialType } from '@prisma/client';

import {
  FacebookLogo,
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  TiktokLogo,
  TwitchLogo,
  WhatsappLogo,
  YoutubeLogo,
} from '@phosphor-icons/react/dist/ssr';
import clsx from 'clsx';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
  [SocialType.GitHub]: GithubLogo,
  [SocialType.Facebook]: FacebookLogo,
  [SocialType.Discord]: DiscordLogo,
  [SocialType.Instagram]: InstagramLogo,
  [SocialType.YouTube]: YoutubeLogo,
  [SocialType.TikTok]: TiktokLogo,
  [SocialType.LinkedIn]: LinkedinLogo,
  [SocialType.Twitch]: TwitchLogo,
  [SocialType.WhatsApp]: WhatsappLogo,
  // [SocialType.BeReal]: BeRealIcon,
  // [SocialType.Signal]: SignalIcon,
  // [SocialType.Telegram]: TelegramIcon,
};

export type SocialIconProps = { social: SocialType; className?: string };
export default function SocialIcon({ social, className }: SocialIconProps) {
  return <div className={clsx('shrink-0', className)}>{iconMap[social]}</div>;
}
