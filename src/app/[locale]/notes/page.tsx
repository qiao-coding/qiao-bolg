import { prisma } from '@/lib/prisma';
import NotesPageClient from './NotesPageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function NotesPage() {
  const notes = await prisma.note.findMany({
    include: { page: true }
  });

  const serializedNotes = JSON.parse(JSON.stringify(notes));

  return <NotesPageClient notes={serializedNotes} />;
}
