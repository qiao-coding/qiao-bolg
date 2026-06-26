import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import NotePageDetailClient from './NotePageDetailClient';

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

  return (
    <NotePageDetailClient
      notesPage={notesPage}
    />
  );
}
