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
        <Card className="py-0 relative overflow-hidden rounded-[28px]
         border border-white/70 bg-card/72 backdrop-blur-md
         shadow-[0_24px_70px_rgba(255,132,189,0.14)] transition-all duration-500 hover:shadow-2xl
         dark:border-[#8fb7df]/20 dark:bg-[#202a3f]/74 dark:shadow-[0_24px_70px_rgba(10,18,34,0.28)]">

            <CardContent className="space-y-8 p-8">

                {/* 标题 */}
                <div className="space-y-3">
                    <Label htmlFor="title" className="text-lg font-semibold flex items-center gap-3  px-4 py-2 rounded-lg border border-border/20">
                        <FileText className="h-5 w-5 text-brand-blue-deep dark:text-brand-blue" />
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
                        <Tag className="h-5 w-5 text-brand-blue-deep dark:text-brand-blue" />
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
                            <p className="text-sm text-brand-blue-deep flex items-center gap-2 bg-brand-blue-soft/60 px-3 py-1 rounded-full border border-brand-blue/20 dark:bg-[#b9d7f2]/10 dark:text-[#dbe9f8]">
                                <Calendar className="h-3.5 w-3.5 " />
                                创建时间:  {new Date(notePage.dateStart || '').toLocaleDateString()}
                            </p>
                            <p className="text-sm text-brand-blue-deep
                        flex items-center gap-2
                        bg-brand-blue-soft/60
                         px-3 py-1 rounded-full border border-brand-blue/20 dark:bg-[#b9d7f2]/10 dark:text-[#dbe9f8]">
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
                        className="min-w-[120px] h-11 rounded-full border border-brand-blue/25 bg-white/78 text-brand-blue-deep shadow-sm transition-transform hover:-translate-y-0.5 dark:border-[#8fb7df]/24 dark:bg-[#b9d7f2]/10 dark:text-[#dbe9f8]"
                    >
                        取消
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="min-w-[120px] h-11 rounded-full bg-brand-grad px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(255,143,199,0.28)] transition-transform hover:-translate-y-0.5 flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" />
                        {isSaving ? '保存中...' : '保存'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )

}