// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
const withPwa = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV !== 'production',
});
const withBundleAnalyzer = require('@next/bundle-analyzer');
const CopyPlugin = require('copy-webpack-plugin');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: { svgr: true },
  swcMinify: true,
  webpack: (config, { isServer, nextRuntime, webpack }) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
      canvas: 'commonjs canvas',
    });

    if (isServer && nextRuntime === 'nodejs')
      config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /^aws-crt$/ }));

    config.plugins.push(new CopyPlugin({ patterns: [{ from: 'public/locales/**', to: '../' }] }));
    return config;
  },
  experimental: {
    esmExternals: false,
    serverActions: true,
    swcPlugins: [['next-superjson-plugin', {}]],
    optimizePackageImports: ['@phosphor-icons/react'],
    outputFileTracingExcludes: {
      '**/*': ['node_modules/@swc/core-linux-x64-gnu', 'node_modules/@swc/core-linux-x64-musl'],
    },
  },
  transpilePackages: ['@phosphor-icons/react'],
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: `*.${process.env.NEXT_PUBLIC_BASE_ENDPOINT}`, port: '', pathname: '**' },
      { protocol: 'https', hostname: 'cdn.discordapp.com', port: '', pathname: '**' },
      { protocol: 'https', hostname: 'media.discordapp.net', port: '', pathname: '**' },
    ],
  },
  unstable_allowDynamic: [
    // TODO: replace jsonwebtoken by jose to avoid this
    '**/node_modules/lodash/_root.js', // use a glob to allow anything in the function-bind 3rd party module
  ],
};

const plugins = [withNx, withPwa];
if (process.env.ANALYZE === 'true') plugins.push(withBundleAnalyzer({ enabled: true }));

module.exports = composePlugins(...plugins)(nextConfig);
