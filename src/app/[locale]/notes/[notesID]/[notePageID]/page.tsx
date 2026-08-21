import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import NotePageDetailClient from './NotePageDetailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function NotePageDetail({
  params,
}: {
  params: Promise<{ notesID: string; notePageID: string }>;
}) {
  const { notesID, notePageID } = await params;
  const noteId = Number(notesID);

  if (isNaN(noteId)) {
    notFound();
  }

  const note = await prisma.note.findUnique({
    where: { id: noteId },
    include: { page: true }
  });

  if (!note) {
    notFound();
  }

  // Find the specific page by uid (matching the original client-side lookup)
  const rawPage = note.page.find(
    (p) => String(p.uid ?? '') === notePageID
  );

  if (!rawPage) {
    notFound();
  }

  // Serialize Prisma Date objects to strings for client component props
  const notesPage = JSON.parse(JSON.stringify(rawPage));
  const serializedNote = JSON.parse(JSON.stringify(note));

  // 供左侧目录树展示所有笔记分类。侧栏不需要正文 content，避免每次切换详情页都传输所有文章正文。
  const allNotes = await prisma.note.findMany({
    select: {
      id: true,
      title: true,
      tags: true,
      titlePicture: true,
      createdAt: true,
      updatedAt: true,
      page: {
        select: {
          id: true,
          uid: true,
          pageId: true,
          title: true,
          author: true,
          dateStart: true,
          dateEnd: true,
          pageTags: true,
          noteId: true,
        },
      },
    },
  });
  const serializedAllNotes = JSON.parse(JSON.stringify(
    allNotes.map((item) => ({
      ...item,
      page: item.page.map((page) => ({
        ...page,
        content: '',
      })),
    }))
  ));

  return (
    <NotePageDetailClient
      note={serializedNote}
      notesPage={notesPage}
      allNotes={serializedAllNotes}
    />
  );
}
