import { bottomSheetAtom, isBottomSheetOpenAtom } from '../../_context/global';
import { useAtom } from 'jotai';
import type { ClosableNode } from '../../../types/closable.type';

export function useBottomSheet() {
  const [bottomSheet, setBottomSheet] = useAtom(bottomSheetAtom);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useAtom(isBottomSheetOpenAtom);

  const openBottomSheet = (bottomSheet: ClosableNode) => (setBottomSheet(bottomSheet), setIsBottomSheetOpen(true));
  const closeBottomSheet = () => (setBottomSheet({ node: null }), setIsBottomSheetOpen(false));

  return { bottomSheet, openBottomSheet, closeBottomSheet, isBottomSheetOpen };
}
