'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from '@/i18n/LocaleContext';
import { Button } from "@/components/ui/shadcnComponents/forms/button";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const toggleLocale = () => {
    const nextLocale = locale === 'zh' ? 'en' : 'zh';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLocale}
      className="cursor-pointer rounded-md text-sm font-semibold text-muted-foreground hover:text-foreground"
      aria-label={locale === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      {locale === 'zh' ? 'EN' : '中'}
    </Button>
  );
}
