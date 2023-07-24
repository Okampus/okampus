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
import clsx from 'clsx';
import {
  IconBrandDiscord,
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTiktok,
  IconBrandTwitch,
  IconBrandYoutube,
} from '@tabler/icons-react';
// import { ReactComponent as BeRealIcon } from '@okampus/assets/svg/icons/bereal.svg';
// import { ReactComponent as TelegramIcon } from 'super-tiny-icons/images/svg/telegram.svg';
// import { ReactComponent as SignalIcon } from 'super-tiny-icons/images/svg/signal.svg';
// import { ReactComponent as WhatsAppIcon } from 'super-tiny-icons/images/svg/whatsapp.svg';
// import { SVGUniqueID } from 'react-svg-unique-id';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconLargeMap: Record<SocialType, any> = {
  [SocialType.GitHub]: GitHubIcon,
  [SocialType.Facebook]: FacebookIcon,
  [SocialType.Discord]: DiscordIcon,
  [SocialType.Instagram]: InstagramIcon,
  [SocialType.YouTube]: YouTubeIcon,
  [SocialType.TikTok]: TikTokIcon,
  [SocialType.LinkedIn]: LinkedInIcon,
  [SocialType.Twitch]: TwitchIcon,
  // [SocialType.BeReal]: BeRealIcon,
  // [SocialType.Signal]: SignalIcon,
  // [SocialType.Telegram]: TelegramIcon,
  // [SocialType.WhatsApp]: WhatsAppIcon,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconSmallMap: Record<SocialType, any> = {
  [SocialType.GitHub]: IconBrandGithub,
  [SocialType.Facebook]: IconBrandFacebook,
  [SocialType.Discord]: IconBrandDiscord,
  [SocialType.Instagram]: IconBrandInstagram,
  [SocialType.YouTube]: IconBrandYoutube,
  [SocialType.TikTok]: IconBrandTiktok,
  [SocialType.LinkedIn]: IconBrandLinkedin,
  [SocialType.Twitch]: IconBrandTwitch,
  // [SocialType.BeReal]: BeRealIcon,
  // [SocialType.Signal]: SignalIcon,
  // [SocialType.Telegram]: TelegramIcon,
  // [SocialType.WhatsApp]: WhatsAppIcon,
};

export type SocialIconProps = { social: SocialType; small?: boolean; className?: string; onClick?: () => void };
export default function SocialIcon({ social, small = false, className, onClick }: SocialIconProps) {
  const Icon = small ? iconSmallMap[social] : iconLargeMap[social];
  const baseClass = small ? 'h-8' : 'h-12 p-2 bg-2 rounded-2xl';
  return (
    <div className={clsx('shrink-0', baseClass, className, onClick && 'cursor-pointer')} onClick={onClick}>
      <SVGUniqueID>{Icon.render({ className: 'rounded-xl w-full h-full' })}</SVGUniqueID>
    </div>
  );
}
