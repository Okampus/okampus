import { ReactComponent as CheckFilledIcon } from '@okampus/assets/svg/icons/material/filled/check-circle.svg';
import type { FinanceBaseInfo } from '@okampus/shared/graphql';

export type FinanceHistoryListProps = {
  finance: FinanceBaseInfo;
};

export function FinanceHistoryList({ finance }: FinanceHistoryListProps) {
  // const { data } = useTypedQuery({
  //   financeEdit: [{ where: { financeId: { _eq: finance.id as string } } }],
  // });

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="flex gap-4">
        <CheckFilledIcon className="w-6 h-6 text-green-500" />
        <div className="text-1">
          Créé par {finance.individual?.actor?.name} le {new Date(finance.createdAt as string).toLocaleDateString()}
        </div>
        {/* {data?.financeEdit.map((edit) => (
          <div>{edit.amount}</div>
        ))} */}
      </div>
    </div>
  );
}
