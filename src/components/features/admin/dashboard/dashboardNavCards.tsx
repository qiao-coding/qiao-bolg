'use client'
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/shadcnComponents/card"
import { useFriend } from "@/hooks/friend/useFriend";
import { useMiscellaneous } from "@/hooks/miscellaneous/useMiscellaneous";
import { useNotes } from "@/hooks/note/useNotes";
import {
  BookOpen,
  Link as LinkIcon,
  MessageCircle,
} from 'lucide-react';
import { useEffect, useState } from "react";

interface StatCardProps {
  notesValue: number;
  friendsValue: number;
  commentsValue: number;

}

export function DashboardNavCards() {

  const [adminCardData, setAdminCardData] = useState<StatCardProps>({
    notesValue: 0,
    friendsValue: 0,
    commentsValue: 0,
  });


  useEffect(() => {
    const getAdminCardData = async () => {
      const noteRes = await useNotes.getNote();
      const friendRes = await useFriend.getFriendList();
      const commentRes = await useMiscellaneous.getMiscellaneousList();
      setAdminCardData({
        ...adminCardData,
        notesValue: noteRes.length,
        friendsValue: friendRes.length,
        commentsValue: commentRes.length,
      })

    }
    getAdminCardData();
  }, [adminCardData.commentsValue, adminCardData.friendsValue, adminCardData.notesValue])



  const statCards = [
    {
      title: "笔记分类",
      value: +adminCardData.notesValue,
      icon: <BookOpen className="h-6 w-6 text-blue-500" />,
      color: "blue"
    },
    {
      title: "友链",
      value: +adminCardData.friendsValue,
      icon: <LinkIcon className="h-6 w-6 text-yellow-500" />,
      color: "yellow"
    },
    {
      title: "说说",
      value: +adminCardData.commentsValue,
      icon: <MessageCircle className="h-6 w-6 text-pink-500" />,
      color: "pink"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-4">
      {statCards.map((card, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            {card.icon}
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5">
            <div className="text-2xl font-bold">{card.value}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
