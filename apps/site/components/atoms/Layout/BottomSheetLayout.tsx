import { useBottomSheet } from '../../../hooks/context/useBottomSheet';
import CloseButtonIcon from '../Icon/CloseButtonIcon';

export type BottomSheetLayoutProps = {
  topbar?: React.ReactNode;
  buttons?: React.ReactNode;
  content: React.ReactNode;
};

export default function BottomSheetLayout({ topbar, buttons, content }: BottomSheetLayoutProps) {
  const { closeBottomSheet } = useBottomSheet();

  return (
    <>
      <div className="shrink-0 h-[var(--h-topbar)] w-full bg-1 flex px-[var(--px-content)] items-center justify-between">
        {topbar}
        <div className="flex items-center gap-6">
          {buttons}
          <CloseButtonIcon onClick={closeBottomSheet} />
        </div>
      </div>
      <div className="grow min-h-0 bg-main flex flex-col">{content}</div>
    </>
  );
}
