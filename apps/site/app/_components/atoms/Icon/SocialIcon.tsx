import SVGUniqueID from './SVGUniqueID';
import { SocialType } from '@okampus/shared/enums';
import { ReactComponent as GitHubIcon } from 'super-tiny-icons/images/svg/github.svg';
import { ReactComponent as FacebookIcon } from 'super-tiny-icons/images/svg/facebook.svg';
import { ReactComponent as DiscordIcon } from 'super-tiny-icons/images/svg/discord.svg';
import { ReactComponent as InstagramIcon } from 'super-tiny-icons/images/svg/instagram.svg';
import { ReactComponent as YouTubeIcon } from 'super-tiny-icons/images/svg/youtube.svg';
import { ReactComponent as TikTokIcon } from 'super-tiny-icons/images/svg/tiktok.svg';
import { ReactComponent as TwitchIcon } from 'super-tiny-icons/images/svg/twitch.svg';
import { ReactComponent as LinkedInIcon } from 'super-tiny-icons/images/svg/linkedin.svg';
import { ReactComponent as WhatsAppIcon } from 'super-tiny-icons/images/svg/whatsapp.svg';
import clsx from 'clsx';
import {
  DiscordLogo,
  FacebookLogo,
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  TiktokLogo,
  TwitchLogo,
  WhatsappLogo,
  YoutubeLogo,
} from '@phosphor-icons/react/dist/ssr';
// import { ReactComponent as BeRealIcon } from '@okampus/assets/svg/icons/bereal.svg';
// import { ReactComponent as TelegramIcon } from 'super-tiny-icons/images/svg/telegram.svg';
// import { ReactComponent as SignalIcon } from 'super-tiny-icons/images/svg/signal.svg';
// import { ReactComponent as WhatsAppIcon } from 'super-tiny-icons/images/svg/whatsapp.svg';
// import { SVGUniqueID } from 'react-svg-unique-id';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconLargeMap: Record<string, any> = {
  [SocialType.GitHub]: GitHubIcon,
  [SocialType.Facebook]: FacebookIcon,
  [SocialType.Discord]: DiscordIcon,
  [SocialType.Instagram]: InstagramIcon,
  [SocialType.YouTube]: YouTubeIcon,
  [SocialType.TikTok]: TikTokIcon,
  [SocialType.LinkedIn]: LinkedInIcon,
  [SocialType.Twitch]: TwitchIcon,
  [SocialType.WhatsApp]: WhatsAppIcon,
  // [SocialType.BeReal]: BeRealIcon,
  // [SocialType.Signal]: SignalIcon,
  // [SocialType.Telegram]: TelegramIcon,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconSmallMap: Record<string, any> = {
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

export type SocialIconProps = { social: string; small?: boolean; className?: string; onClick?: () => void };
export default function SocialIcon({ social, small = false, className, onClick }: SocialIconProps) {
  const Icon = (small ? iconSmallMap[social] : iconLargeMap[social]) ?? null;
  const baseClass = small ? 'h-8' : 'h-12 p-2 bg-2 rounded-2xl';
  return (
    <div className={clsx('shrink-0', baseClass, className, onClick && 'cursor-pointer')} onClick={onClick}>
      <SVGUniqueID>{Icon.render({ className: 'rounded-xl w-full h-full' })}</SVGUniqueID>
    </div>
  );
}
