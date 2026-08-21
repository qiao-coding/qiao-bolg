'use client'
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/shadcnComponents/data-display/card"
import { api_friend } from "@/hooks/friend/api_friend";
import { api_miscellaneous } from "@/hooks/miscellaneous/api_miscellaneous";
import { api_notes } from "@/hooks/note/api_notes";
import { Link } from "@/i18n/navigation";
import {
  BookOpen,
  Link as LinkIcon,
  MessageCircle,
} from 'lucide-react';
import { useEffect, useState } from "react";

interface AdminCardData {
  notesCount: number;
  friendsCount: number;
  miscellaneousCount: number;
}

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  link: string;
}

export function DashboardNavCards() {
  const [adminCardData, setAdminCardData] = useState<AdminCardData>({
    notesCount: 0,
    friendsCount: 0,
    miscellaneousCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAdminCardData = async () => {
      try {
        setIsLoading(true);
        const [noteRes, friendRes, miscellaneousRes] = await Promise.all([
          api_notes.getNote(),
          api_friend.getFriendList(),
          api_miscellaneous.getMiscellaneousList()
        ]);
        
        setAdminCardData({
          notesCount: noteRes.length,
          friendsCount: friendRes.length,
          miscellaneousCount: miscellaneousRes.length,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败');
        console.error('获取仪表板数据失败:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getAdminCardData();
  }, []); // 移除依赖数组，避免无限循环

  const statCards: StatCard[] = [
    {
      title: "笔记分类",
      value: adminCardData.notesCount,
      icon: <BookOpen className="h-6 w-6 text-brand-blue" />,
      color: "blue",
      link: "/admin/notes"
    },
    {
      title: "友链",
      value: adminCardData.friendsCount,
      icon: <LinkIcon className="h-6 w-6 text-brand-pink" />,
      color: "yellow",
      link: "/admin/friend-links"
    },
    {
      title: "说说",
      value: adminCardData.miscellaneousCount,
      icon: <MessageCircle className="h-6 w-6 text-brand-blue-deep" />,
      color: "pink",
      link: "/admin/miscellaneous"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-32 rounded-[28px] bg-brand-blue-soft/40 dark:bg-[#b9d7f2]/10"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-8 text-center text-red-500">
        <p>加载数据失败: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-4">
      {statCards.map((card, index) => (
        <Link key={index} href={card.link || "#"} passHref>
          <Card
            className="relative overflow-hidden rounded-[28px] border border-white/70 bg-card/72 shadow-[0_24px_70px_rgba(255,132,189,0.14)] backdrop-blur-md transition-all duration-300 cursor-pointer hover:shadow-2xl dark:border-[#8fb7df]/20 dark:bg-[#202a3f]/74 dark:shadow-[0_24px_70px_rgba(10,18,34,0.28)]"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                {card.title}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5">
              <div className="text-2xl font-bold text-foreground">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                总数
              </p>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}