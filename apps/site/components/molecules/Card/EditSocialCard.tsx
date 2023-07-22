/* eslint-disable react/display-name */
// import { validateEmail } from '../../../utils/form-validation/email';
import DiscordInviteInput from '../Input/DiscordInviteInput';
import TextInput from '../Input/TextInput';
import SocialIcon from '../../atoms/Icon/SocialIcon';
import GroupItem from '../../atoms/Item/GroupItem';

import { required } from '../../../utils/form-validation/required';

import { SocialType } from '@okampus/shared/enums';
import { useMemo } from 'react';

type SocialRenderProps = {
  social: SocialInfo;
  triggerCheck?: boolean;
  setTriggerCheck?: (value: boolean) => void;
  onErrorChange?: (error: Error | null) => void;
};

export type SocialInfo = { type: string; url: string; pseudo: string; order: number };
export type EditSocialCardProps = {
  social: SocialInfo;
  onChange: (social: SocialInfo) => void;
  triggerCheck?: boolean;
  setTriggerCheck?: (value: boolean) => void;
  onErrorChange?: (error: Error | null) => void;
};
export default function EditSocialCard({
  social,
  onChange,
  triggerCheck,
  setTriggerCheck,
  onErrorChange,
}: EditSocialCardProps) {
  const Inner = useMemo(() => {
    switch (social.type) {
      case SocialType.Discord: {
        return ({ social, triggerCheck, setTriggerCheck, onErrorChange }: SocialRenderProps) => (
          <DiscordInviteInput
            invite={social.url}
            onErrorChange={onErrorChange}
            triggerCheck={triggerCheck}
            setTriggerCheck={setTriggerCheck}
            onChange={(value) =>
              onChange({ ...social, pseudo: value.guildName, url: `https://discord.gg/${value.code}` })
            }
            onChangeInvite={(value) => onChange({ ...social, url: value })}
          />
        );
      }
      case SocialType.Instagram: {
        return ({ social, triggerCheck, setTriggerCheck, onErrorChange }: SocialRenderProps) => (
          <TextInput
            allowedChars={/^[\w.]*$/}
            onErrorChange={onErrorChange}
            value={social.pseudo}
            checkValueError={required}
            triggerCheck={triggerCheck}
            setTriggerCheck={setTriggerCheck}
            onChange={(pseudo) => onChange({ ...social, pseudo, url: `https://www.instagram.com/${pseudo}` })}
            prefix="instagram.com/"
            options={{ label: 'handle (sans @)' }}
          />
        );
      }
      case SocialType.TikTok: {
        return ({ social, triggerCheck, setTriggerCheck, onErrorChange }: SocialRenderProps) => (
          <TextInput
            allowedChars={/^[\w.]*$/}
            onErrorChange={onErrorChange}
            value={social.pseudo}
            checkValueError={required}
            triggerCheck={triggerCheck}
            setTriggerCheck={setTriggerCheck}
            onChange={(pseudo) => onChange({ ...social, pseudo, url: `https://www.tiktok.com/@${pseudo}` })}
            prefix="tiktok.com/@"
            options={{ label: 'handle' }}
          />
        );
      }
      case SocialType.LinkedIn: {
        return ({ social, triggerCheck, setTriggerCheck, onErrorChange }: SocialRenderProps) => (
          <TextInput
            onErrorChange={onErrorChange}
            value={social.pseudo}
            checkValueError={required}
            triggerCheck={triggerCheck}
            setTriggerCheck={setTriggerCheck}
            onChange={(pseudo) => onChange({ ...social, pseudo, url: `https://www.linkedin.com/company/${pseudo}` })}
            prefix="linkedin.com/company/"
            options={{ label: 'nom' }}
          />
        );
      }
      case SocialType.Facebook: {
        return ({ social, triggerCheck, setTriggerCheck, onErrorChange }: SocialRenderProps) => (
          <TextInput
            onErrorChange={onErrorChange}
            value={social.url}
            checkValueError={required}
            triggerCheck={triggerCheck}
            setTriggerCheck={setTriggerCheck}
            onChange={(url) => onChange({ ...social, pseudo: url, url })}
            options={{ label: 'URL de votre page' }}
          />
        );
      }
      case SocialType.YouTube: {
        return ({ social, triggerCheck, setTriggerCheck, onErrorChange }: SocialRenderProps) => (
          <TextInput
            onErrorChange={onErrorChange}
            value={social.pseudo}
            checkValueError={required}
            triggerCheck={triggerCheck}
            setTriggerCheck={setTriggerCheck}
            onChange={(pseudo) => onChange({ ...social, pseudo, url: `https://www.youtube.com/channel/${pseudo}` })}
            prefix="youtube.com/channel/"
            options={{ label: 'ID de la chaîne' }}
          />
        );
      }
      case SocialType.Twitch: {
        return ({ social, triggerCheck, setTriggerCheck, onErrorChange }: SocialRenderProps) => (
          <TextInput
            onErrorChange={onErrorChange}
            value={social.pseudo}
            checkValueError={required}
            triggerCheck={triggerCheck}
            setTriggerCheck={setTriggerCheck}
            onChange={(pseudo) => onChange({ ...social, pseudo, url: `https://www.twitch.tv/${pseudo}` })}
            prefix="twitch.tv/"
            options={{ label: 'ID de la chaîne' }}
          />
        );
      }
      case SocialType.GitHub: {
        return ({ social, triggerCheck, setTriggerCheck, onErrorChange }: SocialRenderProps) => (
          <TextInput
            onErrorChange={onErrorChange}
            value={social.pseudo}
            checkValueError={required}
            triggerCheck={triggerCheck}
            setTriggerCheck={setTriggerCheck}
            onChange={(pseudo) => onChange({ ...social, pseudo, url: `https://www.github.com/${pseudo}` })}
            prefix="github.com/"
            options={{ label: "nom de l'organisation" }}
          />
        );
      }
      default: {
        return () => null;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [social.type]);

  return (
    <span className="flex gap-6">
      <SocialIcon social={social.type as SocialType} />
      <GroupItem heading={`${social.type} ${social.pseudo ? `• ${social.pseudo}` : ''}`} className="py-1">
        <Inner
          social={social}
          triggerCheck={triggerCheck}
          setTriggerCheck={setTriggerCheck}
          onErrorChange={onErrorChange}
        />
      </GroupItem>
    </span>
  );
}
