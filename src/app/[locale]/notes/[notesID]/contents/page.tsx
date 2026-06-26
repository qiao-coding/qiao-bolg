import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ContentsPageClient from './ContentsPageClient';

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

  const serialized = JSON.parse(JSON.stringify(note));

  return <ContentsPageClient note={serialized} />;
}
