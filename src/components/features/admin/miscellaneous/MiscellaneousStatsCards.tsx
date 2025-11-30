'use client'
import { Card, CardContent } from '@/components/ui/shadcnComponents/card';
import { MessageCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Miscellaneous {
  id: number;
  content: string;
  date: string;
}

export function MiscellaneousStatsCards({ miscellaneous }: { miscellaneous: Miscellaneous[] }) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm', { locale: zhCN });
    } catch {
      return dateString;
    }
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">总说说数</p>
              <h3 className="text-2xl font-bold mt-1">{miscellaneous.length}</h3>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">最近说说</p>
              <h3 className="text-2xl font-bold mt-1">
                {miscellaneous.length > 0 ?
                  miscellaneous.reduce((latest, current) =>
                    new Date(current.date) > new Date(latest.date) ? current : latest
                  ).date :
                  '暂无'}
              </h3>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <Clock className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

