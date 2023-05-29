import { TextInput } from '../Input/TextInput';
import { useEffect, useState } from 'react';
import QRCodeGenerator from 'qrcode';

export type QRCodeImageProps = {
  text: string;
  showLink?: boolean;
};

export function QRCodeImage({ text, showLink }: QRCodeImageProps) {
  const [QRCode, setQRCode] = useState<string | undefined>();

  useEffect(() => {
    QRCodeGenerator.toDataURL(text).then(setQRCode);
  }, []);

  return (
    <div className="bg-4 flex flex-col gap-2 p-4 rounded-lg w-[26rem]">
      <img src={QRCode} />
      {showLink && (
        <TextInput
          options={{ name: 'qr', label: 'Lien de validation de présence', disabled: true }}
          value={text}
          copyable={true}
        />
      )}
    </div>
  );
}
