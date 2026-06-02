'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from '@/i18n/LocaleContext';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const toggleLocale = () => {
    const nextLocale = locale === 'zh' ? 'en' : 'zh';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLocale}
      className="btn btn-ghost btn-sm text-sm font-bold text-black dark:text-white cursor-target"
      aria-label={locale === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      {locale === 'zh' ? 'EN' : '中'}
    </button>
  );
}
