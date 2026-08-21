'use client'
import { Card, CardContent } from '@/components/ui/shadcnComponents/data-display/card';
import { Globe, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { useLocale } from '@/i18n/LocaleContext';
import { FriendType } from '@/types/friend/type';



export function FriendLinksStatsCards({ friends }: { friends: FriendType[] }) {
  const locale = useLocale();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm', { locale: locale === 'zh' ? zhCN : enUS });
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
      <Card className="relative overflow-hidden rounded-[28px] border border-white/70 bg-card/72 shadow-[0_24px_70px_rgba(255,132,189,0.14)] backdrop-blur-md dark:border-[#8fb7df]/20 dark:bg-[#202a3f]/74 dark:shadow-[0_24px_70px_rgba(10,18,34,0.28)]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">总友链数</p>
              <h3 className="text-2xl font-bold mt-1">{friends.length}</h3>
            </div>
            <div className="p-3 bg-brand-blue-soft dark:bg-[#b9d7f2]/10 rounded-full">
              <Globe className="h-6 w-6 text-brand-blue-deep dark:text-brand-blue" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden rounded-[28px] border border-white/70 bg-card/72 shadow-[0_24px_70px_rgba(255,132,189,0.14)] backdrop-blur-md dark:border-[#8fb7df]/20 dark:bg-[#202a3f]/74 dark:shadow-[0_24px_70px_rgba(10,18,34,0.28)]">
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

      <Card className="relative overflow-hidden rounded-[28px] border border-white/70 bg-card/72 shadow-[0_24px_70px_rgba(255,132,189,0.14)] backdrop-blur-md dark:border-[#8fb7df]/20 dark:bg-[#202a3f]/74 dark:shadow-[0_24px_70px_rgba(10,18,34,0.28)]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">最近添加</p>
              <h3 className="text-2xl font-bold mt-1">
                {latestFriend ? formatDate(latestFriend.createdAt) : '暂无'}
              </h3>
            </div>
            <div className="p-3 bg-brand-pink-soft dark:bg-[#f0b8d4]/10 rounded-full">
              <Clock className="h-6 w-6 text-brand-pink-deep dark:text-brand-pink" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

