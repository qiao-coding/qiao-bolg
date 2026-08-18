import { Note } from '@/types/note/type';

/**
 * 目录树搜索过滤：
 * - 空查询返回原列表
 * - 分类名命中 → 整分类保留
 * - 只命中页面标题/标签 → 只保留命中页面
 */
export function filterNotes(notes: Note[], query: string): Note[] {
  if (!query.trim()) return notes;
  const q = query.toLowerCase();
  return notes
    .map((note) => {
      const titleHit = note.title.toLowerCase().includes(q);
      const pages = (note.page || []).filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.pageTags || []).some((tag) => tag.toLowerCase().includes(q))
      );
      if (titleHit) return note;
      return pages.length > 0 ? { ...note, page: pages } : null;
    })
    .filter((n): n is Note => n !== null);
}
