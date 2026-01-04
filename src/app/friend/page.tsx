'use client'
import NextRouter from '@/components/layout/NextRouter';
import TechBackgroundNoGrid from '@/components/ui/public/background_img';
import Title from '@/components/ui/public/title';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/shadcnComponents/forms/input';
import { Button } from '@/components/ui/shadcnComponents/forms/button';
import { useTheme } from 'next-themes';
import { api_friend } from '@/hooks/friend/api_friend';
import { FriendType } from '@/types/friend/type';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/shadcnComponents/overlay/dialog';
import { RotatingCube } from '@/components/features/mol/RotatingCube';
import { motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import { DialogTitle } from '@radix-ui/react-dialog';

// 友链页面组件 - 展示和管理友链信息
export default function FriendPage() {
  const { theme } = useTheme();
  const [friends, setFriends] = useState<FriendType[]>([]);
  const [friendData, setFriendData] = useState<FriendType>({
    id: 0,
    name: '',
    url: '',
    avatar: '',
    bio: '',
    createdAt: '',
    updatedAt: '',
    status: false
  });


  // 获取友链数据(GET)
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await api_friend.getFriendList()
        setFriends(response);
      } catch (error) {
        console.error('获取友链数据失败:', error);
      }
    };

    fetchFriends();
  }, []);

  // 提交友链申请(POST)
  const submitFriend = async () => {
    if (!friendData.name || !friendData.url) {
      alert('请填写必填项：站点名称和站点链接');
      return;
    }

    try {
      await api_friend.postFriend({
        name: friendData.name,
        url: friendData.url,
        avatar: friendData.avatar,
        bio: friendData.bio,
      });
      alert('友链申请提交成功！等待审核');
      setFriendData({
        id: 0,
        name: '',
        url: '',
        avatar: '',
        bio: '',
        createdAt: '',
        updatedAt: '',
        status: false
      });

      // 重新获取数据
      const response = await api_friend.getFriendList()
      setFriends(response);
    } catch (error) {
      console.error('提交友链申请失败:', error);
      alert('提交失败，请重试');
    }
  };

  return (
    <TechBackgroundNoGrid>
      <NextRouter>
        <motion.div
          initial={{ opacity: 0, y: 150, scale: 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <main className="py-12 px-4 sm:px-6 lg:px-8 min-h-screen max-w-5xl mx-auto pt-28" aria-labelledby="friends-title">
            <header>
              <Title >友人帐</Title>
            </header>

            <section className="flex justify-center w-full">
              {friends.length > 0 ? (
                <motion.section
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl"
                  role="list"
                  aria-label="友链列表"
                >
                  {friends.filter(friend => friend.status).map((friend) => (
                    <Link href={friend.url} key={friend.id} target="_blank" rel="noopener noreferrer" className="group">
                      <article className="
                      bg-white/70 dark:bg-slate-800/70
                        hover:bg-white/20
                        dark:hover:bg-slate-700/20

                         border-transparent
                         hover:border
                         hover:border-primary/40
                        

                         backdrop-blur-sm 
                         border
                         rounded-xl overflow-hidden shadow-lg 
                         hover:shadow-xl 
                         transition-all duration-300 
                         hover:-translate-y-1
                         ">
                        <section className="p-6 sm:p-7">
                          <header className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-50 flex items-center justify-center">
                              {friend.avatar ? (
                                <img
                                  src={friend.avatar}
                                  alt={friend.name}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                              ) : (
                                <span className="text-blue-500 font-bold">
                                  {friend.name.charAt(0)}
                                </span>
                              )}
                            </div>

                            <h3 className="text-lg font-semibold text-slate-800 dark:text-white transition-colors duration-300">
                              {friend.name}
                            </h3>
                          </header>

                          <p className={`text-[#64748B] mb-5 line-clamp-2 text-sm leading-relaxed ${theme === 'light' ? 'text-[#64748B]' : 'text-[#D1D5DB]'}`}>
                            {friend.bio || '暂无简介'}
                          </p>

                          <footer className="flex justify-end items-center text-xs pt-3 border-t border-[#EFF6FF]">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-black dark:text-white duration-300">
                              { `前往${friend.name}的基地 →`}
                            </span>
                          </footer>
                        </section>
                      </article>
                    </Link>
                  ))}
                </motion.section>
              ) : (
                <section className="flex flex-col justify-center items-center " aria-live="polite" aria-busy="true">
                  <RotatingCube />
                  <p className="text-3xl text-sky-400 dark:text-white font-bold">正在加载友链...</p>
                </section>
              )}
            </section>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="fixed bottom-6 right-6 
                  p-2 
                   text-white
                    bg-sky-500 dark:bg-slate-600
                    hover:bg-slate-700 dark:hover:bg-slate-500
                     transition-colors duration-300
                     border
                     
                     "
                >
                  <PlusIcon className="h-5 w-5" />
                  <span className="">添加友链</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] 
              bg-slate-50 dark:bg-slate-700">
                <DialogTitle className="sr-only">添加友链</DialogTitle>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="站点名称 *"
                      value={friendData.name}
                      onChange={(e) => setFriendData({ ...friendData, name: e.target.value })}
                      className="w-full p-3 border border-sky-300 focus:shadow-sky-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    />
                    <Input
                      placeholder="站点链接 *"
                      value={friendData.url}
                      onChange={(e) => setFriendData({ ...friendData, url: e.target.value })}
                      className="w-full p-3 border border-sky-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    />
                    <Input
                      placeholder="站点描述"
                      value={friendData.bio}
                      onChange={(e) => setFriendData({ ...friendData, bio: e.target.value })}
                      className="w-full p-3 border border-sky-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    />
                    <Input
                      placeholder="LOGO (URL)"
                      value={friendData.avatar}
                      onChange={(e) => setFriendData({ ...friendData, avatar: e.target.value })}
                      className="w-full p-3 border border-sky-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    />
                  </div>
                  <Button onClick={submitFriend} className="w-full bg-sky-500 hover:bg-sky-600 text-white">
                    提交申请
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </main>
        </motion.div>
      </NextRouter>
    </TechBackgroundNoGrid>
  )
}
