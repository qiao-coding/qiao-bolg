import { prisma } from '@/lib/prisma';
import NotesPageClient from './NotesPageClient';

export default async function NotesPage() {
  const notes = await prisma.note.findMany({
    include: { page: true }
  });

  // Serialize Prisma Date objects to strings for client component props
  const serializedNotes = JSON.parse(JSON.stringify(notes));

  return <NotesPageClient notes={serializedNotes} />;
}
