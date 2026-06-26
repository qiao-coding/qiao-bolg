import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import NoteDetailClient from './NoteDetailClient';

export default async function NoteDetailPage({
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
    include: { page: true }
  });

  if (!note) {
    notFound();
  }

  // Serialize Prisma Date objects to strings for client component props
  const serializedNote = JSON.parse(JSON.stringify(note));

  return <NoteDetailClient note={serializedNote} notesID={notesID} />;
}
