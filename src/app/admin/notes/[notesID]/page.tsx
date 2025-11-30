'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useNotes } from '@/hooks/note/useNotes';
import { Note } from '@/types/note/type';
import { NoteListDetail } from '@/components/features/admin/notes/noteList/detail';

const StudyNodes = () => {
  const params = useParams();
  const [initialNotes, setInitialNotes] = React.useState<Note | null>(null);

  // 获取notesList(GET)
  React.useEffect(() => {
    const fetchNotes = async () => {
      const notesId = params.notesID;
      if (!notesId) return console.error('未提供笔记ID');
      try {
        const response = await useNotes.getNoteList(notesId as string);
        setInitialNotes(response);
      } catch (error) {
        console.error('获取笔记数据失败:', error);
      }
    };

    fetchNotes();
  }, [params.notesID]);

  return (
    <NoteListDetail 
      initialNotes={initialNotes} 
      notesId={params.notesID as string} 
    />
  );
};

export default StudyNodes;