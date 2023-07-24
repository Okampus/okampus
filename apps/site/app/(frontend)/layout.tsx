import './frontend.css';
import '../../styles/button.scss';
import '../../styles/colors.scss';
import '../../styles/fonts.scss';
import '../../styles/input.scss';
import '../../styles/layout.scss';
import '../../styles/scrollbar.scss';

import { LOCALE_COOKIE, getLang } from '../../ssr/getLang';
import { THEME_COOKIE, getTheme } from '../../ssr/getTheme';
import { getTranslation } from '../../ssr/getTranslation';

import CookiesInitialize from '../../components/wrappers/CookiesInitialize';
import JotaiInitialize from '../../components/wrappers/JotaiInitialize';
import JotaiProvider from '../../components/wrappers/JotaiProvider';

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [theme, lang] = await Promise.all([getTheme(), getLang()]);
  const { determiners, dict } = await getTranslation();

  return (
    <html lang={lang} className={theme}>
      <CookiesInitialize
        cookies={[
          [THEME_COOKIE, theme],
          [LOCALE_COOKIE, lang],
        ]}
      />
      <JotaiProvider>
        <JotaiInitialize
          initialValues={[
            ['lang', lang],
            ['determiners', determiners],
            ['dicts', dict],
          ]}
        />
        <body>{children}</body>
      </JotaiProvider>
    </html>
  );
}
