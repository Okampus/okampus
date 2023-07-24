import CropperWrapper from './CropperWrapper';

import clsx from 'clsx';
import { forwardRef, useRef } from 'react';
import {
  Cropper as DefaultCropper,
  ImageRestriction,
  mergeRefs,
  defaultSize,
  transformImage,
} from 'react-advanced-cropper';

import type { PublicNavigationProps } from './CropperNavigation';
import type { CropperProps as DefaultCropperProps, CropperRef, ScaleImageOptions } from 'react-advanced-cropper';

export interface CropperProps
  extends Omit<
    DefaultCropperProps,
    'transitions' | 'priority' | 'imageRestriction' | 'stencilSize' | 'stencilConstraints' | 'transformImage'
  > {
  spinnerClassName?: string;
  resizeImage?: boolean | Omit<ScaleImageOptions, 'adjustStencil'>;
  navigation?: boolean;
  navigationProps?: PublicNavigationProps;
  imageRestriction?: ImageRestriction.none | ImageRestriction.stencil;
}

// eslint-disable-next-line react/display-name
export default forwardRef((props: CropperProps, ref) => {
  const {
    className,
    spinnerClassName,
    navigation = true,
    stencilProps = {},
    navigationProps = {},
    wrapperComponent,
    ...cropperProps
  } = props;

  const cropperRef = useRef<CropperRef>(null);

  const WrapperComponent = wrapperComponent || CropperWrapper;

  return (
    <DefaultCropper
      {...cropperProps}
      ref={mergeRefs([ref, cropperRef])}
      stencilProps={{ grid: true, movable: true, ...stencilProps }}
      wrapperComponent={WrapperComponent}
      wrapperProps={{ navigationProps, navigation, spinnerClassName }}
      imageRestriction={ImageRestriction.none}
      className={clsx('text-4', className)}
      defaultSize={defaultSize}
      transformImageAlgorithm={transformImage}
      transitions={true}
    />
  );
});
