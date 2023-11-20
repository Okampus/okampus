import clsx from 'clsx';

export type MobileWrapperProps = {
  className?: string;
  largeContent: React.ReactNode;
  smallContent: React.ReactNode;
};
export default function MobileWrapper({ className, largeContent, smallContent }: MobileWrapperProps) {
  return (
    <>
      <div className={clsx('md-max:hidden', className)}>{largeContent}</div>
      <div className={clsx('md:hidden', className)}>{smallContent}</div>
    </>
  );
}
