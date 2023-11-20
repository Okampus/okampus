export type ITextProps = {
  className?: string;
  text: string;
};

export default function IText({ className = 'paragraph', text }: ITextProps) {
  return <p className={className}>{text}</p>;
}
