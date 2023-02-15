import { ReactComponent as InstagramIcon } from '@okampus/assets/svg/brands/instagram.svg';
import { clsx } from 'clsx';

export type InstagramCardProps = {
  className?: string;
  name?: string;
  slug?: string;
};

export function InstagramCard({ className, name, slug }: InstagramCardProps) {
  return (
    <div className={clsx('card-sm bg-1 flex flex-col gap-2', className)}>
      <div className="flex gap-2 items-center">
        <InstagramIcon className="h-4 rounded-[50%]" />
        <div className="text-2 opacity-70 text-sm">Instagram</div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-0 opacity-90 font-title font-medium">
          {name} (@{slug})
        </div>
        <div className="text-2 text-sm line-clamp-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
        <div className="font-heading">
          <div className="text-2 text-sm line-clamp-1">12 posts</div>
          <div className="text-2 text-sm line-clamp-1">240 followers</div>
          <div className="text-2 text-sm line-clamp-1"></div>
        </div>
      </div>
    </div>
  );
}
