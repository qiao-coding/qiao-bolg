'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcnComponents/card";
import { Input } from "@/components/ui/shadcnComponents/input";
import { Label } from "@/components/ui/shadcnComponents/label";
import { User } from 'lucide-react';
import type { BlogData } from '@/types/blog/type';

interface SidebarSettingsProps {
  notesSidebar: BlogData['notesSidebar'];
  onSidebarChange: (field: 'name' | 'email', value: string) => void;
  onContactChange: (id: number, field: 'name' | 'link', value: string) => void;
  onDynamicNameChange: (checked: boolean) => void;
  onDynamicEmailChange: (checked: boolean) => void;
}

export function SidebarSettings({
  notesSidebar,
  onSidebarChange,
  onContactChange,
  onDynamicNameChange,
  onDynamicEmailChange
}: SidebarSettingsProps) {
  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-orange-500" />
          侧边栏设置
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sidebarName">昵称</Label>
              <Input
                id="sidebarName"
                value={notesSidebar.name}
                onChange={(e) => onSidebarChange('name', e.target.value)}
                placeholder="请输入昵称"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sidebarEmail">邮箱</Label>
              <Input
                id="sidebarEmail"
                value={notesSidebar.email}
                onChange={(e) => onSidebarChange('email', e.target.value)}
                placeholder="请输入邮箱"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">联系信息</h3>
            <div className="space-y-4">
              {notesSidebar.socialLinks.map((contact) => (
                <div key={contact.id} className="flex gap-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={contact.name}
                      onChange={(e) => onContactChange(contact.id, 'name', e.target.value)}
                      placeholder="平台名称"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      value={contact.link}
                      onChange={(e) => onContactChange(contact.id, 'link', e.target.value)}
                      placeholder="链接地址"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                id="useGithubName"
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                checked={notesSidebar.isDynamicName}
                onChange={(e) => onDynamicNameChange(e.target.checked)}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                使用默认呢称（如GitHub昵称）
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                id="hideEmail"
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                checked={notesSidebar.isDynamicEmail}
                onChange={(e) => onDynamicEmailChange(e.target.checked)}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                隐藏邮箱地址
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}