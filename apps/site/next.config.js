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
  webpack: (config) => {
    config.externals.push({
      '@aws-sdk/signature-v4-multi-region': 'commonjs @aws-sdk/signature-v4-multi-region',
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
      canvas: 'commonjs canvas',
    });

    config.plugins.push(new CopyPlugin({ patterns: [{ from: 'locales/**', to: '../' }] }));
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
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '*.okampus.fr', port: '', pathname: '**' },
      { protocol: 'https', hostname: 'cdn.discordapp.com', port: '', pathname: '**' },
      { protocol: 'https', hostname: 'media.discordapp.net', port: '', pathname: '**' },
    ],
  },
};

const plugins = [withNx, withPwa];
if (process.env.ANALYZE === 'true') plugins.push(withBundleAnalyzer({ enabled: true }));

module.exports = composePlugins(...plugins)(nextConfig);
