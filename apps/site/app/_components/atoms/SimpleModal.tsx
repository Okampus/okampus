import CloseButtonIcon from './Icon/CloseButtonIcon';

type SimpleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function SimpleModal({ isOpen, onClose, children }: SimpleModalProps) {
  return (
    <div
      className="fixed flex items-center justify-center z-[-1] w-screen h-screen bg-[#000000bb] overflow-scroll"
      onClick={onClose}
    >
      <div className="bg-2 relative p-8">
        <CloseButtonIcon className="absolute right-4 top-4" onClick={onClose} />
        {children}
      </div>
    </div>
  );
}
