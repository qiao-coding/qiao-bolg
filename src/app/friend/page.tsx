'use client'
import NextRouter from '@/components/layout/NextRouter';
import TechBackgroundNoGrid from '@/components/ui/public/background_img';
import Title from '@/components/ui/public/title';
import AnimatedContent from '@/components/ui/shadcnComponents/AnimatedContent';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/shadcnComponents/input';
import { Button } from '@/components/ui/shadcnComponents/button';
import { useTheme } from 'next-themes';
import { useFriend } from '@/hooks/friend/useFriend';
import { FriendType } from '@/types/friend/type';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/shadcnComponents/dialog';
import { RotatingCube } from '@/components/features/mol/RotatingCube';
import { motion } from 'framer-motion';



const Friend = () => {
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
        const response = await useFriend.getFriendList()
        setFriends(response);
      } catch (error) {
        console.error('获取友链数据失败:', error);
      }
    };

    fetchFriends();
  }, []);


  //提交友链
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!friendData?.name || !friendData?.url) {
        alert("请填写完整信息！");
        return;
      }
      const newFriend: FriendType = {
        id: friends.length + 1,
        name: friendData.name,
        url: friendData.url,
        avatar: friendData.avatar,
        bio: friendData.bio,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: false
      }

      const res = await useFriend.postFriend(newFriend)
      if (res) {
        alert('提交友链成功！');
        setFriendData({
          id: 0,
          name: '',
          url: '',
          avatar: '',
          bio: '',
          createdAt: '',
          updatedAt: '',
          status: false
        })

      }

    } catch (error) {
      return alert('提交友链失败，请稍后重试');
    }


  }

  return (
    <TechBackgroundNoGrid>
      <NextRouter>

        <AnimatedContent
          distance={150}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={1}
          threshold={0.1}
        >
          <article className="pt-18 min-h-screen">
            <Title>
              友链
            </Title>
            {friends.length > 0 ? (
              <motion.article
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="">
                <div className="mb-8 text-center max-w-2xl mx-auto">
                  <p className="text-[#64748B] dark:text-[#94A3B8] text-base">
                    这里是我们的博客链接，欢迎访问交流。
                    也欢迎你前来交换友链，共同进步吧，加油！
                  </p>
                </div>
                {/* 添加友链弹窗 */}
                <section className='flex justify-center mb-8'>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className='border border-sky-300/80 bg-sky-300/80 text-white'>添加友链</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <article className="">
                        <div className=" m-auto  pb-5 ">
                          <span className="text-2xl font-bold text-[#64748B] flex justify-center p-4">
                            友友链
                          </span>
                          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <Input
                              placeholder="站点名称"
                              value={friendData.name}
                              onChange={(e) => setFriendData({ ...friendData, name: e.target.value })}
                              className="w-full p-3 border border-sky-300 focus:shadow-sky-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                            />
                            <Input
                              placeholder="站点链接"
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
                            <div className="flex justify-end">
                              <Button
                                variant="default"
                                className="w-20 p-3 text-sky-300 font-bold bg-transparent rounded-md hover:bg-sky-400 hover:text-white transition-colors duration-300 cursor-pointer border border-sky-300"
                              >
                                提交
                              </Button>
                            </div>
                          </form>
                        </div>
                      </article>
                    </DialogContent>
                  </Dialog>
                </section>




                <div className="grid 
                grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6
                 lg:w-[50vw] m-auto p-4 ">
                  {friends.map((friend) => (
                    <Link
                      key={friend.id}
                      href={friend.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group ${theme === 'light' ? 'bg-white' : 'bg-[#1F2937]'} hover:bg-transparent transition-colors rounded-xl shadow-[0_2px_12px_rgba(59,130,246,0.07)] hover:shadow-[0_12px_16px_rgba(59,130,246,0.12)] transition-all duration-300 overflow-hidden border  ${theme === 'light' ? 'border-[#D1D5DB]' : 'border-gray-700'}`}
                    >
                      <div className="p-6 sm:p-7 ">
                        <div className="flex items-center gap-4 mb-4">
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

                          <h3 className="text-lg font-semibold  transition-colors duration-300">
                            {friend.name}
                          </h3>
                        </div>

                        <p className={`text-[#64748B] mb-5 line-clamp-2 text-sm leading-relaxed ${theme === 'light' ? 'text-[#64748B]' : 'text-[#D1D5DB]'}`}>
                          {friend.bio || '暂无简介'}
                        </p>

                        <div className="flex justify-end items-center text-xs pt-3 border-t border-[#EFF6FF]">
                          <span className=" opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {friend.name === 'HaoWhite' ? '已经在博客,那... , 你喜欢就好 →' : `前往${friend.name}的基地 →`}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                  }
                </div>
              </motion.article>
            ) : (
              <div className="flex flex-col justify-center items-center ">
                <RotatingCube />
                <p className="text-3xl text-sky-400 dark:text-white font-bold">正在加载友链...</p>
              </div>
            )}

          </article>

        </AnimatedContent>
      </NextRouter>
    </TechBackgroundNoGrid>
  )
}

export default Friend;
