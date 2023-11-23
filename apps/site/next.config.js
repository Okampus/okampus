// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
const withPwa = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV !== 'production',
});
const CopyPlugin = require('copy-webpack-plugin');

const withBundleAnalyzer = require('@next/bundle-analyzer');
const withNextIntl = require('next-intl/plugin')();

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = withNextIntl({
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
    optimizePackageImports: ['@phosphor-icons/react'],
    outputFileTracingExcludes: {
      '**/*': ['node_modules/@swc/core-linux-x64-gnu', 'node_modules/@swc/core-linux-x64-musl'],
    },
    serverActions: { allowedOrigins: ['localhost', 'demo.localhost:3000'] },
  },
  headers: () => [{ source: '/', headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }] }],
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: `*.${process.env.NEXT_PUBLIC_BASE_ENDPOINT}`, port: '', pathname: '**' },
      { protocol: 'https', hostname: 'cdn.discordapp.com', port: '', pathname: '**' },
      { protocol: 'https', hostname: 'media.discordapp.net', port: '', pathname: '**' },
    ],
  },
});

const plugins = [withNx, withPwa];
if (process.env.ANALYZE === 'true') plugins.push(withBundleAnalyzer({ enabled: true }));

module.exports = composePlugins(...plugins)(nextConfig);
