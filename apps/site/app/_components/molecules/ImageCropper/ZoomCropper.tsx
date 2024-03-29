import Slider from '../Input/Slider';

import clsx from 'clsx';
import { forwardRef, useRef } from 'react';
import { CircleStencil, CropperFade, FixedCropper, ImageRestriction, RectangleStencil } from 'react-advanced-cropper';
import { mergeRefs } from 'react-merge-refs';

import { getAbsoluteZoom, getZoomFactor } from 'advanced-cropper/extensions/absolute-zoom';
import { MagnifyingGlassMinus, MagnifyingGlassPlus } from '@phosphor-icons/react/dist/ssr';

import type {
  CropperProps,
  DefaultSize,
  FixedCropperRef,
  FixedCropperSettings,
  StencilSize,
} from 'react-advanced-cropper';

export type ZoomCropperProps = Omit<
  CropperProps<FixedCropperSettings>,
  'aspectRatio' | 'stencilSize' | 'transitions' | 'imageRestriction'
> & { aspectRatio: number; isCircleStencil?: boolean };

const stencilSize: StencilSize = ({ boundary }) => {
  return {
    width: Math.min(boundary.height, boundary.width) - 48,
    height: Math.min(boundary.height, boundary.width) - 48,
  };
};

const defaultSize: DefaultSize = ({ imageSize }) => {
  return {
    width: Math.min(imageSize.height, imageSize.width),
    height: Math.min(imageSize.height, imageSize.width),
  };
};

export default forwardRef(function ZoomCropper(props: ZoomCropperProps, ref) {
  const { className, stencilProps = {}, wrapperComponent, aspectRatio, isCircleStencil, ...cropperProps } = props;
  const cropperRef = useRef<FixedCropperRef>(null);
  const WrapperComponent = wrapperComponent || Wrapper;

  return (
    <FixedCropper
      {...cropperProps}
      // minWidth={150}
      // minHeight={150}
      defaultSize={defaultSize}
      ref={mergeRefs([ref, cropperRef])}
      className={clsx('bg-transparent', className)}
      imageRestriction={ImageRestriction.stencil}
      stencilProps={{
        ...stencilProps,
        previewClassName: clsx(stencilProps.previewClassName, 'border border-[var(--primary)]'),
        overlayClassName: clsx(stencilProps.overlayClassName, 'text-[var(--info)]'),
        movable: false,
        scalable: false,
        lines: {},
        handlers: {},
        aspectRatio,
      }}
      stencilSize={stencilSize}
      stencilComponent={isCircleStencil ? CircleStencil : RectangleStencil}
      transitions={false}
      wrapperComponent={WrapperComponent}
    />
  );
});

type WrapperProps = { cropper: FixedCropperRef; children?: React.ReactNode; className?: string };
function Wrapper({ cropper, children, className }: WrapperProps) {
  const state = cropper.getState();
  const settings = cropper.getSettings();
  const absoluteZoom = getAbsoluteZoom(state, settings);

  const onZoom = (value: number, transitions?: boolean) => {
    if (cropper) cropper.zoomImage(getZoomFactor(state, settings, value), { transitions: !!transitions });
  };

  return (
    <CropperFade className={className} visible={state && cropper.isLoaded()}>
      <div className="flex h-full min-h-0 overflow-hidden">{children}</div>
      <div className="flex items-center max-w-400 w-full mx-auto">
        <div className={clsx('flex w-full items-center justify-center h-16', className)}>
          <div className={clsx('flex items-center max-w-400 w-full')}>
            <div className="h-4.5 w-4.5 fill text-gray-500 flex-shrink-0">
              <MagnifyingGlassMinus className="w-7 h-7 text-1" />
            </div>
            <Slider value={absoluteZoom} onChange={onZoom} className="flex-1 mx-10" />
            <div className="h-4.5 w-4.5 fill text-gray-500 flex-shrink-0">
              <MagnifyingGlassPlus className="w-7 h-7 text-1" />
            </div>
          </div>
        </div>
      </div>
    </CropperFade>
  );
}
