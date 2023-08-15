import { IconGripVertical, IconX } from '@tabler/icons-react';
import clsx from 'clsx';
import { memo, forwardRef } from 'react';
import type { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from 'react-beautiful-dnd';

export type OptionListItemProps = {
  className?: string;
  draggrableProps?: DraggableProvidedDraggableProps | null;
  handleProps?: DraggableProvidedDragHandleProps | null;
  children: React.ReactNode;
  onDelete?: (() => void) | false | null;
};
export default memo(
  forwardRef<HTMLLIElement, OptionListItemProps>(function OptionListItem(
    { className, draggrableProps, handleProps, children, onDelete }: OptionListItemProps,
    ref,
  ) {
    return (
      <li
        {...draggrableProps}
        className={clsx('p-1 w-full flex items-center z-50 [&:hover>span]:opacity-100', className)}
        ref={ref}
      >
        <span {...handleProps} className="shrink-0 pr-1 flex justify-center items-center cursor-grab opacity-0">
          <IconGripVertical className="h-4 w-4 text-2" />
        </span>
        <div className="flex-1">{children}</div>
        <span className="px-1 flex justify-center items-center">
          {onDelete && <IconX className="h-7 w-7 text-2 self-start p-1 cursor-pointer" onClick={onDelete} />}
        </span>
      </li>
    );
  }),
);
