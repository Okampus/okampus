import { isAnyModalOpenAtom, modalsAtom } from '../../_context/global';
import { useAtom } from 'jotai';

import type { ClosableNode } from '../../../types/closable.type';

export function useModal() {
  const [modals, setModals] = useAtom(modalsAtom);
  const [isModalOpen, setIsModalOpen] = useAtom(isAnyModalOpenAtom);

  const openModal = (modal: ClosableNode) => {
    if (modal) {
      setModals([...modals, modal]);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    if (modals.length === 0) return;
    if (modals.length === 1) setIsModalOpen(false);
    setModals(modals.slice(0, -1));
  };

  return { modals, currentModal: modals.at(-1), openModal, closeModal, isModalOpen };
}
