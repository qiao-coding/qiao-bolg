'use client'
import { Card, CardContent } from '@/components/ui/shadcnComponents/card';
import { Globe, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Friend {
  id: number;
  name: string;
  url: string;
  avatar?: string;
  bio?: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export function FriendLinksStatsCards({ friends }: { friends: Friend[] }) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm', { locale: zhCN });
    } catch {
      return dateString;
    }
  };

  const activeCount = friends.filter(friend => friend.status).length;
  const latestFriend = friends.length > 0 ?
    friends.reduce((latest, current) =>
      new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
    ) : null;

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">总友链数</p>
              <h3 className="text-2xl font-bold mt-1">{friends.length}</h3>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Globe className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">激活友链</p>
              <h3 className="text-2xl font-bold mt-1">{activeCount}</h3>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">最近添加</p>
              <h3 className="text-2xl font-bold mt-1">
                {latestFriend ? formatDate(latestFriend.createdAt) : '暂无'}
              </h3>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

