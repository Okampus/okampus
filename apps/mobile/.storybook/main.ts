import { rootMain } from '../../../.storybook/main';

import type { StorybookConfig } from '@storybook/core-common';

const config: StorybookConfig = {
  ...rootMain,
  core: { ...rootMain.core, builder: '@storybook/builder-vite' },
  stories: [...rootMain.stories, '../src/app/**/*.stories.mdx', '../src/app/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    ...(rootMain.addons || []),
    '@storybook/addon-ondevice-actions',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-notes',
  ],
};

module.exports = config;
