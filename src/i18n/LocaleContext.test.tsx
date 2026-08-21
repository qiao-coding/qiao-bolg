import { render, screen } from '@testing-library/react';
import { useEffect, useRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.unmock('@/i18n/LocaleContext');

describe('LocaleContext', () => {
  it('keeps the translation function stable across rerenders for the same locale', async () => {
    const { LocaleProvider, useT } = await import('./LocaleContext');

    function TranslationIdentityProbe() {
      const t = useT();
      const firstT = useRef(t);
      const [sameIdentity, setSameIdentity] = useState<boolean | null>(null);

      useEffect(() => {
        setSameIdentity(firstT.current === t);
      }, [t]);

      return <div>{sameIdentity === null ? 'pending' : String(sameIdentity)}</div>;
    }

    const { rerender } = render(
      <LocaleProvider locale="zh">
        <TranslationIdentityProbe />
      </LocaleProvider>
    );

    rerender(
      <LocaleProvider locale="zh">
        <TranslationIdentityProbe />
      </LocaleProvider>
    );

    expect(screen.getByText('true')).toBeInTheDocument();
  });
});
