import { SkeletonItems } from '../atoms/Skeleton/SkeletonItems';

export type ContentLayoutProps<T> = {
  data: T | undefined;
  loading: boolean;
  render: ({ data }: { data: T }) => React.ReactNode;
  innerWrapper?: ({ children }: { children: React.ReactNode }) => React.ReactNode;
  skeleton?: React.ReactNode;
  emptyState: React.ReactNode;
};
export default function ContentLayout<T>({
  data,
  emptyState,
  loading,
  render,
  innerWrapper,
  skeleton = <SkeletonItems />,
}: ContentLayoutProps<T>) {
  if (!loading && (!data || (Array.isArray(data) && data.length === 0))) return emptyState;
  const inner = loading ? skeleton : data ? render({ data }) : loading;
  return innerWrapper ? innerWrapper({ children: inner }) : inner;
}
