'use client';

import TextInput from '../../../components/molecules/Input/TextInput';
import { useTranslation } from '../../../hooks/context/useTranslation';
import { validateDiscordInvite } from '../../../utils/form-validation/discord-invite';

import Image from 'next/image';
import { useState } from 'react';

import type { ServerInviteData } from '../../../utils/form-validation/discord-invite';

export type DiscordInviteInputProps = {
  invite: string;
  onChangeInvite: (value: string) => void;
  triggerCheck?: boolean;
  setTriggerCheck?: (value: boolean) => void;
  onChange: (value: ServerInviteData) => void;
  onErrorChange?: (value: Error | null) => void;
};
export default function DiscordInviteInput({
  invite,
  onChangeInvite,
  onChange,
  onErrorChange,
  triggerCheck,
  setTriggerCheck,
}: DiscordInviteInputProps) {
  const { format } = useTranslation();
  const [serverInviteData, setServerInviteData] = useState<ServerInviteData>({
    code: '',
    channelName: '',
    guildIcon: '',
    guildId: '',
    guildName: '',
    memberCount: 0,
  });

  const setData = (data: ServerInviteData) => (setServerInviteData(data), onChange(data));
  const validate = async (value: string) => validateDiscordInvite({ invite: value, format, noExpiry: true, setData });

  return (
    <div className="flex flex-col gap-3 w-full">
      <TextInput
        value={invite}
        triggerCheck={triggerCheck}
        setTriggerCheck={setTriggerCheck}
        onChange={onChangeInvite}
        options={{ label: "Lien d'invitation" }}
        checkValueError={validate}
        onErrorChange={onErrorChange}
      />
      {serverInviteData.guildId && (
        <span className="flex gap-1.5 items-center text-sm text-0 font-semibold mt-1">
          <Image
            src={`https://cdn.discordapp.com/icons/${serverInviteData.guildId}/${serverInviteData.guildIcon}.webp`}
            width={20}
            height={20}
            alt={serverInviteData.guildName}
            className="border-2 border-color-3 rounded-lg"
          />
          {serverInviteData.guildName} ({serverInviteData.memberCount} membres)
          <span className="text-xs px-1.5 py-0.5 bg-2 rounded-md">#{serverInviteData.channelName}</span>
        </span>
      )}
    </div>
  );
}
