import GroupHeading from '../../atoms/Heading/GroupHeading';
import Popover from '../../atoms/Popup/Popover/Popover';
import PopoverContent from '../../atoms/Popup/Popover/PopoverContent';
import PopoverTrigger from '../../atoms/Popup/Popover/PopoverTrigger';

import { CaretRight } from '@phosphor-icons/react/dist/ssr';

import clsx from 'clsx';
import Link from 'next/link';
import { Fragment } from 'react';
import type { MenuProps } from '@okampus/shared/types';

const itemClass =
  'flex items-center justify-between gap-6 w-[calc(100%-1rem)] text-1 font-medium py-2 mx-2 px-3 bg-2-hover rounded-md';
export default function MenuList({ header, footer, sections, className }: MenuProps) {
  return (
    <div
      className={clsx(
        'flex flex-col rounded-xl w-fit bg-main border border-[var(--border-2)] overflow-hidden',
        className,
      )}
    >
      {header}
      {sections.map((section, idx) => (
        <Fragment key={idx}>
          <ul className="flex flex-col my-3 gap-1.5">
            {section.title && <GroupHeading label={section.title} icon={section.icon} />}
            {section.actions.map(({ linkOrActionOrMenu: action, active, iconOrSwitch, label }, idx) => {
              const icon = typeof iconOrSwitch === 'function' ? iconOrSwitch(!!active) : iconOrSwitch;
              return (
                <li key={idx}>
                  {typeof action === 'string' ? (
                    <Link href={action} className={itemClass}>
                      <span className={clsx(icon && 'pr-8')}>{label}</span>
                      {icon && <div className="w-6 h-6">{icon}</div>}
                    </Link>
                  ) : typeof action === 'function' ? (
                    <button onClick={action} className={itemClass}>
                      <span className={clsx(icon && 'pr-8')}>{label}</span>
                      {icon && <div className="w-6 h-6">{icon}</div>}
                    </button>
                  ) : typeof action === 'object' ? (
                    <Popover triggerOn="hover" forcePlacement={true} placement="right-start" placementOffset={-4}>
                      <PopoverTrigger className="w-full">
                        <div className={itemClass}>
                          {label}
                          <CaretRight className="w-6 h-6" />
                        </div>
                      </PopoverTrigger>

                      <PopoverContent>
                        <MenuList {...action} />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className={clsx(icon && 'pr-8')}>{label}</span>
                      {icon && <div className="w-6 h-6">{icon}</div>}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          {idx !== sections.length - 1 && <hr className="border-[var(--border-1)] my-1" />}
        </Fragment>
      ))}
      {footer}
    </div>
  );
}
