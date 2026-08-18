import React from 'react';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// ---- 浏览器 API（jsdom 缺失，Radix/Dialog/Select 需要）----
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

Element.prototype.scrollIntoView = vi.fn();

// ---- gsap 动画 mock：jsdom 下无视觉意义，no-op ----
vi.mock('gsap', () => ({
  default: {
    to: vi.fn(),
    fromTo: vi.fn(),
    set: vi.fn(),
    from: vi.fn(),
  },
}));

vi.mock('@gsap/react', () => ({
  useGSAP: (callback: () => void) => {
    callback();
  },
}));

// ---- i18n 轻量 mock：返回 key 本身，断言用数据驱动内容 ----
vi.mock('@/i18n/LocaleContext', () => ({
  useT: () => (key: string, params?: Record<string, string | number>) =>
    params ? key : key,
  useLocale: () => 'zh',
}));

// ---- next-intl 导航 mock：Link 渲染为 <a> ----
vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) =>
    React.createElement('a', { href, className }, children),
  useRouter: () => ({ push: vi.fn(), back: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/zh',
  redirect: (url: string) => url,
}));

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
}));
