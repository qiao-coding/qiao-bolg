import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ContentsBackLink, ContentsPageLink } from './ContentsPageClient';
import TechBackgroundNoGrid from '@/components/ui/public/background_img';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ContentsPage({
  params,
}: {
  params: Promise<{ locale: string; notesID: string }>;
}) {
  const { notesID } = await params;
  const noteId = Number(notesID);

  if (isNaN(noteId)) {
    notFound();
  }

  const note = await prisma.note.findUnique({
    where: { id: noteId },
    include: {
      page: {
        orderBy: { dateStart: 'asc' }
      }
    }
  });

  if (!note) {
    notFound();
  }

  const pages = note.page ?? [];
  const createdDate = note.createdAt
    ? new Date(note.createdAt).toLocaleDateString('zh-CN')
    : '-';

  return (
    <TechBackgroundNoGrid>
      {/* 返回链接 */}
      <div className="mx-auto max-w-[820px] px-6 pb-8 pt-20">
        <ContentsBackLink noteId={note.id} noteTitle={note.title} />
      </div>

      <main className="mx-auto max-w-[820px] px-6 pb-24">
        {/* 目录标题 */}
        <div className="mb-10 border-b border-brand-pink/15 pb-8 text-center">
          <div>
            <h1 className="mb-2 text-4xl font-black tracking-tight text-foreground">
              {note.title}
            </h1>
            <p className="text-sm font-mono text-muted-foreground">
              目录 - Contents
            </p>
          </div>

          {/* 统计徽章 */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-brand-pink/20 bg-white/70 px-3 py-1.5 text-sm text-brand-pink-deep dark:border-[#8fb7df]/24 dark:bg-[#b9d7f2]/10 dark:text-[#dbe9f8]">
              <span className="font-semibold text-foreground">{pages.length}</span> 篇笔记
            </span>
            {note.tags && note.tags.length > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-brand-pink/20 bg-white/70 px-3 py-1.5 text-sm text-brand-pink-deep dark:border-[#8fb7df]/24 dark:bg-[#b9d7f2]/10 dark:text-[#dbe9f8]">
                {note.tags.join(' / ')}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-md border border-brand-pink/20 bg-white/70 px-3 py-1.5 text-sm text-muted-foreground dark:border-[#8fb7df]/24 dark:bg-[#26334d]">
              {createdDate}
            </span>
          </div>
        </div>

        {/* 目录列表 */}
        {pages.length > 0 ? (
          <nav aria-label="笔记目录" className="divide-y divide-brand-pink/10 border-y border-brand-pink/10 bg-white/42 dark:divide-[#8fb7df]/16 dark:border-[#8fb7df]/18 dark:bg-[#202a3f]/72">
            {pages.map((page, index) => (
              <ContentsPageLink
                key={page.id}
                href={`/notes/${note.id}/${page.uid}`}
                index={index}
                title={page.title}
                author={page.author}
                dateStart={page.dateStart}
                tags={page.pageTags}
              />
            ))}
          </nav>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            暂无笔记
          </div>
        )}

        {/* 页脚 */}
        <footer className="mt-16 pt-8 text-center">
          <p className="text-xs text-muted-foreground/60 font-mono">
            {note.title} - {pages.length} pages - auto-generated
          </p>
        </footer>
      </main>
    </TechBackgroundNoGrid>
  );
}
