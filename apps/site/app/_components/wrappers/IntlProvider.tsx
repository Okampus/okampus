import { dictsIntlAtom } from '../../_context/global';
import { useAtom } from 'jotai';
import type { IntlDict } from '../../../server/ssr/getTranslation';

export type IntlProviderProps = { dict: { [key: string]: IntlDict } };
export default function IntlProvider({ dict }: IntlProviderProps) {
  const [, setDictsIntl] = useAtom(dictsIntlAtom);
  setDictsIntl((prev) => ({ ...prev, ...dict }));
}
