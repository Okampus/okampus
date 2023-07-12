import { BannerImage } from '@okampus/ui/atoms';
// import { NavigationContext } from '@okampus/ui/hooks';

import {
  // useContext,
  useRef,
} from 'react';

import type { BannerImageProps } from '@okampus/ui/atoms';

export type BannerEditorProps = {
  banner?: BannerImageProps;
  small?: boolean;
  onChange: (file: File | null) => void;
};

export function BannerEditor({ banner, onChange }: BannerEditorProps) {
  // const { showButtonModal } = useContext(NavigationContext);
  // TODO: add cropper

  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="h-full">
      <BannerImage {...banner} className="absolute inset-0" />
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          onChange(file ?? null);
        }}
      />
      <div
        className="z-10 absolute top-[var(--topbar-height)] text-white cursor-pointer font-semibold hover:underline"
        onClick={() => ref.current?.click()}
      >
        Modifier la bannière
      </div>
      {/* <Cropper
        src="https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg"
        style={{ height: 400, width: '100%' }}
        // Cropper.js options
        initialAspectRatio={16 / 9}
        guides={false}
        crop={onCrop}
        ref={cropperRef}
      /> */}
    </div>
  );
}
