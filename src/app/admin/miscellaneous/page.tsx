'use client';

import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcnComponents/card';
import { Button } from '@/components/ui/shadcnComponents/button';
import { MiscellaneousStatsCards } from '@/components/features/admin/miscellaneous/MiscellaneousStatsCards';
import { MiscellaneousSearch } from '@/components/features/admin/miscellaneous/MiscellaneousSearch';
import { MiscellaneousTable } from '@/components/features/admin/miscellaneous/MiscellaneousTable';
import { MiscellaneousAddDialog, MiscellaneousEditDialog, MiscellaneousDeleteDialog } from '@/components/features/admin/miscellaneous/MiscellaneousDialogs';
import { miscellaneousType } from '@/types/miscellaneous/type';
import { useMiscellaneous } from '@/hooks/miscellaneous/useMiscellaneous';
import { motion } from 'framer-motion';


const MiscellaneousManagement: React.FC = () => {
  const [miscellaneous, setMiscellaneous] = useState<miscellaneousType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<'date' | null>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [newContent, setNewContent] = useState<string>('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<miscellaneousType | null>(null);
  const [editContent, setEditContent] = useState<string>('');

  const filteredAndSearchedItems = miscellaneous.filter(item =>
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 获取说说数据(GET)
  useEffect(() => {
    const fetchMiscellaneous = async () => {
      try {
        const response = await useMiscellaneous.getMiscellaneousList()
        const formattedItems: miscellaneousType[] = response.map((item: miscellaneousType) => ({
          id: item.id,
          content: item.content,
          date: item.date
        }));
        setMiscellaneous(formattedItems);
      } catch (error) {
        console.error('获取说说数据失败:', error);
        const mockData: miscellaneousType[] = [
          {
            id: 1,
            content: '加载失败',
            date: new Date().toISOString()
          },

        ];
        setMiscellaneous(mockData);
      }
    };

    fetchMiscellaneous();
  }, []);

  // 排序说说
  const sortedItems = [...filteredAndSearchedItems].sort((a, b) => {
    if (!sortField) return 0;

    // 根据日期字段进行排序
    const valueA = new Date(a.date).getTime();
    const valueB = new Date(b.date).getTime();

    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredAndSearchedItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredAndSearchedItems.map(item => item.id));
    }
  };

  //添加说说
  const handleAddItem = async () => {
    try {
      if (newContent.trim()) {
        const newItem: miscellaneousType = {
          id: miscellaneous.length + 1,
          content: newContent,
          date: new Date().toISOString().slice(0, 10),
        };
        setMiscellaneous([...miscellaneous, newItem]);
        setIsAddDialogOpen(false);
        await useMiscellaneous.postMiscellaneous(newItem)
        setNewContent('');
      }
    } catch (error) {
      return console.error('添加新说说失败:', error);
    }
  };

  // 编辑说说
  const handleEditItem = async () => {
    try {
      if (!editItem || !editContent.trim()) {
        return console.error('编辑说说失败: 缺少必要字段');
      }

      const newEditItem: miscellaneousType = {
        id: editItem.id,
        content: editContent,
        date: new Date().toISOString().slice(0, 10)
      };

      const updatedItems = miscellaneous.map(item =>
        item.id === editItem.id ? { ...item, content: editContent } : item
      );

      setMiscellaneous(updatedItems);
      setIsEditDialogOpen(false);

      await useMiscellaneous.putMiscellaneous(newEditItem)
      setEditItem(null);
      setEditContent('');
    } catch (error) {
      return console.error('编辑说说失败:', error);
    }
  };

  // 删除说说
  const handleDeleteItem = async () => {
    try {
      if (itemToDelete !== null) {
        const updatedItems = miscellaneous.filter(item => item.id !== itemToDelete);
        setMiscellaneous(updatedItems);
        setIsDeleteDialogOpen(false);

        await useMiscellaneous.deleteMiscellaneous(itemToDelete)
        setItemToDelete(null);
      }
    } catch (error) {
      console.error('删除说说失败:', error);
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-sky-100/60 dark:bg-slate-600/80 text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <main className="p-6">
        <MiscellaneousStatsCards miscellaneous={miscellaneous} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>说说列表</CardTitle>
              </div>
              <Button
                size="sm"
                className="gap-1 hover:shadow-md transition-shadow"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                <span>发布说说</span>
              </Button>
            </CardHeader>

            <CardContent>
              <MiscellaneousSearch
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />

              <MiscellaneousTable
                items={sortedItems}
                selectedItems={selectedItems}
                sortField={sortField}
                sortDirection={sortDirection}
                onToggleSelectAll={toggleSelectAll}
                onToggleSelectItem={(id) => {
                  if (selectedItems.includes(id)) {
                    setSelectedItems(selectedItems.filter(itemId => itemId !== id));
                  } else {
                    setSelectedItems([...selectedItems, id]);
                  }
                }}
                onEdit={(item) => {
                  setEditItem(item);
                  setEditContent(item.content);
                  setIsEditDialogOpen(true);
                }}
                onDelete={(id) => {
                  setItemToDelete(id);
                  setIsDeleteDialogOpen(true);
                }}
                onSortChange={() => {
                  setSortField('date');
                  setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                }}
              />
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <MiscellaneousAddDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        content={newContent}
        onContentChange={setNewContent}
        onSubmit={handleAddItem}
      />

      <MiscellaneousEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        content={editContent}
        onContentChange={setEditContent}
        onSubmit={handleEditItem}
      />

      <MiscellaneousDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteItem}
      />
    </motion.div>
  );
};

export default MiscellaneousManagement;
