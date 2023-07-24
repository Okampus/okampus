'use client';

import CropperNavigation from './CropperNavigation';

import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { CropperFade } from 'react-advanced-cropper';

import type { CSSProperties } from 'react';
import type { CropperRef } from 'react-advanced-cropper';
import type { NavigationRef, PublicNavigationProps } from './CropperNavigation';

export interface CropperWrapperProps<CropperRef = unknown> {
  cropper: CropperRef;
  children?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  spinnerClassName?: string;
  navigation?: boolean;
  navigationProps?: PublicNavigationProps;
}

export default function CropperWrapper({
  cropper,
  children,
  className,
  navigation,
  navigationProps = {},
}: CropperWrapperProps<CropperRef>) {
  const navigationRef = useRef<NavigationRef>(null);
  const state = cropper.getState();
  const transitions = cropper.getTransitions();
  const { rotate } = cropper.getTransforms();

  useEffect(() => navigationRef.current?.refresh(), [state?.boundary.width, state?.boundary.height]);

  return (
    <div
      className={clsx(
        'overflow-hidden max-h-full px-2.5 py-10 min-w-[20rem] flex flex-col bg-3 relative',
        navigation && 'pb-20',
        className
      )}
    >
      <CropperFade className="grow min-h-0" visible={true}>
        {children}
        {navigation && (
          <CropperNavigation
            value={rotate}
            onRotate={cropper.rotateImage}
            onRotateEnd={cropper.transformImageEnd}
            onFlip={cropper.flipImage}
            className={clsx('absolute max-w-md w-full -translate-x-1/2 left-1/2 bottom-0', navigationProps.className)}
            buttonClassName={navigationProps.buttonClassName}
            barClassName={navigationProps.barClassName}
            disabled={transitions.active}
          />
        )}
      </CropperFade>
    </div>
  );
}
