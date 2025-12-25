'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcnComponents/card";
import { Input } from "@/components/ui/shadcnComponents/input";
import { Textarea } from "@/components/ui/shadcnComponents/textarea";
import { Label } from "@/components/ui/shadcnComponents/label";
import { Home } from 'lucide-react';
import type { BlogData } from '@/types/blog/type';

interface BlogBasicInfoProps {
  blogData: BlogData;
  onBlogNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onHomePageChange: (field: 'mainTitle' | 'subTitle', value: string) => void;
  onDynamicTitleChange: (checked: boolean) => void;
  onDynamicTiltCardChange: (checked: boolean) => void;
}

export function BlogBasicInfo({
  blogData,
  onBlogNameChange,
  onHomePageChange,
  onDynamicTitleChange,
  onDynamicTiltCardChange
}: BlogBasicInfoProps) {
  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5 text-sky-500/60" />
          博客基本信息
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="blogName">博客名称</Label>
            <Input
              id="blogName"
              value={blogData.blogName}
              onChange={onBlogNameChange}
              placeholder="请输入博客名称"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mainTitle">主页标题</Label>
            <Input
              id="mainTitle"
              value={blogData.homePage.mainTitle}
              onChange={(e) => onHomePageChange('mainTitle', e.target.value)}
              placeholder="请输入主页标题"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subTitle">主页段落文本</Label>
            <Textarea
              id="subTitle"
              value={blogData.homePage.subTitle}
              onChange={(e) => onHomePageChange('subTitle', e.target.value)}
              rows={3}
              className="resize-none"
              placeholder="请输入主页段落文本"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                id="enableDynamicTitle"
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                checked={blogData.homePage.isDynamicTitle}
                onChange={(e) => onDynamicTitleChange(e.target.checked)}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                开启后，主页标题会随着登录者的GitHub用户名动态变化。
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                id="enableDynamicTiltCard"
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                checked={blogData.homePage.isDynamicTiltCard}
                onChange={(e) => onDynamicTiltCardChange(e.target.checked)}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                开启后，主页的倾斜卡卡片的图像会根据登录者GitHub的头像的动态变化。
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}