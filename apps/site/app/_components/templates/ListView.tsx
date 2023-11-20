import { SkeletonItems } from '../atoms/Skeleton/SkeletonItems';

export type ListViewProps<T> = {
  data: T[] | undefined;
  loading?: boolean;
  render: (data: T) => React.ReactNode;
  className?: string;
  innerWrapper?: ({ children, className }: { children: React.ReactNode; className?: string }) => React.ReactNode;
  skeleton?: React.ReactNode;
  emptyState: React.ReactNode;
};
export default function ListView<T>({
  data,
  className,
  emptyState,
  loading,
  render,
  innerWrapper,
  skeleton = <SkeletonItems />,
}: ListViewProps<T>) {
  if (!loading && (!data || (Array.isArray(data) && data.length === 0))) return emptyState;
  const inner = loading ? skeleton : data ? data.map(render) : loading;
  return innerWrapper ? innerWrapper({ children: inner, className }) : <div className={className}>{inner}</div>;
}
