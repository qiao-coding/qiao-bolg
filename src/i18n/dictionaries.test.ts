import { describe, it, expect } from 'vitest';
import { zh, en } from './dictionaries';

function collectKeys(obj: unknown, prefix = ''): string[] {
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    return v && typeof v === 'object' && !Array.isArray(v) ? collectKeys(v, key) : [key];
  });
}

describe('i18n dictionaries', () => {
  it('zh 与 en 的 key 结构完全一致', () => {
    const zhKeys = collectKeys(zh).sort();
    const enKeys = collectKeys(en).sort();
    expect(zhKeys).toEqual(enKeys);
  });

  it('所有叶子值都是非空字符串', () => {
    const assertLeaves = (obj: unknown) => {
      for (const v of Object.values(obj as Record<string, unknown>)) {
        if (v && typeof v === 'object') {
          assertLeaves(v);
        } else {
          expect(typeof v).toBe('string');
          expect((v as string).trim().length).toBeGreaterThan(0);
        }
      }
    };
    assertLeaves(zh);
    assertLeaves(en);
  });
});
