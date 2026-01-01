'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcnComponents/data-display/card";
import { Button } from "@/components/ui/shadcnComponents/forms/button";
import { Input } from "@/components/ui/shadcnComponents/forms/input";
import { Textarea } from "@/components/ui/shadcnComponents/forms/textarea";
import { Label } from "@/components/ui/shadcnComponents/forms/label";
import { Save, } from 'lucide-react';
import { motion } from "framer-motion";



export default function AdminAboutPage() {
  const [aboutData, setAboutData] = useState({
    description: "",
    details: [
      { label: "", value: "" },
    ]
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);






  const getAboutData = async () => {
    try {
      const response = await fetch('/api/about');
      const data = await response.json();
      setAboutData(data);
    } catch (error) {
      console.error('获取关于页面数据失败:', error);
      // 使用默认数据
      setAboutData({
        description: "你好！我是昊小白，一名热爱前端开发的前端小白",
        details: [
          { label: "新标签", value: "输入详细信息" }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };
  // 页面加载时获取数据
  useEffect(() => {
    getAboutData();
  }, []);

  // 处理个人简介描述变更
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAboutData({
      ...aboutData,
      description: e.target.value
    });
  };

  // 处理个人信息详情变更
  const handleDetailChange = (index: number, field: 'label' | 'value', value: string) => {
    const updatedDetails = [...aboutData.details];
    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: value
    };

    setAboutData({
      ...aboutData,
      details: updatedDetails
    });
  };

  // 添加新个人信息项
  const handleAddDetail = () => {
    setAboutData({
      ...aboutData,
      details: [
        ...aboutData.details,
        { label: "新标签", value: "输入详细信息" }
      ]
    });
  };

  // 删除个人信息项
  const handleDeleteDetail = (index: number) => {
    const updatedDetails = [...aboutData.details];
    updatedDetails.splice(index, 1);

    setAboutData({
      ...aboutData,
      details: updatedDetails
    });
  };

  // 处理保存
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/about', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aboutData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '保存失败');
      }

      alert('保存成功！');
    } catch (error) {
      console.error('保存关于页面数据失败:', error);
      alert('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };



  return (
    <div className="min-h-screen bg-cover bg-center bg-sky-100/60 dark:bg-gray-900/60 py-8">
      <div className="container mx-auto px-4">

        <div className="mb-8 flex justify-end">
          {/* 操作按钮 */}

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? '保存中...' : '保存更改'}
          </Button>
        </div>

        <div className="grid grid-cols-1  gap-8">
          {/* 个人简介管理 */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                个人简介
              </CardTitle>

            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">个人简介</Label>
                  <Textarea
                    id="description"
                    value={aboutData.description}
                    onChange={handleDescriptionChange}
                    rows={6}
                    className="resize-none"
                    placeholder="请输入您的个人简介..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 个人信息管理 */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                个人信息
              </CardTitle>

            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aboutData.details.map((detail, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    key={index} className="flex gap-2">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={detail.label}
                        onChange={(e) => handleDetailChange(index, 'label', e.target.value)}
                        placeholder="标签名称"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input
                        value={detail.value}
                        onChange={(e) => handleDetailChange(index, 'value', e.target.value)}
                        placeholder="标签值"
                      />
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 h-auto"
                        onClick={() => handleDeleteDetail(index)}
                      >
                        ×
                      </Button>
                    </div>
                  </motion.div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddDetail}
                  className="h-9"
                >
                  添加信息项
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>



      </div>
    </div>
  );
}

