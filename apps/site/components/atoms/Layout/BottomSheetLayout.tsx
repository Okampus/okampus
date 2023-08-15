import { useBottomSheet } from '../../../hooks/context/useBottomSheet';
import CloseButtonIcon from '../Icon/CloseButtonIcon';
import clsx from 'clsx';

export type BottomSheetLayoutProps = {
  topbar?: React.ReactNode;
  buttons?: React.ReactNode;
  content: React.ReactNode;
  mobilePadded?: boolean;
  horizontalPadding?: boolean;
};

export default function BottomSheetLayout({
  topbar,
  buttons,
  content,
  horizontalPadding = true,
}: BottomSheetLayoutProps) {
  const { closeBottomSheet, bottomSheet } = useBottomSheet();

  return (
    <>
      <div className="shrink-0 h-[var(--h-topbar)] w-full bg-1 flex px-[var(--px-content)] items-center justify-between">
        {topbar}
        <div className="flex items-center gap-6">
          {buttons}
          <CloseButtonIcon onClick={() => (closeBottomSheet(), bottomSheet.onClose?.())} />
        </div>
      </div>
      <div className={clsx('grow min-h-0 bg-main flex flex-col', horizontalPadding && 'px-[var(--px-content)]')}>
        {content}
      </div>
    </>
  );
}
