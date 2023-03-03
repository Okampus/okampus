import { NumberBadge, TabButton } from '@okampus/ui/atoms';
import { useState } from 'react';

type Tab = {
  title: string;
  content: React.ReactNode | React.ReactNode[];
  number?: number;
  noPad?: boolean;
};

type TabsViewProps = {
  tabs: Tab[];
  tabColor?: string;
};

export function TabsView({ tabs, tabColor }: TabsViewProps) {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="flex flex-col h-full w-full gap-10">
      {/* Tabs (header) */}
      <div className="flex gap-2">
        {tabs.map((tab, index) => (
          <TabButton
            key={index}
            backgroundColor={tabColor}
            onClick={() => setActiveTab(index)}
            active={index === activeTab}
          >
            {tab.title}
            {tab.number ? <NumberBadge number={tab.number} /> : ''}
          </TabButton>
        ))}
      </div>

      {/* Content */}
      <div>{tabs[activeTab].content}</div>
    </div>
  );
}
