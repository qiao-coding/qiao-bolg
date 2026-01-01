'use client'
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/shadcnComponents/forms/input';
import { motion } from 'framer-motion';

export function MiscellaneousSearch({
  searchTerm,
  onSearchChange,
}: {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <motion.div 
      className="flex flex-col md:flex-row md:items-center gap-4 mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="搜索说说内容..."
          className="pl-10 focus-visible:ring-2 focus-visible:ring-ring"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </motion.div>
  );
}

