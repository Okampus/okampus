import clsx from 'clsx';
import { ReactComponent as ChevronRightFilledIcon } from '@okampus/assets/svg/icons/material/filled/next.svg';
import { Popover, PopoverTrigger, PopoverContent } from '@okampus/ui/atoms';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import type { Placement } from '@floating-ui/react';
import type { MenuProps } from '@okampus/shared/types';

export type MenuButtonProps = {
  children: React.ReactNode;
  triggerOn: 'click' | 'hover';
  menuProps: MenuProps;
  className?: string;
  placement?: Placement;
  placementOffset?: number;
};

export function MenuButton({ children, triggerOn, menuProps, className, placement, placementOffset }: MenuButtonProps) {
  return (
    <Popover
      triggerOn={triggerOn}
      forcePlacement={true}
      placement={placement ?? 'bottom-start'}
      placementOffset={placementOffset ?? 10}
    >
      <PopoverTrigger className={clsx(className)}>{children}</PopoverTrigger>

      <PopoverContent>
        <MenuList {...menuProps} />
      </PopoverContent>
    </Popover>
  );
}

const itemClass =
  'flex items-center justify-between gap-12 w-full text-1 font-semibold text-lg py-3 px-6 bg-4-hover rounded-sm';
export function MenuList({ header, footer, sections, className }: MenuProps) {
  return (
    <div className={clsx('flex flex-col w-fit bg-1 rounded-2xl py-1.5 px-1 overflow-hidden', className)}>
      {header}
      {sections.map((section, idx) => (
        <Fragment key={idx}>
          <ul className={clsx('flex flex-col')}>
            {section.title && (
              <li className="flex gap-3 items-center w-full px-3 py-2 pr-10 label">
                {section.icon}
                <span>{section.title}</span>
              </li>
            )}
            {section.actions.map(({ linkOrActionOrMenu: action, active, iconOrSwitch, label }, idx) => {
              const icon = typeof iconOrSwitch === 'function' ? iconOrSwitch(!!active) : iconOrSwitch;
              return (
                <li key={idx}>
                  {typeof action === 'string' ? (
                    <Link to={action} className={itemClass}>
                      <span className={clsx(icon && 'pr-8')}>{label}</span>
                      {icon && <div className="w-7 aspect-square">{icon}</div>}
                    </Link>
                  ) : typeof action === 'function' ? (
                    <button onClick={action} className={itemClass}>
                      <span className={clsx(icon && 'pr-8')}>{label}</span>
                      {icon && <div className="w-7 aspect-square">{icon}</div>}
                    </button>
                  ) : (
                    <MenuButton
                      className="w-full"
                      placement="right-start"
                      placementOffset={-4}
                      triggerOn="hover"
                      menuProps={action}
                    >
                      <div className={itemClass}>
                        {label}
                        <ChevronRightFilledIcon className="w-7 aspect-square" />
                      </div>
                    </MenuButton>
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
