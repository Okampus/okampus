import { CollapsibleItem } from '@okampus/ui/molecules';
import { FinanceDashboard } from '#site/app/components/Dashboard/FinanceDashboard';
import { formatCurrency, sum } from '@okampus/shared/utils';
import { useState } from 'react';
import clsx from 'clsx';

import type { EventBaseInfo, ProjectWithFinanceInfo, TeamFinanceBaseInfo } from '@okampus/shared/graphql';

type GroupByFinances = [
  TeamFinanceBaseInfo[],
  Record<string, [TeamFinanceBaseInfo[], EventBaseInfo, number, number | null]>
];
function projectFinancesGroupByEvent(project: ProjectWithFinanceInfo): GroupByFinances {
  const otherFinances: TeamFinanceBaseInfo[] = [];
  const eventsFinances: Record<string, [TeamFinanceBaseInfo[], EventBaseInfo, number, number | null]> = {};
  // for (const event of project.events) {
  for (const finance of project.teamFinances) {
    const eventId = finance.event?.id as string;
    if (eventId) {
      if (!eventsFinances[eventId]) {
        const event = project.events.find((e) => e.id === eventId);
        eventsFinances[eventId] = [
          [],
          finance.event as EventBaseInfo,
          event?.teamFinancesAggregate.aggregate?.sum?.amount || 0,
          event?.budget ?? null,
        ];
      }
      eventsFinances[eventId][0].push(finance);
    } else {
      otherFinances.push(finance);
    }
  }

  return [otherFinances, eventsFinances];
}

const OTHER = 'other';

const toggle = (id: string) => (openEvents: string[]) => {
  if (openEvents.includes(id)) return openEvents.filter((eventId) => eventId !== id);
  return [...openEvents, id];
};

