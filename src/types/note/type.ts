interface Note {
  id: number;
  title: string;
  tags?: string[];
  titlePicture?: string;
  createdAt?: string;
  updatedAt?: string;
  page?: NotesPage[]
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

// 模拟评论数据




export type{ Note, NotesPage , Comment }