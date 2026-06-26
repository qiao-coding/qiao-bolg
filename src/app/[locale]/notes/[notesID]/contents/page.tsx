import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ContentsBackLink } from './ContentsPageClient';

export default async function ContentsPage({
  params,
}: {
  params: Promise<{ notesID: string }>;
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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      fontFamily: 'Georgia, "Times New Roman", serif',
    }}>
      {/* 返回链接 */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '80px 24px 32px' }}>
        <ContentsBackLink noteId={note.id} noteTitle={note.title} />
      </div>

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px 96px' }}>
        {/* 目录标题 */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: 700,
            color: '#1e293b',
            margin: '0 0 8px',
            letterSpacing: '-0.02em',
          }}>
            {note.title}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontFamily: 'monospace' }}>
            目录 &mdash; Contents
          </p>

          {/* 统计 */}
          <div style={{
            display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '32px',
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '6px 16px', borderRadius: '999px',
              background: 'rgba(255,255,255,0.7)', border: '1px solid #e2e8f0',
              fontSize: '0.875rem', color: '#475569',
            }}>
              <span style={{ fontWeight: 600, color: '#1e293b' }}>{pages.length}</span> 篇笔记
            </span>
            {note.tags && note.tags.length > 0 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '6px 16px', borderRadius: '999px',
                background: 'rgba(255,255,255,0.7)', border: '1px solid #e2e8f0',
                fontSize: '0.875rem', color: '#475569',
              }}>
                {note.tags.join(' / ')}
              </span>
            )}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '6px 16px', borderRadius: '999px',
              background: 'rgba(255,255,255,0.7)', border: '1px solid #e2e8f0',
              fontSize: '0.875rem', color: '#475569',
            }}>
              {createdDate}
            </span>
          </div>
        </div>

        {/* 目录列表 — 纯 HTML，无 JS 依赖 */}
        {pages.length > 0 ? (
          <nav aria-label="笔记目录" style={{ borderTop: '1px solid #e2e8f0' }}>
            {pages.map((page, index) => {
              const href = `/notes/${note.id}/${page.uid}`;
              return (
                <a
                  key={page.id}
                  href={href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    padding: '14px 8px',
                    borderBottom: '1px solid #e2e8f0',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  {/* 序号 */}
                  <span style={{
                    width: '32px', textAlign: 'right',
                    fontFamily: 'monospace', fontSize: '0.875rem',
                    color: '#94a3b8',
                  }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* 主体 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{
                      fontSize: '1rem', color: '#1e293b',
                      display: 'block', lineHeight: 1.5,
                    }}>
                      {page.title}
                    </span>
                    {/* 可见 URL — AI 可直接读取 */}
                    <span style={{
                      fontSize: '0.75rem', color: '#94a3b8',
                      fontFamily: 'monospace',
                      display: 'block', marginTop: '2px',
                      userSelect: 'all',
                    }}>
                      {href}
                    </span>
                    <span style={{
                      fontSize: '0.75rem', color: '#cbd5e1',
                      display: 'block', marginTop: '2px',
                    }}>
                      {page.author || ''}{page.author && page.dateStart ? ' · ' : ''}{page.dateStart || ''}
                    </span>
                  </div>

                  {/* 标签 */}
                  {page.pageTags && page.pageTags.length > 0 && (
                    <span style={{ display: 'flex', gap: '4px', flexShrink: 0, maxWidth: '160px', overflow: 'hidden' }}>
                      {page.pageTags.slice(0, 2).map((tag) => (
                        <span key={tag} style={{
                          fontSize: '0.625rem', padding: '2px 8px',
                          borderRadius: '999px',
                          background: 'rgba(59,130,246,0.08)',
                          color: '#3b82f6', border: '1px solid rgba(59,130,246,0.15)',
                          whiteSpace: 'nowrap',
                        }}>
                          {tag}
                        </span>
                      ))}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>
            暂无笔记
          </div>
        )}

        {/* 页脚 */}
        <footer style={{
          marginTop: '64px', paddingTop: '32px',
          borderTop: '1px solid #e2e8f0', textAlign: 'center',
        }}>
          <p style={{
            fontSize: '0.75rem', color: '#cbd5e1', fontFamily: 'monospace',
          }}>
            {note.title} &mdash; {pages.length} pages &mdash; auto-generated
          </p>
        </footer>
      </main>
    </div>
  );
}
