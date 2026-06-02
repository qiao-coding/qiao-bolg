'use client';

import { createContext, useContext } from 'react';
import { zh, en, type Locale } from './dictionaries';

export type { Locale };

type Dictionary = typeof zh;

const LocaleContext = createContext<Locale>('zh');

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

function getDict(locale: Locale): Dictionary {
  return locale === 'en' ? en : zh;
}

function getValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return path;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : path;
}

export function useT() {
  const locale = useLocale();
  const dict = getDict(locale);

  function t(key: string, params?: Record<string, string | number>): string {
    let value = getValue(dict as unknown as Record<string, unknown>, key);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(`{${k}}`, String(v));
      }
    }
    return value;
  }

  return t;
}
