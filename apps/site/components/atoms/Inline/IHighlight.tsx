import clsx from 'clsx';

export type IHighlightProps = {
  text: string;
  highlight: string;
};

export function IHighlight({ text, highlight }: IHighlightProps) {
  const lower = highlight.toLowerCase();
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span className="inline">
      {parts.map((part, idx) => (
        <span key={idx} className={clsx('inline', part.toLowerCase() === lower ? 'font-semibold' : 'font-normal')}>
          {part}
        </span>
      ))}
    </span>
  );
}
