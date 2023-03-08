import { GradientDark, GradientTransparent, Skeleton } from '@okampus/ui/atoms';
import { motion } from 'framer-motion';

export function ProfileSkeleton() {
  return (
    <motion.div className="flex flex-col" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="p-view flex gap-8 items-end relative">
        <GradientDark className="absolute inset-0">
          <div className="absolute inset-0" style={{ backgroundColor: 'var(--bg-0)' }} />
        </GradientDark>
        <Skeleton rounded="8%" width={82} height={82} className="z-10 shrink-0" />
        <div className="z-10 py-3 w-full">
          <Skeleton width={32} height={10} />
          <Skeleton width="full" height={32} />
          <Skeleton width="full" height={12} />
        </div>
      </div>
      <div className="relative">
        <GradientTransparent className="absolute top-0 left-0 w-full h-72">
          <div className="absolute inset-0" style={{ backgroundColor: 'var(--bg-0)' }} />
        </GradientTransparent>
      </div>
    </motion.div>
  );
}
