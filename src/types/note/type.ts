interface Note {
  id: number;
  title: string;
  tags?: string[];
  titlePicture?: string;
  createdAt?: string;
  updatedAt?: string;
  page?: NotesPage[]
}

interface CreateNoteInput {
  title: string;
  tags: string[];
  titlePicture?: string;
  createdAt?: string;
}

// 根据 Prisma 模型定义的笔记页面类型
interface NotesPage {
  id: number;
  uid?: string;
  title: string;
  content: string;
  author?: string;
  dateStart?: string;
  dateEnd: string;
  pageId?: string;
  pageTags: string[];
  noteId?: string;
  note?: Note;
}


interface ReplyComment {
  id: string;
  author: string;
  content: string;
  date: string;
}

// 定义评论接口
interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  replies?: ReplyComment[];
}

 interface NoteSearchResponse {
  id: number;
  title: string;
  tags?: string[];
  titlePicture?: string | null;
  createdAt?: string|Date;
  updatedAt?: string|Date;
  page: NotesPage[];
}

interface NoteSearchParams {
  q: string;
}




export type{ Note, NotesPage , Comment , NoteSearchResponse , NoteSearchParams, CreateNoteInput }