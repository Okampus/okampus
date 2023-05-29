import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { createRef, useCallback, useEffect, useState } from 'react';

export type TabsListProps = {
  selected: string | number;
  tabClassName?: string;
  listClassName?: string;
  tabs: { key: string | number; label: React.ReactNode; onClick: (tab: string | number) => void }[];
  isSmall?: boolean;
};

type UnderlineRefs = Record<string, React.RefObject<HTMLLIElement>>;
function Underline({ refs, selected }: { refs: UnderlineRefs; selected: string | number }) {
  const [{ x, width }, setAttributes] = useState({ x: 0, width: 0 });

  const updateAttributes = useCallback(() => {
    const currentRef = refs[selected].current;
    if (!currentRef) return;
    setAttributes({ x: currentRef.offsetLeft, width: currentRef.getBoundingClientRect().width });
  }, [selected, refs]);

  useEffect(() => {
    updateAttributes();
    window.addEventListener('resize', updateAttributes);
    return () => window.removeEventListener('resize', updateAttributes);
  }, [updateAttributes]);

  return (
    <motion.div
      className={clsx('absolute bottom-0 left-0 bg-primary h-1')}
      style={{ x, width }}
      initial={{ x, width }}
      animate={{ x, width }}
      transition={{ type: 'spring', stiffness: 500, damping: 50 }}
    />
  );
}

export function TabsList({ selected, tabClassName, listClassName, tabs }: TabsListProps) {
  const tabRefs: Record<string, React.RefObject<HTMLLIElement>> = {};
  for (const tab of tabs) tabRefs[tab.key] = createRef();

  return (
    <div className="overflow-scroll scrollbar w-full border-b border-color-2 px-content">
      <div className="relative">
        <ul className={clsx('flex gap-12', listClassName)}>
          {tabs.map(({ key, label, onClick }) => (
            <li
              key={key}
              ref={tabRefs[key]}
              className={clsx(
                tabClassName,
                key === selected ? 'text-0' : 'text-3',
                'cursor-pointer whitespace-nowrap font-semibold pb-5 text-center'
              )}
              onClick={() => onClick(key)}
            >
              {label}
            </li>
          ))}
        </ul>
        {/* A line that animates between the currently active tab and hovered/selected ones */}
        <Underline refs={tabRefs} selected={selected} />
      </div>
    </div>
  );
}
