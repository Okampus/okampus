import { ReactComponent as CheckFilledIcon } from '@okampus/assets/svg/icons/material/filled/check-circle.svg';
import type { TeamFinanceBaseInfo } from '@okampus/shared/graphql';

export type TeamFInanceHistoryListProps = {
  teamFinance: TeamFinanceBaseInfo;
};

export function TeamFinanceHistoryList({ teamFinance }: TeamFInanceHistoryListProps) {
  // const { data } = useTypedQuery({
  //   teamFinanceEdit: [{ where: { teamFinanceId: { _eq: teamFinance.id as string } } }],
  // });

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="flex gap-4">
        <CheckFilledIcon className="w-6 h-6 text-green-500" />
        <div className="text-1">
          Créé par {teamFinance.individual?.actor?.name} le{' '}
          {new Date(teamFinance.createdAt as string).toLocaleDateString()}
        </div>
        {/* {data?.teamFinanceEdit.map((edit) => (
          <div>{edit.amount}</div>
        ))} */}
      </div>
    </div>
  );
}
