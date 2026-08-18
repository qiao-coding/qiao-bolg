import { describe, it, expect } from 'vitest';
import { filterNotes } from './filterNotes';
import { Note } from '@/types/note/type';

const notes: Note[] = [
  {
    id: 1,
    title: '前端开发',
    tags: ['前端'],
    page: [
      { id: 10, title: 'React 性能优化', content: '', dateEnd: '2026-01-01', pageTags: ['React'], noteId: 1 },
      { id: 11, title: 'Next.js 15 新特性', content: '', dateEnd: '2026-01-02', pageTags: ['Next'], noteId: 1 },
    ],
  },
  {
    id: 2,
    title: '后端',
    tags: ['后端'],
    page: [
      { id: 20, title: 'Prisma 基础', content: '', dateEnd: '2026-01-03', pageTags: ['数据库'], noteId: 2 },
    ],
  },
];

describe('filterNotes', () => {
  it('空查询返回原列表（不产生新引用）', () => {
    expect(filterNotes(notes, '')).toEqual(notes);
    expect(filterNotes(notes, '   ')).toEqual(notes);
  });

  it('分类名命中 → 整分类保留', () => {
    const res = filterNotes(notes, '后端');
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe(2);
    expect(res[0].page).toHaveLength(1);
  });

  it('页面标题命中 → 只保留该页', () => {
    const res = filterNotes(notes, 'React');
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe(1);
    expect(res[0].page?.map((p) => p.title)).toEqual(['React 性能优化']);
  });

  it('页面标签命中', () => {
    const res = filterNotes(notes, '数据');
    expect(res).toHaveLength(1);
    expect(res[0].page?.map((p) => p.title)).toEqual(['Prisma 基础']);
  });

  it('页面标题命中不区分大小写', () => {
    const res = filterNotes(notes, 'react');
    expect(res).toHaveLength(1);
    expect(res[0].page?.map((p) => p.title)).toEqual(['React 性能优化']);
  });

  it('分类名与页面同时命中时保留完整分类', () => {
    const res = filterNotes(notes, '前端');
    expect(res).toHaveLength(1);
    expect(res[0].page).toHaveLength(2);
  });

  it('无命中返回空数组', () => {
    expect(filterNotes(notes, '不存在的词')).toEqual([]);
  });
});
