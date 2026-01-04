'use client'
// 管理员关于页面组件 - 管理个人简介和详细信息
import React, { useState, useEffect } from 'react';
import { CardContent, CardHeader, CardTitle } from "@/components/ui/shadcnComponents/data-display/card";
import { Button } from "@/components/ui/shadcnComponents/forms/button";
import { Input } from "@/components/ui/shadcnComponents/forms/input";
import { Textarea } from "@/components/ui/shadcnComponents/forms/textarea";
import { Label } from "@/components/ui/shadcnComponents/forms/label";
import { Save, TrashIcon, } from 'lucide-react';
import { motion } from "framer-motion";
import { api_about } from '@/hooks/about/api_about';
import { AboutDetail } from '@/types/about/type';



export default function AdminAboutPage() {
  const [aboutData, setAboutData] = useState<AboutDetail>({
    description: "",
    details: [
      { label: "", value: "" },
    ]
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);






  const getAboutData = async () => {
    try {
      const response = await api_about.getAbout();
      setAboutData(response);
    } catch (error) {
      console.error('获取关于页面数据失败:', error);
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

  // 保存关于页面数据
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api_about.postAbout(aboutData);
      // 保存成功提示
      alert('关于页面信息已更新');
    } catch (error) {
      console.error('保存关于页面数据失败:', error);
      alert('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  // 添加详情项
  const addDetailItem = () => {
    setAboutData({
      ...aboutData,
      details: [...aboutData.details, { label: "", value: "" }]
    });
  };

  // 更新详情项
  const updateDetailItem = (index: number, field: 'label' | 'value', value: string) => {
    const updatedDetails = [...aboutData.details];
    updatedDetails[index] = { ...updatedDetails[index], [field]: value };
    setAboutData({
      ...aboutData,
      details: updatedDetails
    });
  };

  // 删除详情项
  const removeDetailItem = (index: number) => {
    if (aboutData.details.length <= 1) return; // 至少保留一项
    const updatedDetails = aboutData.details.filter((_, i) => i !== index);
    setAboutData({
      ...aboutData,
      details: updatedDetails
    });
  };

  // 页面加载时获取数据
  useEffect(() => {
    getAboutData();
  }, []);

  return (
    <main className="min-h-screen bg-cover bg-center bg-sky-100/60 dark:bg-gray-900/60 py-8">
      <div className="container mx-auto px-4 grid grid-cols-1  gap-8" >


        {/* 个人简介编辑区域 */}
        <section className="bg-white/80 py-8 dark:bg-gray-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>个人简介</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
       
              <div className="space-y-6">
                <div className="space-y-2">
                  <Textarea
                    id="description"
                    value={aboutData.description}
                    onChange={(e) => setAboutData({...aboutData, description: e.target.value})}
                    placeholder="请输入个人描述"
                    className="min-h-[120px]"
                  />
                </div>

                {/* 详细信息列表 */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">详细信息</h3>
                    <Button type="button" onClick={addDetailItem} variant="outline" size="sm">
                      添加项目
                    </Button>
                  </div>

                  {aboutData.details.map((detail, index) => (
                    <motion.div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4
                       p-2 border rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-2">
                        <Input
                          id={`label-${index}`}
                          value={detail.label}
                          onChange={(e) => updateDetailItem(index, 'label', e.target.value)}
                          placeholder="例如：生日"
                        />
                      </div>
                      <div className="space-y-2 flex items-end gap-2">
                        <div className="flex-grow space-y-2">
                          <Input
                            id={`value-${index}`}
                            value={detail.value}
                            onChange={(e) => updateDetailItem(index, 'value', e.target.value)}
                            placeholder="2005-7-7"
                          />
                        </div>
                        {aboutData.details.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeDetailItem(index)}
                            variant="outline"
                            size="icon"
                            className="h-10 w-10"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        保存中...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        保存更改
                      </>
                    )}
                  </Button>
                </div>
              </div>
          </CardContent>
        </section>
      </div>
    </main>
  );
}
