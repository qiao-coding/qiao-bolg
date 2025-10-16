'use client'

import { SectionCards } from "@/components/ui/shadcnComponents/SectionCards";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/shadcnComponents/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartRadarDefault } from "@/components/ui/shadcnComponents/SkillPieChart";
import { Button } from '@/components/ui/shadcnComponents/button';
import { useRouter } from 'next/navigation';

const monthlyData = [
  { name: '7月', 访问量: 0,  文章数量: 5 },
  { name: '8月', 访问量: 0,  文章数量: 15 },
  { name: '9月', 访问量: 0,  文章数量: 5 },
];


export default function AdminPage() {
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/adminLogout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (res.ok) {
        window.dispatchEvent(new Event('authChange'));
        router.push('/adminLogin');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex flex-col gap-4 py-4 px-6 md:gap-6 md:py-6 border-b mb-4">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">欢迎回来，管理员。</p>
          <Button onClick={handleLogout}>登出</Button>
        </div>
      </header>
      
      <SectionCards />
      
      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
        {/* <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>网站活动数据</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ChartContainer config={{}} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="访问量" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="注册用户" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="文章数量" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card> */}
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>笔记类型分布</CardTitle>
              <CardDescription>各类笔记占比统计</CardDescription>
            </CardHeader>
            <ChartRadarDefault/>
          </Card>
        </div>
      </div>
    </div>
  );
}