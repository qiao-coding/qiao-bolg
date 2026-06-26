export type Note = {
  id: number;
  title: string;
  tags?: string[];
  titlePicture?: string | null;
  createdAt?: string;
  updatedAt?: string;
  page?: NotesPage[];
};

export type CreateNoteInput = {
  title: string;
  tags: string[];
  titlePicture?: string;
  createdAt?: string;
};

// 根据 Prisma 模型定义的笔记页面类型
export type NotesPage = {
  id: number;
  uid?: string;
  title: string;
  content: string;
  author?: string;
  dateStart?: string;
  dateEnd: string;
  pageId?: string;
  pageTags: string[];
  noteId?: number | null | string;
  note?: Note;
};

export type ReplyComment = {
  id: string;
  author: string;
  content: string;
  date: string;
};

// 定义评论接口
export type Comment = {
  id: string;
  author: string;
  content: string;
  date: string;
  replies?: ReplyComment[];
};

export type NoteSearchResponse = {
  id: number;
  title: string;
  tags?: string[];
  titlePicture?: string | null;
  createdAt?: string|Date;
  updatedAt?: string|Date;
  page: NotesPage[];
};

export type NoteSearchParams = {
  q: string;
};

