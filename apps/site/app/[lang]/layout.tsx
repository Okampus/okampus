import './frontend.css';
import 'react-advanced-cropper/dist/style.css';

import '../../styles/button.scss';
import '../../styles/colors.scss';
import '../../styles/fonts.scss';
import '../../styles/input.scss';
import '../../styles/layout.scss';
import '../../styles/scrollbar.scss';

import { getTheme } from '../../server/ssr/getTheme';
import { getTranslation } from '../../server/ssr/getTranslation';

import CookiesInitialize from '../_components/wrappers/CookiesInitialize';
import JotaiInitialize from '../_components/wrappers/JotaiInitialize';
import JotaiProvider from '../_components/wrappers/JotaiProvider';
import TRPCProvider from '../_components/wrappers/TRPCProvider';

import { getLangFromLocalePath } from '../../config/i18n';
import { THEME_COOKIE, LOCALE_COOKIE } from '@okampus/shared/consts';

import { Instrument_Sans, Fira_Code } from 'next/font/google';

import type { Metadata } from 'next';

const APP_NAME = 'Okampus';
const APP_DESCRIPTION =
  'Student platform & digital workspace for schools - A SaaS solution to improve in-school communication';

export const metadata: Metadata = {
  title: 'Bienvenue sur Okampus 🚀',
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  appleWebApp: { capable: true, title: APP_NAME, statusBarStyle: 'default' },
  keywords: ['education', 'schools', 'students', 'university', 'student clubs', 'productivity'],
  formatDetection: { telephone: false },
  themeColor: '#f15',
  viewport: 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover',
  manifest: '/manifest.json',
  icons: [
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
    { rel: 'shortcut icon', url: '/favicon.ico' },
  ],
};

const sans = Instrument_Sans({ subsets: ['latin'], variable: '--font-sans' });
const mono = Fira_Code({ subsets: ['latin'], variable: '--font-mono' });

export default async function FrontendLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const theme = await getTheme();
  const { common } = await getTranslation();

  return (
    <html lang={getLangFromLocalePath(params.lang)} className={`${theme} ${sans.variable} ${mono.variable}`}>
      <CookiesInitialize
        cookies={[
          [THEME_COOKIE, theme],
          [LOCALE_COOKIE, params.lang],
        ]}
      />
      <JotaiProvider>
        <JotaiInitialize
          initialValues={[
            ['lang', params.lang],
            ['dictsIntl', { common }],
          ]}
        />
        <TRPCProvider>
          <body>{children}</body>
        </TRPCProvider>
      </JotaiProvider>
    </html>
  );
}
