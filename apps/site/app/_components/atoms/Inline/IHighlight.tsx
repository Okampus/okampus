import clsx from 'clsx';

export type IHighlightProps = {
  className?: string;
  text: string;
  highlight: string;
};

export default function IHighlight({ className, text, highlight }: IHighlightProps) {
  const lower = highlight.toLowerCase();
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span className={clsx('inline', className)}>
      {parts.map((part, idx) => (
        <span key={idx} className={clsx('inline', part.toLowerCase() === lower ? 'font-medium' : 'font-normal')}>
          {part}
        </span>
      ))}
    </span>
  );
}
