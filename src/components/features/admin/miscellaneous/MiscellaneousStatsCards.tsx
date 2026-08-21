'use client'
import { Card, CardContent } from '@/components/ui/shadcnComponents/data-display/card';
import { MessageCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Miscellaneous } from '@/types/miscellaneous/type';


export function MiscellaneousStatsCards({ miscellaneous }: { miscellaneous: Miscellaneous[] }) {

  // 获取最新的说说
  const latestMiscellaneous = miscellaneous.length > 0 
    ? miscellaneous.reduce((latest, current) =>
        new Date(current.date) > new Date(latest.date) ? current : latest
      ).date 
    : '暂无';

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="relative overflow-hidden rounded-[28px] border border-white/70 bg-card/72 shadow-[0_24px_70px_rgba(255,132,189,0.14)] backdrop-blur-md transition-shadow duration-300 hover:shadow-2xl dark:border-[#8fb7df]/20 dark:bg-[#202a3f]/74 dark:shadow-[0_24px_70px_rgba(10,18,34,0.28)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">总说说数</p>
                <h3 className="text-2xl font-bold mt-1">{miscellaneous.length}</h3>
              </div>
              <div className="p-3 bg-brand-blue-soft dark:bg-[#b9d7f2]/10 rounded-full">
                <MessageCircle className="h-6 w-6 text-brand-blue-deep dark:text-brand-blue" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="relative overflow-hidden rounded-[28px] border border-white/70 bg-card/72 shadow-[0_24px_70px_rgba(255,132,189,0.14)] backdrop-blur-md transition-shadow duration-300 hover:shadow-2xl dark:border-[#8fb7df]/20 dark:bg-[#202a3f]/74 dark:shadow-[0_24px_70px_rgba(10,18,34,0.28)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">最近说说</p>
                <h3 className="text-2xl font-bold mt-1 truncate max-w-[180px]">
                  {latestMiscellaneous}
                </h3>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