export type TreasuryManageProjectViewProps = { project?: ProjectWithFinanceInfo };
export function TreasuryManageProjectView({ project }: TreasuryManageProjectViewProps) {
  const [openEvents, setOpenEvents] = useState<string[]>([]);

  if (!project) return null;
  const [otherFinances, eventsFinances] = projectFinancesGroupByEvent(project);
  const otherFinancesSpending = sum(otherFinances.map((value) => value.amount));
  const totalEventBudget = sum(Object.values(eventsFinances).map((value) => value[3] ?? 0));
  const otherFinancesBudget = project.expectedBudget - totalEventBudget;

  return (
    <div>
      {/* <Link to={PROJECT_ROUTE(project.slug)} className="title"> */}
      <div className="px-12 text-4xl text-0 font-bold mt-6 mb-8">Projet : {project.name}</div>
      {/* </Link> */}

      <div className="flex gap-2 justify-end">
        <div className="text-center py-3 w-36 text-2 font-semibold">Budget</div>
        <div className="text-center py-3 w-36 text-2 font-semibold">Budget restant</div>
        <div className="text-center py-3 w-36 text-2 font-semibold">Dépenses réelles</div>
      </div>

      <CollapsibleItem
        className="pl-6"
        disabled={otherFinances.length === 0}
        open={openEvents.includes(OTHER)}
        onToggle={() => setOpenEvents(toggle(OTHER))}
        title={
          <div className="w-full flex items-center justify-between">
            <div className="text-0 font-semibold text-lg">
              {/* <Link
                      to={EVENT_ROUTE(eventInfo?.contentMaster?.slug)}
                      className="text-blue-400 cursor-pointer hover:underline"
                    > */}
              Autres dépenses
              {/* </Link> */}
            </div>
            <div className="flex gap-2">
              <div className="dark:bg-gray-800 bg-gray-200 text-center py-3 w-36 text-1 font-medium text-[1.05rem]">
                {/* <TextFinance amount={otherFinancesBudget} /> */}
                {formatCurrency(otherFinancesBudget)}
              </div>
              <div
                className={clsx(
                  project.expectedBudget + project.actualBudget
                    ? 'dark:bg-green-800 bg-green-200'
                    : 'dark:bg-red-800 bg-red-200',
                  'dark:bg-gray-800 bg-gray-200 text-center py-3 w-36 text-1 font-medium text-[1.05rem]'
                )}
              >
                {/* <TextFinance amount={otherFinancesBudget - otherFinancesSpending} /> */}
                {formatCurrency(otherFinancesBudget - otherFinancesSpending)}
              </div>
              <div className="dark:bg-gray-800 bg-gray-200 text-center py-3 w-36 text-1 font-medium text-[1.05rem]">
                {/* <TextFinance amount={otherFinancesSpending} /> */}
                {formatCurrency(otherFinancesSpending)}
              </div>
            </div>
          </div>
        }
        content={<FinanceDashboard finances={otherFinances} />}
      />
      {Object.entries(eventsFinances).map(
        ([eventId, [finances, eventInfo, eventTotal, budget]]) =>
          finances.length > 0 && (
            <CollapsibleItem
              key={eventId}
              className="pl-6"
              disabled={finances.length === 0}
              open={openEvents.includes(eventId)}
              onToggle={() => setOpenEvents(toggle(eventId))}
              title={
                <div className="w-full flex items-center justify-between">
                  <div className="text-0 font-semibold text-lg">
                    {/* <Link
                      to={EVENT_ROUTE(eventInfo?.contentMaster?.slug)}
                      className="text-blue-400 cursor-pointer hover:underline"
                    > */}
                    {eventInfo?.contentMaster?.name}
                    {/* </Link> */}
                  </div>
                  <div className="flex gap-2">
                    {budget && (
                      <>
                        <div className="dark:bg-gray-800 bg-gray-200 text-center py-3 w-36 text-1 font-medium text-[1.05rem]">
                          {/* <TextFinance amount={budget} /> */}
                          {formatCurrency(budget)}
                        </div>
                        <div
                          className={clsx(
                            budget + eventTotal > 0 ? 'dark:bg-green-800 bg-green-200' : 'dark:bg-red-800 bg-red-200',
                            'text-center py-3 w-36 text-1 font-medium text-[1.05rem]'
                          )}
                        >
                          {/* <TextFinance amount={budget - eventTotal} /> */}
                          {formatCurrency(budget + eventTotal)}
                        </div>
                      </>
                    )}
                    <div className="dark:bg-gray-800 bg-gray-200 text-center py-3 w-36 text-1 font-medium text-[1.05rem]">
                      {/* <TextFinance amount={eventTotal} /> */}
                      {formatCurrency(eventTotal)}
                    </div>
                  </div>
                </div>
              }
              content={<FinanceDashboard finances={finances} />}
            />
            // <div key={event} className="flex flex-col mt-6 gap-2">

            // </div>
          )
      )}
      <hr className="border-color-3 my-4 bg-2" />
      <div className="flex justify-between w-full pl-6 py-3">
        <div className="text-2 tracking-wider uppercase font-medium">Total</div>
        <div className="flex gap-2">
          <div className="dark:bg-gray-800 bg-gray-200 text-center py-3 w-36 text-1 font-medium text-[1.05rem]">
            {/* <TextFinance amount={project.expectedBudget} textClass="text-white" /> */}
            {formatCurrency(project.expectedBudget)}
          </div>
          <div
            className={clsx(
              project.expectedBudget + project.actualBudget > 0
                ? 'dark:bg-green-800 bg-green-200'
                : 'dark:bg-red-800 bg-red-200',
              'dark:bg-gray-800 bg-gray-200 text-center py-3 w-36 text-1 font-medium text-[1.05rem]'
            )}
          >
            {formatCurrency(project.expectedBudget + project.actualBudget)}
            {/* <TextFinance amount={project.expectedBudget - project.actualBudget} textClass="text-white" /> */}
          </div>
          <div className="dark:bg-gray-800 bg-gray-200 text-center py-3 w-36 text-1 font-medium text-[1.05rem]">
            {formatCurrency(project.actualBudget)}
            {/* <TextFinance amount={project.actualBudget} textClass="text-white" /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
