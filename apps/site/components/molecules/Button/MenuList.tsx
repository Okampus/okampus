import GroupHeading from '../../atoms/Heading/GroupHeading';
import Popover from '../../atoms/Popup/Popover/Popover';
import PopoverContent from '../../atoms/Popup/Popover/PopoverContent';
import PopoverTrigger from '../../atoms/Popup/Popover/PopoverTrigger';

import { IconChevronRight } from '@tabler/icons-react';

import clsx from 'clsx';
import Link from 'next/link';
import { Fragment } from 'react';
import type { MenuProps } from '@okampus/shared/types';

const itemClass = 'flex items-center justify-between gap-6 w-full text-1 font-semibold py-3 px-6 bg-4-hover rounded-sm';
export default function MenuList({ header, footer, sections, className }: MenuProps) {
  return (
    <div className={clsx('flex flex-col rounded-lg w-fit bg-2 overflow-hidden', className)}>
      {header}
      {sections.map((section, idx) => (
        <Fragment key={idx}>
          <ul className={clsx('flex flex-col')}>
            {section.title && <GroupHeading label={section.title} icon={section.icon} />}
            {section.actions.map(({ linkOrActionOrMenu: action, active, iconOrSwitch, label }, idx) => {
              const icon = typeof iconOrSwitch === 'function' ? iconOrSwitch(!!active) : iconOrSwitch;
              return (
                <li key={idx}>
                  {typeof action === 'string' ? (
                    <Link href={action} className={itemClass}>
                      <span className={clsx(icon && 'pr-8')}>{label}</span>
                      {icon && <div className="w-7 aspect-square">{icon}</div>}
                    </Link>
                  ) : typeof action === 'function' ? (
                    <button onClick={action} className={itemClass}>
                      <span className={clsx(icon && 'pr-8')}>{label}</span>
                      {icon && <div className="w-7 aspect-square">{icon}</div>}
                    </button>
                  ) : (
                    <Popover triggerOn="hover" forcePlacement={true} placement="right-start" placementOffset={-4}>
                      <PopoverTrigger className="w-full">
                        <div className={itemClass}>
                          {label}
                          <IconChevronRight className="w-7 aspect-square" />
                        </div>
                      </PopoverTrigger>

                      <PopoverContent>
                        <MenuList {...action} />
                      </PopoverContent>
                    </Popover>
                  )}
                </li>
              );
            })}
          </ul>
          {idx !== sections.length - 1 && <hr className="border-color-1 my-1" />}
        </Fragment>
      ))}
      {footer}
    </div>
  );
}
