import './frontend.css';
import 'react-advanced-cropper/dist/style.css';

import '../../styles/button.scss';
import '../../styles/colors.scss';
import '../../styles/fonts.scss';
import '../../styles/input.scss';
import '../../styles/layout.scss';
import '../../styles/scrollbar.scss';

import { getLang } from '../../ssr/getLang';
import { getTheme } from '../../ssr/getTheme';
import { getTranslation } from '../../ssr/getTranslation';

import CookiesInitialize from '../../components/wrappers/CookiesInitialize';
import JotaiInitialize from '../../components/wrappers/JotaiInitialize';
import JotaiProvider from '../../components/wrappers/JotaiProvider';

import { THEME_COOKIE, LOCALE_COOKIE } from '@okampus/shared/consts';

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
