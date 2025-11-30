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
import { Save, ArrowLeft, Tag, FileText, Calendar } from 'lucide-react';
import { useNotes } from '@/hooks/note/useNotes';
import { NotesPage } from '@/types/note/type';
import { AntTabs } from '@/components/ui/ant/ant_taps';
import { useSession } from 'next-auth/react';


export function NoteListPageContentCard(
    {
        notePage,
        upNoteNotePage,
        setUpdateNotePage,
        handleCancel,
        isSaving,
        handleSave
    }:{
        notePage: NotesPage | undefined,
        upNoteNotePage: Partial<NotesPage> | undefined,
        setUpdateNotePage: (notePage: NotesPage) => void,
        handleCancel: () => void,
        isSaving: boolean,
        handleSave: () => Promise<void>
    }
) {

    return (
        <Card className="py-0 shadow-lg border border-border/20 overflow-hidden transition-all duration-500 hover:shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/10 pt-5">
                <CardTitle className="flex items-center gap-2 text-primary text-lg font-bold">
                    <FileText className="h-7 w-7" />
                    笔记详情
                </CardTitle>
                {notePage && (
                    <div>
                        <p className="text-sm pt-2 text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="h-3.5 w-3.5" />
                            创建时间:  {new Date(notePage.dateStart || '').toLocaleDateString()}
                        </p>
                        <p className="text-sm pt-2 text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="h-3.5 w-3.5" />
                            更新时间:  {new Date(notePage.dateEnd || '').toLocaleDateString()}
                        </p>
                    </div>
                )}
            </CardHeader>
            <CardContent className="space-y-6 p-6">
                {/* 标题 */}
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-base font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        标题
                    </Label>
                    <Input
                        id="title"
                        value={upNoteNotePage?.title || ''}
                        onChange={(e) => setUpdateNotePage({ ...notePage!, title: e.target.value })}
                        placeholder="输入笔记标题"
                        className="text-lg h-12 border-border/50 focus:border-primary transition-all"
                    />
                </div>

                {/* 标签输入 */}
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-base mb-2 font-medium flex items-center gap-2">
                        <Tag className="h-4 w-4 text-primary" />
                        标签
                    </Label>
                    <AntTabs defaultTags={notePage?.pageTags} onTagsChange={(tags) => setUpdateNotePage({ ...notePage!, pageTags: tags })} />
                </div>

                <Separator className="border-border/30" />

                <div className="space-y-2">
                    <Label className="text-base font-medium">笔记内容 (Markdown格式)</Label>
                    <Textarea
                        value={upNoteNotePage?.content || ''}
                        onChange={(e) => setUpdateNotePage({ ...notePage!, content: e.target.value })}
                        placeholder="输入笔记内容..."
                        className={`
                  min-h-[600px] font-mono text-sm resize-y
                  border-border/50 focus:border-primary transition-all
                  dark:bg-muted/50 bg-background
                `}
                    />
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
    )

}