/* eslint-disable no-lone-blocks */
import { ErrorPage } from '../ErrorPage';

import { TAB_PARAM } from '@okampus/shared/consts';
import { NavigationContext } from '@okampus/ui/hooks';
import { TopbarTabsList } from '@okampus/ui/molecules';

import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type TabMenu<T> = { key: T; element: () => JSX.Element | null; label: React.ReactNode };

type TopbarContentProps<T> = {
  basePath: string;
  topbarPrefix: React.ReactNode;
  selectedTab: string;
  tabs: (TabMenu<T> & { onClick: () => void })[];
};

function TopbarContent<T extends string>({ topbarPrefix, selectedTab, tabs }: TopbarContentProps<T>) {
  return (
    <div className="flex gap-10 items-center">
      {topbarPrefix}
      <TopbarTabsList selected={selectedTab} tabClassName="text-lg" listClassName="shrink-0" tabs={tabs} />
    </div>
  );
}
// const TopbarContentMemo = memo(TopbarContent);

export type TabsTopbarViewProps<T> = { topbarPrefix?: React.ReactNode; basePath: string; menus: TabMenu<T>[] };

export function TabsTopbarView<T extends string>({ basePath, menus, topbarPrefix }: TabsTopbarViewProps<T>) {
  const navigate = useNavigate();
  const params = useParams<{ [TAB_PARAM]: string }>();
  const tab = params[TAB_PARAM];
  const current = tab && menus.some(({ key }) => key === tab) ? tab : menus[0].key;
  if (current !== tab) navigate(`${basePath}/${current}`);

  const { setTopbar, setIsTopbarAlwaysShown } = useContext(NavigationContext);
  const [selectedTab, setSelectedTab] = useState<string>(current);

  const tabs = menus.map((menu) => ({ ...menu, onClick: () => navigate(`${basePath}/${menu.key}`) }));

  useEffect(() => setSelectedTab(current), [current]);
  useEffect(() => {
    setTopbar(<TopbarContent topbarPrefix={topbarPrefix} selectedTab={selectedTab} tabs={tabs} basePath={basePath} />);
    setIsTopbarAlwaysShown(true);
  }, [selectedTab]);

  useEffect(() => () => (setTopbar(null), setIsTopbarAlwaysShown(false)), []);

  const currentTab = tabs.find((tab) => tab.key === selectedTab);
  return currentTab ? <currentTab.element /> : <ErrorPage error="404" />;
}
