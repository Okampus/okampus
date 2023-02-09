import React from 'react';
import { motion } from 'framer-motion';

import type { Transition, Variants } from 'framer-motion';

const transition: Transition = { type: 'spring', stiffness: 100, duration: 0.2 };

const svgVariants: Variants = {
  dark: {
    rotate: 40,
  },
  light: {
    rotate: 90,
  },
};

const maskVariants: Variants = {
  dark: {
    cx: '50%',
    cy: '23%',
  },
  light: {
    cx: '100%',
    cy: '0%',
  },
};

const circleVariants: Variants = {
  dark: {
    r: 9,
  },
  light: {
    r: 5,
  },
};

const linesVariants: Variants = {
  dark: {
    opacity: 0,
  },
  light: {
    opacity: 1,
  },
};

export const defaultProperties = {
  dark: {
    circle: {
      r: 9,
    },
    mask: {
      cx: '50%',
      cy: '23%',
    },
    svg: {
      transform: 'rotate(40deg)',
    },
    lines: {
      opacity: 0,
    },
  },
  light: {
    circle: {
      r: 5,
    },
    mask: {
      cx: '100%',
      cy: '0%',
    },
    svg: {
      transform: 'rotate(90deg)',
    },
    lines: {
      opacity: 1,
    },
  },
  springConfig: { mass: 4, tension: 250, friction: 35 },
};

type SVGProps = Omit<React.HTMLAttributes<HTMLOrSVGElement>, 'onChange'>;
export interface Props extends SVGProps {
  onChange: (checked: boolean) => void;
  checked: boolean;
  style?: React.CSSProperties;
  size?: number | string;
  animationProperties?: typeof defaultProperties;
  moonColor?: string;
  sunColor?: string;
  className?: string;
}

export const DarkModeToggle: React.FC<Props> = ({
  onChange,
  checked = false,
  size = 24,
  moonColor = 'white',
  sunColor = 'black',
  style,
  className,
}) => {
  const animate = checked ? 'dark' : 'light';

  const toggle = () => {
    onChange(!checked);
  };

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      color={checked ? moonColor : sunColor}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={toggle}
      animate={animate}
      transition={transition}
      variants={svgVariants}
      style={{
        cursor: 'pointer',
        ...style,
      }}
      className={className}
    >
      <mask id="dark-mode-toggle">
        <rect x="0" y="0" width="100%" height="100%" fill="white" />
        <motion.circle animate={animate} variants={maskVariants} transition={transition} r="9" fill="black" />
      </mask>

      <motion.circle
        cx="12"
        cy="12"
        fill={checked ? moonColor : sunColor}
        animate={animate}
        transition={transition}
        variants={circleVariants}
        mask={`url(#dark-mode-toggle)`}
      />
      <motion.g
        stroke="currentColor"
        animate={animate}
        transition={transition}
        variants={linesVariants}
        strokeWidth="1.5"
      >
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </motion.g>
    </motion.svg>
  );
};
