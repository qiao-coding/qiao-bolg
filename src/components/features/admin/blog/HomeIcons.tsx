'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcnComponents/data-display/card";
import { Input } from "@/components/ui/shadcnComponents/forms/input";
import { Link } from 'lucide-react';
import type { HomeIcon } from '@/types/blog/type';

interface HomeIconsProps {
  homeIcons: HomeIcon[];
  onHomeIconChange: (id: number, field: 'name' | 'link', value: string) => void;
}

export function HomeIcons({ homeIcons, onHomeIconChange }: HomeIconsProps) {
  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5 text-purple-500" />
          主页图标链接
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {homeIcons.map((icon) => (
            <div key={icon.id} className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Input
                  value={icon.name}
                  onChange={(e) => onHomeIconChange(icon.id, 'name', e.target.value)}
                  placeholder="平台名称"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  value={icon.link}
                  onChange={(e) => onHomeIconChange(icon.id, 'link', e.target.value)}
                  placeholder="链接地址"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}