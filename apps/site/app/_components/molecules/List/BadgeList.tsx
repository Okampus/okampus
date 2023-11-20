'use client';

import OverflowList from './OverflowList';
import TextBadge from '../../atoms/Badge/TextBadge';

import type { TextBadgeProps } from '../../atoms/Badge/TextBadge';

export type BadgeListProps = { badges: TextBadgeProps[] };
export default function BadgeList({ badges }: BadgeListProps) {
  return <OverflowList items={badges} itemRenderer={TextBadge} />;
}
