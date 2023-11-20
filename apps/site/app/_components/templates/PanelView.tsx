import BaseView from './BaseView';
import clsx from 'clsx';

import type { BaseViewProps } from './BaseView';

export type PanelViewProps = {
  content: React.ReactNode;
  viewHeader?: React.ReactNode;
  panel?: React.ReactNode;
  responsiveMode?: 'prepend' | 'hide';
} & Partial<BaseViewProps>;
export default function PanelView({ content, viewHeader, panel, responsiveMode = 'hide', ...props }: PanelViewProps) {
  return (
    <BaseView contentMode="centered-6xl" {...props}>
      {viewHeader}
      <div
        className={clsx(
          'flex items-start gap-16',
          responsiveMode === 'prepend' && 'lg-max:flex-col-reverse lg-max:items-stretch',
        )}
      >
        <div className="max-w-2xl w-full">{content}</div>
        <div
          className={clsx(
            'flex flex-col grow lg:sticky lg:top-20',
            responsiveMode === 'prepend' ? 'lg-max:static lg-max:w-full' : 'lg-max:hidden',
          )}
        >
          {panel}
        </div>
      </div>
    </BaseView>
  );
}
