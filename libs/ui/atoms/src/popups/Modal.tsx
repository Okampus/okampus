// import { useContext } from 'react';
// import { NavigationContext } from '../../../../../apps/site/src/app/context/NavigationContext';
import { ReactComponent as CloseIcon } from '@okampus/assets/svg/icons/close.svg';
import { motion } from 'framer-motion';
import { fuseClasses } from '@okampus/shared/utils';

type SideModalProps = {
  title?: string;
  children: React.ReactNode | React.ReactNode[];
  onHide?: () => void;
};
export function Modal({ title, children, onHide }: SideModalProps) {
  // const { hideModal } = useContext(NavigationContext);
  return (
    <motion.div
      className="bg-2 text-2 rounded-lg z-[101] p-6 flex flex-col gap-6 min-w-[24rem] max-h-full overflow-scroll app-scrollbar"
      onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ ease: 'easeInOut', duration: 0.2 }}
    >
      {/* <div className="p-6 h-full w-96 bg-blue-500 z-[101] rounded-l-lg gap-8 flex flex-col">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-medium">Créer un événement</span>
          <button onClick={hideModal}>
            <CloseIcon height={36} />
          </button>
        </div> */}
      <div className={fuseClasses('flex items-center w-full gap-10', title ? 'justify-between' : 'justify-end')}>
        {title && (
          <span className="text-2xl font-medium text-0 flex gap-2 items-center">
            {title}
            <img
              className="w-9 h-9 rounded-[50%]"
              src="https://cdn.discordapp.com/icons/827518251608178728/3f066f2e311cac3391786c1b1872adc7.webp?size=96"
            />
          </span>
        )}
        <button onClick={onHide}>
          <CloseIcon height={36} />
        </button>
      </div>
      <div className="text-base">{children}</div>
      {/* </div> */}
    </motion.div>
  );
}
