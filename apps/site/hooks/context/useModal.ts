import { isModalOpenAtom, modalsAtom } from '../../context/global';
import { useAtom } from 'jotai';

import type { TReactNode } from '../../context/global';

export function useModal() {
  const [modals, setModals] = useAtom(modalsAtom);
  const [isModalOpen, setIsModalOpen] = useAtom(isModalOpenAtom);

  const openModal = (modal: TReactNode) => {
    if (modal) {
      setModals([...modals, modal]);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    if (modals.length === 0) return;
    if (modals.length === 1) return setIsModalOpen(false);
    setModals(modals.slice(0, -1));
  };

  return { modals, currentModal: modals.at(-1), openModal, closeModal, isModalOpen };
}
