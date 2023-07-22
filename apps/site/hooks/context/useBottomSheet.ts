import { bottomSheetAtom, isBottomSheetOpenAtom } from '../../context/global';
import { useAtom } from 'jotai';
import type { TReactNode } from '../../context/global';

export function useBottomSheet() {
  const [bottomSheet, setBottomSheet] = useAtom(bottomSheetAtom);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useAtom(isBottomSheetOpenAtom);

  const openBottomSheet = (bottomSheet: TReactNode) => (setBottomSheet(bottomSheet), setIsBottomSheetOpen(true));
  const closeBottomSheet = () => (setBottomSheet(null), setIsBottomSheetOpen(false));

  return { bottomSheet, openBottomSheet, closeBottomSheet, isBottomSheetOpen };
}
