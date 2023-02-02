import { clsx } from 'clsx';
import { NumberBadge } from '@okampus/ui/atoms';
import { useState } from 'react';

type Tab = {
  title: string;
  content: React.ReactNode | React.ReactNode[];
  number?: number;
  noPad?: boolean;
};

type TabsViewProps = {
  tabs: Tab[];
};

export function TabsView({ tabs }: TabsViewProps) {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="flex flex-col h-full w-full gap-2">
      {/* Tabs (header) */}
      <div className="flex">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer ${
              index === activeTab ? 'bg-2' : 'bg-1'
            }`}
            onClick={() => setActiveTab(index)}
          >
            <div className={index === activeTab ? 'text-0' : 'text-1'}>{tab.title}</div>
            {tab.number ? <NumberBadge number={tab.number} /> : ''}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className={clsx('h-full w-full border border-color-3 rounded-lg', tabs[activeTab].noPad ? '' : 'p-6')}>
        {tabs[activeTab].content}
      </div>
    </div>
  );
}
