/* eslint-disable @next/next/no-img-element */
import Skeleton from '../Skeleton/Skeleton';
import TextInput from '../../molecules/Input/Uncontrolled/String/TextInput';

import { useEffect, useState } from 'react';
import QRCodeGenerator from 'qrcode';

export type QRCodeProps = {
  data: string;
  showData?: boolean;
};

export default function QRImage({ data, showData }: QRCodeProps) {
  const [QRCode, setQRCode] = useState<string | null>(null);

  useEffect(() => {
    QRCodeGenerator.toDataURL(data).then(setQRCode);
  }, [data]);

  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg w-[26rem] mx-auto my-12">
      {QRCode ? <img alt="QR code" src={QRCode} /> : <Skeleton className="w-[26rem] h-[26rem]" />}
      {showData && <TextInput name="qr" disabled={true} defaultValue={data} copyable={true} />}
    </div>
  );
}
