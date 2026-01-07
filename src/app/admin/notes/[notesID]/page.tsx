// 管理员笔记详情页面组件 - 管理特定笔记分类下的笔记内容
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/shadcnComponents/data-display/card';
import { useSession } from 'next-auth/react';
import { api_notes } from '@/hooks/note/api_notes';
import { Note, NotesPage } from '@/types/note/type';
import { useParams } from 'next/navigation';
import { NoteListCardHeader } from '@/components/features/admin/notes/noteList/cardHeader';
import { NoteListHeader } from '@/components/features/admin/notes/noteList/header';
import { NoteListTable } from '@/components/features/admin/notes/noteList/table';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/shadcnComponents/forms/input';


export default function StudyNotesDetail() {
  const params = useParams();
  const [initialNotes, setInitialNotes] = useState<Note | null>(null);

  const notesId = params.notesID as string;


  const [notes, setNotes] = useState<Note | null>(initialNotes);
  const [notesPage, setNotesPage] = useState<NotesPage[]>(initialNotes?.page || []);
  const [addNotesPageTitle, setAddNotesPageTitle] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<'title' | 'dateStart' | 'dateEnd' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedNotes, setSelectedNotes] = useState<number[]>([]);
  const [isAddNotesDialogOpen, setIsAddNotesDialogOpen] = useState<boolean>(false);
  const { data: session } = useSession();
  const [pageTags, setPageTags] = useState<string[]>([]);



  // 获取notesList(GET)
  useEffect(() => {
    const fetchNotes = async () => {
      if (!notesId) return console.error('未提供笔记ID');
      try {
        const response = await api_notes.getNoteList(notesId as string);
        setNotes(response);
        setNotesPage(response.page || []);
        setInitialNotes(response);
      } catch (error) {
        console.error('获取笔记数据失败:', error);
      }
    };

    if (!initialNotes) {
      fetchNotes();
    }
  }, [notesId, initialNotes, notesPage.length]);




  // 过滤
  const filteredNotesPage = notesPage.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.pageTags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));


    return matchesSearch
  });

  // 排序
  const sortedPages = [...filteredNotesPage].sort((a, b) => {
    if (!sortField) return 0;

    let valueA: string | number = '';
    let valueB: string | number = '';

    if (sortField === 'title') {
      valueA = a.title.toLowerCase();
      valueB = b.title.toLowerCase();
    } else if (sortField === 'dateStart') {
      valueA = new Date(a.dateStart || '').getTime();
      valueB = new Date(b.dateStart || '').getTime();
    } else if (sortField === 'dateEnd') {
      valueA = new Date(a.dateEnd || '').getTime();
      valueB = new Date(b.dateEnd || '').getTime();
    }

    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedNotes.length === sortedPages.length) {
      setSelectedNotes([]);
    } else {
      setSelectedNotes(sortedPages.map(page => page.id));
    }
  };

  // 新建笔记(POST)
  const submitAddNote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!notes) return console.error('未提供笔记ID');

    
    const newNotesPage: NotesPage = {
      id: new Date().getTime(),
      uid: crypto.randomUUID() || '',
      title: addNotesPageTitle,
      content: '',
      author: session?.user?.name || '',
      dateStart: new Date().toLocaleString('sv-SE'),
      dateEnd: new Date().toLocaleString('sv-SE'),
      pageTags: pageTags,
      noteId: notesId || '',
      pageId: crypto.randomUUID(),
    };

    try {
      await api_notes.postNotePage(newNotesPage);
      setNotesPage(prev => [...prev, newNotesPage]);
      setAddNotesPageTitle('');
      setIsAddNotesDialogOpen(false)
    } catch (error) {
      console.error('新建笔记失败:', error)
    }
  };

  // 删除笔记(DELETE)
  const handleDeleteNotePage = async (pageID: string) => {
    if (!pageID) return console.error('未提供笔记页面ID');

    try {
      await api_notes.deleteNotePage(pageID)
      setNotesPage(prev => prev.filter(page => page.pageId !== pageID.toString()))
    } catch (error) {
      console.error('删除笔记失败:', error);
    }
  }


  // 排序变更
  const handleSortChange = (field: 'title' | 'dateStart' | 'dateEnd') => {
    setSortField(field);
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleToggleSelectItem = (id: number) => {
    if (selectedNotes.includes(id)) {
      setSelectedNotes(selectedNotes.filter(item => item !== id));
    } else {
      setSelectedNotes([...selectedNotes, id]);
    }
  };

  return (
    <main className="min-h-screen 
     bg-sky-100/60 dark:bg-slate-600/80
     text-foreground p-6 lg:pt-16">
      <NoteListHeader title={notes?.title || ''} />

      <Card className="backdrop-blur-sm bg-card/80 dark:bg-card/80 border border-border/40 shadow-xl hover:shadow-2xl transition-all duration-300">
        {/* 添加笔记卡片头部组件 */}
        <NoteListCardHeader
          title="笔记列表"
          description="管理和编辑所有学习笔记"
          isAddNotesDialogOpen={isAddNotesDialogOpen}
          setIsAddNotesDialogOpen={setIsAddNotesDialogOpen}
          addNotesPageTitle={addNotesPageTitle}
          setAddNotesPageTitle={setAddNotesPageTitle}
          defaultTags={[notes?.title || '']}
          onTagsChange={setPageTags}
          onSubmit={submitAddNote}
        />

        <CardContent className='bg-card/80 dark:bg-card/80'>
          {/* 搜索区域 */}
          <section className="flex flex-col md:flex-row md:items-center gap-4 mb-6 p-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="搜索笔记标题或标签..."
                className="pl-10 border-border/40 focus:border-primary/50 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </section>

          {/* 笔记表格区域 */}
          <section className="mb-6">
            <NoteListTable
              pages={sortedPages}
              selectedNotes={selectedNotes}
              sortField={sortField}
              sortDirection={sortDirection}
              onToggleSelectAll={toggleSelectAll}
              onToggleSelectItem={handleToggleSelectItem}
              onSortChange={handleSortChange}
              onDeletePage={handleDeleteNotePage}
              noteId={notes?.id}
            />
          </section>
          
          {/* 分页信息区域 */}
          <footer className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground bg-gradient-to-r from-primary/10 to-primary/5 px-3 py-2 rounded-lg border border-border/20">
              共 {notesPage.length} 条 {notes?.title} 笔记
            </div>
          </footer>
        </CardContent>
      </Card>
    </main>
  );
}
