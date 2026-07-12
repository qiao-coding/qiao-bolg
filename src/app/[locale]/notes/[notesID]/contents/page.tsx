import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ContentsBackLink, ContentsPageLink } from './ContentsPageClient';

export default async function ContentsPage({
  params,
}: {
  params: Promise<{ locale: string; notesID: string }>;
}) {
  const { locale, notesID } = await params;
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 dark:from-slate-900 dark:to-slate-800"
         style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      {/* 返回链接 */}
      <div className="max-w-[720px] mx-auto pt-20 pb-8 px-6">
        <ContentsBackLink noteId={note.id} noteTitle={note.title} />
      </div>

      <main className="max-w-[720px] mx-auto pb-24 px-6">
        {/* 目录标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">
            {note.title}
          </h1>
          <p className="text-muted-foreground text-sm font-mono">
            目录 &mdash; Contents
          </p>

          {/* 统计徽章 */}
          <div className="flex justify-center flex-wrap gap-3 mt-8">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full
                           bg-card/70 border border-border text-sm text-foreground/80">
              <span className="font-semibold text-foreground">{pages.length}</span> 篇笔记
            </span>
            {note.tags && note.tags.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full
                             bg-card/70 border border-border text-sm text-foreground/80">
                {note.tags.join(' / ')}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full
                           bg-card/70 border border-border text-sm text-foreground/80">
              {createdDate}
            </span>
          </div>
        </div>

        {/* 目录列表 */}
        {pages.length > 0 ? (
          <nav aria-label="笔记目录" className="border-t border-border/60">
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
        <footer className="mt-16 pt-8 border-t border-border/60 text-center">
          <p className="text-xs text-muted-foreground/60 font-mono">
            {note.title} &mdash; {pages.length} pages &mdash; auto-generated
          </p>
        </footer>
      </main>
    </div>
  );
}
