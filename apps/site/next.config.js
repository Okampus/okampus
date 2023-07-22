//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: { svgr: true },
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'fr',
    localeDetection: false,
  },
  webpack: (config) => {
    config.optimization.minimize = false;
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
      canvas: 'commonjs canvas',
    });

    return config;
  },
  experimental: { esmExternals: false, serverActions: true },
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '*.okampus.fr', port: '', pathname: '**' },
      { protocol: 'https', hostname: 'cdn.discordapp.com', port: '', pathname: '**' },
      { protocol: 'https', hostname: 'media.discordapp.net', port: '', pathname: '**' },
    ],
  },
  modularizeImports: { '@tabler/icons-react': { transform: '@tabler/icons-react/dist/esm/icons/{{member}}' } },
  transpilePackages: ['@tabler/icons-react'],
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
