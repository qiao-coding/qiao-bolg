'use client'
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/shadcnComponents/button';
import { Input } from '@/components/ui/shadcnComponents/input';
import { Badge } from '@/components/ui/shadcnComponents/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcnComponents/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/shadcnComponents/alert';
import { Label } from '@/components/ui/shadcnComponents/label';
import { Separator } from '@/components/ui/shadcnComponents/separator';
import { Textarea } from '@/components/ui/shadcnComponents/textarea';
import { Switch } from '@/components/ui/shadcnComponents/switch';
import { Moon, Sun, Save, ArrowLeft, Tag, FileText, Calendar } from 'lucide-react';

interface NotesPage {
  id: number;
  uid: number;
  title: string;
  content: string;
  author: string;
  dateStart: string;
  dateEnd: string;
  pageTags: string[];
  noteId?: number;
}

const NoteEditPage = () => {
  const { pageId } = useParams();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [notePage, setNotePage] = useState<NotesPage | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const isnewNotePage = pageId === 'new';

  useEffect(() => {
    const fetchNotePage = async () => {
      if (isnewNotePage) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const notesResponse = await fetch('/api/notes', { 
          method: 'GET', 
          credentials: 'include' 
        });
        if (!notesResponse.ok) throw new Error('Failed to fetch notes');
        
        const notesData = await notesResponse.json();
        let foundPage: NotesPage | null = null;
        
        for (const note of notesData) {
          const page = note.page.find((p: NotesPage) => p.id.toString() === pageId);
          if (page) {
            foundPage = page;
            break;
          }
        }
        if (!foundPage) throw new Error('Page not found');
        setNotePage(foundPage);
        setTitle(foundPage.title);
        setContent(foundPage.content);
        setTags(foundPage.pageTags.join(','));
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取笔记页面失败');
      } finally {
        setLoading(false);
      }
    };

    fetchNotePage();
  }, [pageId, isnewNotePage]);

  // 保存笔记 - 根据是否是新建笔记调用不同的API
  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError('标题和内容不能为空');
      return;
    }

    try {
      setIsSaving(true);
      let response;
      
      // 根据是否是新建笔记调用不同的API
      if (isnewNotePage) {
        // 创建新笔记页面
        response = await fetch('/api/notesPage/create', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content,
            pageTags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            dateStart: new Date().toLocaleDateString(),
            dateEnd: new Date().toLocaleDateString(),
            // 这里假设uid为1，实际应该从当前登录用户获取
            uid: 1
          }),
        });
      } else {
        // 更新现有笔记页面
        if (!notePage) return;
        
        response = await fetch('/api/notesPage/update', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: notePage.id,
            title,
            content,
            pageTags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            dateEnd: new Date().toLocaleDateString(),
          }),
        });
      }
      
      if (!response.ok) throw new Error('保存失败');
      
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        router.back();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存笔记失败');
    } finally {
      setIsSaving(false);
    }
  };


  // 取消编辑
  const handleCancel = () => {
    router.back();
  };


  // 处理标签输入
  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value);
  };

  // 加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center">
        <Card className="w-full max-w-4xl shadow-lg border border-border/20 overflow-hidden transition-all duration-500 hover:shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/10">
            <CardTitle className="flex items-center gap-2 text-primary">
              <FileText className="h-5 w-5" />
              加载笔记内容...
            </CardTitle>
          </CardHeader>
          <CardContent className="py-8 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground animate-pulse">正在准备您的笔记...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center">
        <Card className="w-full max-w-2xl">
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>错误</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            onClick={handleCancel} 
            className="w-full flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            返回
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题栏 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCancel} 
              className="rounded-full hover:bg-background/80 hover:text-primary"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-primary">编辑笔记</h1>
          </div>
          
        </div>

        {/* 主内容卡片 */}
        <Card className="shadow-lg border border-border/20 overflow-hidden transition-all duration-500 hover:shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/10 pt-5">
            <CardTitle>笔记详情</CardTitle>
            {notePage && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Calendar className="h-3.5 w-3.5" />
                编辑时间: {isnewNotePage ? '新建笔记' : new Date(notePage.dateEnd).toLocaleDateString()}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* 标题输入 */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                标题
              </Label>
              <Input 
                id="title" 
                value={ isnewNotePage ? '' : title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="输入笔记标题"
                className="text-lg h-12 border-border/50 focus:border-primary transition-all"
              />
            </div>
            
            {/* 标签输入 */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-base font-medium flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                标签
              </Label>
              <Input 
                id="tags" 
                value={ isnewNotePage ? '' : tags} 
                onChange={handleTagInput} 
                placeholder="输入标签，用逗号分隔"
                className="border-border/50 focus:border-primary transition-all"
              />
              
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.split(',')
                  .map(tag => tag.trim())
                  .filter(tag => tag)
                  .map((tag, index) => (
                    <Badge 
                      key={`${tag}-${index}`} 
                      variant="secondary" 
                      className="transition-all hover:bg-primary/10 hover:text-primary"
                    >
                      {tag}
                    </Badge>
                  ))
                }
              </div>
            </div>
            
            <Separator className="border-border/30" />
            
            {/* Markdown内容编辑 */}
            <div className="space-y-2">
              <Label className="text-base font-medium">内容 (Markdown格式)</Label>
              <Textarea
                value={ isnewNotePage ? '' : content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="输入Markdown内容..."
                className={`
                  min-h-[600px] font-mono text-sm resize-y
                  border-border/50 focus:border-primary transition-all
                  ${theme === 'dark' ? 'bg-muted/50' : 'bg-background'}
                `}
              />
              <p className="text-sm text-muted-foreground">
                支持标准Markdown语法，包括标题、列表、代码块、链接等
              </p>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex flex-wrap justify-end gap-3 pt-4">
              <Button 
                variant="ghost" 
                onClick={handleCancel} 
                disabled={isSaving}
                className="min-w-[100px] border border-border/30 hover:bg-background/80"
              >
                取消
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="min-w-[100px] bg-primary hover:bg-primary/90 transition-all flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? '保存中...' : '保存'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 保存成功提示 */}
        {showSuccessToast && (
          <div className={`
            fixed bottom-6 right-6 max-w-xs p-4 rounded-lg shadow-lg z-50
            ${theme === 'light' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-green-900/80 text-green-100 border border-green-800'}
            backdrop-blur-sm animate-slide-up
            transition-all duration-300
          `}>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-medium">笔记保存成功！</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteEditPage;