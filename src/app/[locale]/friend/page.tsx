'use client'
import NextRouter from '@/components/layout/NextRouter';
import TechBackgroundNoGrid from '@/components/ui/public/background_img';
import Title from '@/components/ui/public/title';
import React, { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { Input } from '@/components/ui/shadcnComponents/forms/input';
import { Button } from '@/components/ui/shadcnComponents/forms/button';
import { api_friend } from '@/hooks/friend/api_friend';
import { FriendType } from '@/types/friend/type';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/shadcnComponents/overlay/dialog';
import { RotatingCube } from '@/components/features/mol/RotatingCube';
import { PlusIcon } from 'lucide-react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useT } from '@/i18n/LocaleContext';

// 友链页面组件 - 展示和管理友链信息
export default function FriendPage() {
  const t = useT();
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
      alert(t('friend.required'));
      return;
    }

    try {
      await api_friend.postFriend({
        name: friendData.name,
        url: friendData.url,
        avatar: friendData.avatar,
        bio: friendData.bio,
      });
      alert(t('friend.submitSuccess'));
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
      alert(t('friend.submitFailed'));
    }
  };

  return (
    <TechBackgroundNoGrid>
      <NextRouter>
        <div>
          <main className="py-12 px-4 sm:px-6 lg:px-8 min-h-screen max-w-5xl mx-auto pt-28" aria-labelledby="friends-title">
            <header>
              <Title>{t('friend.pageTitle')}</Title>
            </header>

            <section className="flex justify-center w-full">
              {friends.length > 0 ? (
                <section
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl"
                  role="list"
                  aria-label="友链列表"
                >
                  {friends.filter(friend => friend.status).map((friend) => (
                    <Link href={friend.url} key={friend.id} target="_blank" rel="noopener noreferrer" className="group">
                      <article className="
                         overflow-hidden rounded-lg border border-border/70 bg-card/85 shadow-sm
                         transition-colors duration-200 hover:border-brand-blue/35 hover:bg-card
                         ">
                        <section className="p-6 sm:p-7">
                          <header className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-md overflow-hidden bg-brand-blue-soft flex items-center justify-center">
                              {friend.avatar ? (
                                <Image
                                  src={friend.avatar}
                                  alt={friend.name}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                              ) : (
                                <span className="text-brand-pink-deep font-bold">
                                  {friend.name.charAt(0)}
                                </span>
                              )}
                            </div>

                            <h3 className="text-lg font-semibold text-foreground transition-colors duration-300">
                              {friend.name}
                            </h3>
                          </header>

                          <p className="text-muted-foreground mb-5 line-clamp-2 text-sm leading-relaxed">
                            {friend.bio || t('friend.noBio')}
                          </p>

                          <footer className="flex justify-end items-center text-xs pt-3 border-t border-border/60">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-foreground duration-300">
                              {t('friend.visitSite', { name: friend.name })}
                            </span>
                          </footer>
                        </section>
                      </article>
                    </Link>
                  ))}
                </section>
              ) : (
                <section className="flex flex-col justify-center items-center " aria-live="polite" aria-busy="true">
                  <RotatingCube />
                  <p className="text-lg font-medium text-muted-foreground">{t('friend.loading')}</p>
                </section>
              )}
            </section>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="fixed bottom-6 right-6 rounded-md border border-border bg-foreground p-2 text-background shadow-sm transition-colors hover:bg-foreground/85"

                >
                  <PlusIcon className="h-5 w-5" />
                  <span className="">{t('friend.addFriend')}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]
              bg-card">
                <DialogTitle className="sr-only">{t('friend.addFriend')}</DialogTitle>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Input
                      placeholder={t('friend.siteName')}
                      value={friendData.name}
                      onChange={(e) => setFriendData({ ...friendData, name: e.target.value })}
                      className="w-full p-3 border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/35"
                    />
                    <Input
                      placeholder={t('friend.siteUrl')}
                      value={friendData.url}
                      onChange={(e) => setFriendData({ ...friendData, url: e.target.value })}
                      className="w-full p-3 border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/35"
                    />
                    <Input
                      placeholder={t('friend.siteDescription')}
                      value={friendData.bio}
                      onChange={(e) => setFriendData({ ...friendData, bio: e.target.value })}
                      className="w-full p-3 border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/35"
                    />
                    <Input
                      placeholder={t('friend.logoUrl')}
                      value={friendData.avatar}
                      onChange={(e) => setFriendData({ ...friendData, avatar: e.target.value })}
                      className="w-full p-3 border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/35"
                    />
                  </div>
                  <Button onClick={submitFriend} className="w-full bg-foreground text-background hover:bg-foreground/85">
                    {t('friend.submit')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </main>
        </div>
      </NextRouter>
    </TechBackgroundNoGrid>
  )
}
