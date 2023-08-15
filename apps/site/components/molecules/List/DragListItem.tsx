import { IconGripVertical, IconTrash } from '@tabler/icons-react';
import clsx from 'clsx';
import { memo, forwardRef } from 'react';
import type { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from 'react-beautiful-dnd';

export type DragListItemProps = {
  className?: string;
  draggrableProps?: DraggableProvidedDraggableProps | null;
  handleProps?: DraggableProvidedDragHandleProps | null;
  children: React.ReactNode;
  onDelete?: () => void;
};
export default memo(
  forwardRef<HTMLLIElement, DragListItemProps>(function DragListItem(
    { className, draggrableProps, handleProps, children, onDelete }: DragListItemProps,
    ref,
  ) {
    return (
      <li {...draggrableProps} className="w-full md:rounded-2xl bg-1 mb-5 flex gap-4 items-stretch z-50" ref={ref}>
        <span {...handleProps} className="pl-2.5 flex justify-center items-center cursor-grab">
          <IconGripVertical className="h-4 w-4 text-2" />
        </span>
        <div className={clsx('w-full grow min-w-0 py-6', className)}>{children}</div>
        {onDelete ? (
          <span className="pl-1 pr-5 pt-6 flex">
            <IconTrash className="h-7 w-7 text-2 self-start p-0.5 cursor-pointer" onClick={onDelete} />
          </span>
        ) : (
          <span className="ml-5 mt-6 h-8 w-8" />
        )}
      </li>
    );
  }),
);
