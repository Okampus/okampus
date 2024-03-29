import { Locale } from '../server/ssr/getLang';

export type LangParams = { params: { locale: Locale } };
export type CategoryParams = { params: { locale: Locale; domain: string; category: string } };
export type DomainParams = { params: { locale: Locale; domain: string } };
export type DomainSlugParams = { params: { locale: Locale; domain: string; slug: string } };
