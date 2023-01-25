import React from 'react';

export interface NavigationSubMenu {
  label: string;
  icon?: string;
  tip?: string;
}

export interface NavigationMenu {
  label: string;
  tip?: string;
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  sub?: Record<string, NavigationSubMenu>;
}
