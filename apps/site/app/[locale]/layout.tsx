import '../styles.css';
import '../../styles/scrollbar.scss';

import CookiesInitialize from '../_components/providers/CookiesInitialize';
import JotaiInitialize from '../_components/providers/JotaiInitialize';
import JotaiProvider from '../_components/providers/JotaiProvider';

import { availableLocales, getNextLang } from '../../server/ssr/getLang';
import { getTheme } from '../../server/ssr/getTheme';

import { getIntlMessages } from '../../i18n';
import { THEME_COOKIE, LOCALE_COOKIE } from '@okampus/shared/consts';

import clsx from 'clsx';
import { Instrument_Sans, Fira_Code } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';

import { Toaster } from 'sonner';

import type { LangParams } from '../params.type';
import type { Metadata, Viewport } from 'next';
import type { CSSProperties } from 'react';

const APP_NAME = 'Okampus';
const APP_DESCRIPTION =
  'Student platform & digital workspace for schools - A SaaS solution to improve in-school communication';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light',
  themeColor: '#f15',
};

export const metadata: Metadata = {
  title: 'Bienvenue sur Okampus 🚀',
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  appleWebApp: { capable: true, title: APP_NAME, statusBarStyle: 'default' },
  keywords: ['education', 'schools', 'students', 'university', 'student clubs', 'productivity'],
  formatDetection: { telephone: false },
  manifest: '/manifest.json',
  icons: [
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
    { rel: 'shortcut icon', url: '/favicon.ico' },
  ],
};

const sans = Instrument_Sans({ subsets: ['latin'], variable: '--font-sans' });
const mono = Fira_Code({ subsets: ['latin'], variable: '--font-mono' });

export async function generateStaticParams() {
  return Object.values(availableLocales).map((locale) => ({ locale }));
}

const toastStyle = {
  backgroundColor: 'var(--bg-opposite)',
  borderWidth: '0px',
  boxShadow: 'none',
  marginLeft: '0.25rem',
} as CSSProperties;

export default async function FrontendLayout({ children, params }: { children: React.ReactNode } & LangParams) {
  const theme = await getTheme();

  return (
    <html
      lang={params.locale.slice(0, 2)}
      className={clsx(theme, sans.variable, mono.variable)}
      style={{ fontFamily: 'sans-serif' }}
    >
      <CookiesInitialize
        cookies={[
          [THEME_COOKIE, theme],
          [LOCALE_COOKIE, params.locale],
        ]}
      />
      <NextIntlClientProvider messages={await getIntlMessages(getNextLang(), ['Common'])}>
        <JotaiProvider>
          <JotaiInitialize initialValues={[['theme', theme]]} />
          <body>
            <Toaster duration={1500} position="bottom-left" toastOptions={{ style: toastStyle }} closeButton={true} />
            {children}
          </body>
        </JotaiProvider>
      </NextIntlClientProvider>
    </html>
  );
}
