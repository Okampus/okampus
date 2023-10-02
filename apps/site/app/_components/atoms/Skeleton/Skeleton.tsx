import './Skeleton.scss';
import clsx from 'clsx';

export default function Skeleton(props: React.HTMLProps<HTMLDivElement>) {
  return <div className={clsx('skeleton-loader', props.className)} style={props.style} />;
}
