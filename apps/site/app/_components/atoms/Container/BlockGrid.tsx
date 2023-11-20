import { Block } from './Block';
import clsx from 'clsx';

import type { BlockProps } from './Block';

export type BlockGridProps = {
  blocks: BlockProps[];
  className?: string;
};

export default function BlockGrid({ blocks, className }: BlockGridProps) {
  return (
    <div
      className={clsx('grid lg-max:!grid-cols-2 gap-6', className)}
      style={{
        gridTemplateColumns: `repeat(${blocks.length > 6 ? 4 : blocks.length}, minmax(6rem, 1fr))`,
      }}
    >
      {blocks.map((block) => (
        <Block key={block.title} title={block.title} disabled={block.disabled}>
          {block.children}
        </Block>
      ))}
    </div>
  );
}
