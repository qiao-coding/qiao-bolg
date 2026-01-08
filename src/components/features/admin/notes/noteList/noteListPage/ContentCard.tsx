'use client'
import React, { useCallback } from "react";
import { Button } from '@/components/ui/shadcnComponents/forms/button';
import { Input } from '@/components/ui/shadcnComponents/forms/input';
import { Card, CardContent, CardHeader} from '@/components/ui/shadcnComponents/data-display/card';
import { Label } from '@/components/ui/shadcnComponents/forms/label';
import { Separator } from '@/components/ui/shadcnComponents/navigation/separator';
import { Save,Tag, FileText, Calendar } from 'lucide-react';
import { NotesPage } from '@/types/note/type';
import { AntTabs } from '@/components/ui/ant/ant_taps';
import "easymde/dist/easymde.min.css";
import { useTheme } from "next-themes";
import MarkdownEditor from "@/components/features/editor/markdown/markdownEditor";




export function NoteListPageContentCard(
    {
        notePage,
        upNoteNotePage,
        setUpdateNotePage,
        handleCancel,
        isSaving,
        handleSave
    }: {
        notePage: NotesPage | undefined,
        upNoteNotePage: Partial<NotesPage> | undefined,
        setUpdateNotePage: (notePage: NotesPage) => void,
        handleCancel: () => void,
        isSaving: boolean,
        handleSave: () => Promise<void>
    }
) {

    const { resolvedTheme } = useTheme();

    const handleTagsChange = useCallback((tags: string[]) => {
        setUpdateNotePage({ ...(upNoteNotePage || notePage) as NotesPage, pageTags: tags });
    }, [upNoteNotePage, notePage, setUpdateNotePage]);





    return (
        <Card className="py-0 border border-border/40
         overflow-hidden 
         transition-all duration-500 hover:shadow-2xl 
         backdrop-blur-sm bg-card/80 dark:bg-card/80">

            <CardContent className="space-y-8 p-8">

                {/* 标题 */}
                <div className="space-y-3">
                    <Label htmlFor="title" className="text-lg font-semibold flex items-center gap-3  px-4 py-2 rounded-lg border border-border/20">
                        <FileText className="h-5 w-5 text-primary/80" />
                        标题
                    </Label>
                    <Input
                        id="title"
                        value={upNoteNotePage?.title||''}
                        onChange={(e) => setUpdateNotePage({ ...(upNoteNotePage || notePage) as NotesPage, title: e.target.value })}
                        placeholder="输入笔记标题"
                        className="text-lg h-14 border-border/40 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 
                        transition-all duration-300 rounded-xl px-4 bg-gradient-to-br from-card/50 to-card/30
"
                    />
                </div>

                {/* 标签输入 */}
                <div className="space-y-3">
                    <Label htmlFor="title" className="text-lg 
                    font-semibold flex items-center gap-3  px-4 py-2
                     rounded-lg border border-border/20">
                        <Tag className="h-5 w-5 text-primary/80" />
                        标签
                    </Label>
                    <div className="border border-border/30 rounded-xl p-4 bg-gradient-to-br from-card/50 to-card/30">
                        <AntTabs defaultTags={upNoteNotePage?.pageTags} onTagsChange={handleTagsChange} />
                    </div>
                </div>
                <CardHeader className="
            border-b border-border/20
             pt-4 pb-4 mb-4 px-6">
                    {notePage && (
                        <div className="flex gap-4 mt-2">
                            <p className="text-sm text-primary/70 flex items-center gap-2 bg-gradient-to-r from-primary/5 to-primary/10 px-3 py-1 rounded-lg border border-border/20">
                                <Calendar className="h-3.5 w-3.5 " />
                                创建时间:  {new Date(notePage.dateStart || '').toLocaleDateString()}
                            </p>
                            <p className="text-sm text-primary/70 
                        flex items-center gap-2 
                        bg-gradient-to-r from-primary/5 to-primary/10
                         px-3 py-1 rounded-lg border border-border/20">
                                <Calendar className="h-3.5 w-3.5 " />
                                更新时间:  {new Date(notePage.dateEnd || '').toLocaleDateString()}
                            </p>
                        </div>
                    )}
                </CardHeader>

                <Separator className="border-border/40" />

                <div className="space-y-3">
                    <Label className="text-lg font-semibold 
                    flex items-center gap-3  px-4 py-2 
                     border border-border/20">
                        笔记内容 (Markdown格式)
                    </Label>

                    <div className="h-170"
                    >
                        <MarkdownEditor
                            key={notePage?.uid}
                            value={upNoteNotePage?.content || ''}
                            onSave={handleSave}
                            onChange={(content) => setUpdateNotePage({ ...(upNoteNotePage || notePage) as NotesPage, content: content || '' })}
                            showToolbar={true}
                            showStatusBar={true}
                            initialMode="split"
                            className="border border-solid rounded-lg "
                            
                            theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
                        />

                    </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex flex-wrap justify-end gap-4 pt-6">
                    <Button
                        variant="ghost"
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="min-w-[120px] border border-border/40 hover:bg-background/80 hover:border-primary/30 transition-all duration-300 h-11 rounded-xl"
                    >
                        取消
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="min-w-[120px] bg-sky-400/70 dark:bg-slate-400/90 hover:from-primary/90 hover:to-primary transition-all duration-300 flex items-center gap-2 h-11 rounded-xl shadow-lg hover:shadow-xl"
                    >
                        <Save className="h-4 w-4" />
                        {isSaving ? '保存中...' : '保存'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )

}