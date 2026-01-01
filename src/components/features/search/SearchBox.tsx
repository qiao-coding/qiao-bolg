'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '../../ui/shadcnComponents/button';
import { Search } from 'lucide-react';
import { SearchResult, SearchBoxProps } from '../../../types/components/features/search/SearchBox.type';
import { NoteSearchResponse } from '../../../types/note/type';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/shadcnComponents/input';

export function SearchBox({ className }: SearchBoxProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const performSearch = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/notes/search?q=${encodeURIComponent(query.trim())}`);
            console.log('搜索响应状态:', response.status);

            if (response.ok) {
                const data: NoteSearchResponse[] = await response.json();
                console.log('搜索原始数据:', data);

                // 将API返回的数据转换为SearchResult格式
                const results: SearchResult[] = data.flatMap(note => {
                    const noteResults: SearchResult[] = [];

                    // 添加笔记本身
                    noteResults.push({
                        id: `note-${note.id}`,
                        title: note.title,
                        content: note.tags?.join(', ') || '',
                        type: 'note',
                        href: `/notes/${note.id}`
                    });

                    // 添加笔记的页面
                    if (note.page && note.page.length > 0) {
                        note.page.forEach(page => {
                            noteResults.push({
                                id: `page-${page.id}`,
                                title: page.title,
                                content: page.content?.substring(0, 100) || '',
                                type: 'notesPage',
                                href: `/notes/${note.id}/${page.uid}`
                            });
                        });
                    }

                    return noteResults;
                });

                setSearchResults(results);
            } else {
                const errorData = await response.json();
                console.error('搜索API错误:', errorData);
            }
        } catch (error) {
            console.error('搜索失败:', error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                // 如果输入框为空，则收起输入框
                if (!searchQuery.trim()) {
                    setIsExpanded(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchQuery]);

    const handleSearch = () => {
        performSearch(searchQuery)
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(searchQuery);
            setIsOpen(true);
        }
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
        if (!isExpanded) {
            // 展开时聚焦输入框
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    };


    return (
        <div ref={searchRef} className={`relative ${className}`}>
            <div className="flex items-center">
                {/* 放大镜按钮 */}
                <motion.div
                    animate={{
                        marginRight: isExpanded ? "8px" : "0px",
                    }}
                    transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                    }}
                    whileHover={{ scale: 1.04, rotate: -15 }}
                >
                    {!isExpanded && <Button
                        size="sm"
                        onClick={toggleExpand}
                        className="bg-transparent hover:bg-transparent text-lg shadow-none border-none p-2 cursor-pointer"
                    >
                        🔍
                    </Button>}
                </motion.div>

                {/* 输入框和查找按钮容器 */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            className="flex items-center bg-white/90 dark:bg-gray-800/90 border border-sky-300 dark:border-sky-600 rounded-lg overflow-hidden"
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "250px", opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.2, delay: 0.1 }}
                                className="flex-1"
                            >
                                <input
                                    ref={inputRef}
                                    placeholder="搜索笔记..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => setIsOpen(true)}
                                    className="w-full border-0 p-2 outline-none bg-transparent focus:ring-0 focus:border-none"
                                />
                            </motion.div>
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.2, delay: 0.15 }}
                            >
                                <Button
                                    size="sm"
                                    onClick={handleSearch}
                                    
                                    className="bg-sky-500 hover:bg-sky-600 text-white
                   rounded-l-none h-full min-h-10"
                                >
                                    查找
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 搜索结果下拉菜单 */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="absolute top-full right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-lg bg-white shadow-lg dark:bg-gray-800 p-2 z-50"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isLoading ? (
                            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                搜索中...
                            </div>
                        ) : searchResults.length === 0 ? (
                            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                {searchQuery.trim() ? '未找到相关笔记' : '输入关键词搜索笔记'}
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {searchResults.map((result) => (
                                    <Link
                                        key={result.id}
                                        href={result.href}
                                        className="block p-3 cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        onClick={() => {
                                            setIsOpen(false);
                                            setSearchQuery('');
                                            setIsExpanded(false);
                                        }}
                                    >
                                        <div className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                                            {result.title}
                                        </div>
                                        {result.content && (
                                            <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                                {result.content}
                                            </div>
                                        )}
                                        <div className="text-xs text-sky-600 dark:text-sky-400 mt-1">
                                            {result.type === 'note' ? '笔记' : '页面'}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
