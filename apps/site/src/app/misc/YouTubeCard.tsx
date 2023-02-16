import { ReactComponent as YouTubeIcon } from '@okampus/assets/svg/brands/youtube.svg';
import { ReactComponent as PlayIcon } from '@okampus/assets/svg/icons/play.svg';
import { clsx } from 'clsx';

export type YouTubeCardProps = {
  className?: string;
  name?: string;
  slug?: string;
};

export function YouTubeCard({ className, name, slug }: YouTubeCardProps) {
  return (
    <div className={clsx('card-sm !p-0 bg-2', className)}>
      <div className="h-[40%] relative">
        <PlayIcon className="text-white absolute translate top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] h-10 w-10 p-2 rounded-[50%] bg-black opacity-70 flex items-center justify-center" />
        <div className="absolute bottom-2 left-4 rounded-full px-2 text-white opacity-80 bg-black text-sm">12:08</div>
        <img src="https://loremflickr.com/800/400/video" className="h-full w-full object-cover" alt="" />
      </div>
      <div className="p-3 flex flex-col gap-2.5">
        <div className="flex gap-2 items-center">
          <YouTubeIcon className="h-4 rounded-[50%]" />
          <div className="text-2 opacity-70 text-sm">YouTube - {slug}</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-0 opacity-90 line-clamp-2 font-title font-medium">
            Phasellus quis semper dolor, id tincidunt leo. Curabitur aliquam libero ipsum, sed sagittis neque fermentum
            non.
          </div>
          <div className="line-clamp-3 text-sm text-2">
            Maecenas scelerisque non diam in interdum. Pellentesque vel neque quis mi tempus congue. Nunc vestibulum
            libero id molestie iaculis. Donec iaculis venenatis nibh, non aliquet ipsum molestie ac. Mauris faucibus est
            ut faucibus pulvinar. Praesent pulvinar ligula a orci interdum, sit amet dignissim est ornare. Ut maximus
            varius lacinia.
          </div>
        </div>
      </div>
    </div>
  );
}
