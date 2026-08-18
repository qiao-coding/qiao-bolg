import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NoteTreeView } from './NoteTreeView';
import { Note } from '@/types/note/type';

const notes: Note[] = [
  {
    id: 1,
    title: '前端开发',
    tags: ['前端'],
    page: [
      { id: 10, pageId: 'p10', title: 'React 性能优化', content: '', dateEnd: '2026-01-01', pageTags: ['React'], noteId: 1 },
      { id: 11, pageId: 'p11', title: 'Next.js 15 新特性', content: '', dateEnd: '2026-01-02', pageTags: ['Next'], noteId: 1 },
    ],
  },
  {
    id: 2,
    title: '后端',
    tags: ['后端'],
    page: [
      { id: 20, pageId: 'p20', title: 'Prisma 基础', content: '', dateEnd: '2026-01-03', pageTags: ['数据库'], noteId: 2 },
    ],
  },
];

function setup(overrides: Partial<Parameters<typeof NoteTreeView>[0]> = {}) {
  const props = {
    notes,
    formatDate: (d: string) => d,
    onCreateCategory: vi.fn(),
    onRenameCategory: vi.fn(),
    onDeleteCategory: vi.fn(),
    onDeletePage: vi.fn(),
    onMovePage: vi.fn(),
    ...overrides,
  };
  render(React.createElement(NoteTreeView, props));
  return props;
}

describe('NoteTreeView', () => {
  it('渲染分类文件夹与页面（首次加载默认全展开）', () => {
    setup();
    expect(screen.getByText('前端开发')).toBeInTheDocument();
    expect(screen.getByText('后端')).toBeInTheDocument();
    expect(screen.getByText('React 性能优化')).toBeInTheDocument();
    expect(screen.getByText('Prisma 基础')).toBeInTheDocument();
  });

  it('搜索命中页面时只保留命中页面', () => {
    setup();
    const search = screen.getByPlaceholderText('admin.searchPlaceholder');
    fireEvent.change(search, { target: { value: 'React' } });
    expect(screen.getByText('React 性能优化')).toBeInTheDocument();
    expect(screen.queryByText('Next.js 15 新特性')).not.toBeInTheDocument();
    expect(screen.queryByText('后端')).not.toBeInTheDocument();
  });

  it('搜索命中分类时整分类保留', () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText('admin.searchPlaceholder'), {
      target: { value: '后端' },
    });
    expect(screen.getByText('Prisma 基础')).toBeInTheDocument();
    expect(screen.queryByText('前端开发')).not.toBeInTheDocument();
  });

  it('搜索无结果显示空态', () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText('admin.searchPlaceholder'), {
      target: { value: '不存在的词' },
    });
    expect(screen.getByText('admin.notesTree.noMatch')).toBeInTheDocument();
  });

  it('把页面拖到目标文件夹触发 onMovePage', () => {
    const props = setup();
    // 找到目标分类「后端」的文件夹行
    const targetRow = screen.getByText('后端').closest('.tree-row');
    expect(targetRow).not.toBeNull();

    fireEvent.drop(targetRow as Element, {
      dataTransfer: {
        getData: () => JSON.stringify({ pageId: 'p10', sourceNoteId: 1 }),
        dropEffect: 'move',
        effectAllowed: 'move',
      },
    });
    expect(props.onMovePage).toHaveBeenCalledWith('p10', 1, 2);
  });

  it('点击「新建分类」按钮触发 onCreateCategory', () => {
    const props = setup();
    fireEvent.click(screen.getByText('admin.newCategory'));
    expect(props.onCreateCategory).toHaveBeenCalledTimes(1);
  });
});
