import { Avatar } from '@okampus/ui/atoms';
import { NavigationContext } from '@okampus/ui/hooks';

import { ReactComponent as CloseIcon } from '@okampus/assets/svg/icons/close.svg';
import { ReactComponent as EditIcon } from '@okampus/assets/svg/icons/outlined/edit.svg';

import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { useContext } from 'react';

import type { AvatarProps } from '@okampus/ui/atoms';

export type AvatarEditorProps = {
  avatar: AvatarProps;
  small?: boolean;
  onChange: (file: File | null) => void;
};

export function AvatarEditor({ avatar, small, onChange }: AvatarEditorProps) {
  const { showModal } = useContext(NavigationContext);
  // TODO: add cropper

  return (
    <div className="relative">
      <Avatar {...avatar} />
      <motion.div
        className="absolute inset-0 w-full h-full z-20 cursor-pointer"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.75 }}
        transition={{ duration: 0.1 }}
      >
        <div
          className="absolute inset-0 w-full h-full bg-black text-white flex items-center justify-center"
          style={{
            borderRadius: `${avatar.rounded ?? 50}%`,
          }}
        >
          <div className="flex flex-col items-center gap-item">
            <EditIcon className="flex items-center justify-center" style={{ width: small ? '50%' : '30%' }} />
            <div className={clsx('font-semibold font-title', small && 'hidden')} style={{ fontSize: '120%' }}>
              {avatar.src ? "Changer l'avatar" : 'Séléctionner un avatar'}
            </div>
          </div>
        </div>
        {avatar.src && (
          <CloseIcon
            className="z-20 absolute top-2 right-2 rounded-[50%] w-10 h-10 bg-4 text-0 p-1 opacity-50 hover:opacity-100"
            onClick={() => onChange(null)}
          />
        )}
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(event) => {
            const file = event.target.files?.[0];
            onChange(file ?? null);
          }}
        />
      </motion.div>
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
