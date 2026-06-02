'use client'
// 管理员设置页面组件 - 管理管理员账户和设置
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/shadcnComponents/forms/button";
import { Input } from "@/components/ui/shadcnComponents/forms/input";
import { Label } from "@/components/ui/shadcnComponents/forms/label";
import { Plus } from 'lucide-react';
import { motion } from "framer-motion";
import { useSession } from 'next-auth/react';
import { AdminUser } from '@prisma/client';
import { api_adminUser } from '@/hooks/adminUser/api_adminUser';
import { useT } from '@/i18n/LocaleContext';

export default function AdminUsersPage() {
  const t = useT();
  // 管理员管理相关状态
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminSettings, setAdminSettings] = useState({
    email: '',
    password: '',
    editPassword: '',
    enhancedProtection: false
  });
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  const { data: session } = useSession();

  // 获取管理员列表
  const getAdminUsers = async () => {
    try {
      const response = await fetch('/api/adminUser');
      const data = await response.json();
      if (response.ok) {
        setAdminUsers(data);
      }
    } catch (error) {
      console.error('获取管理员列表失败:', error);
    }
  };

  // 添加/更新管理员
  const handleAdminSave = async () => {
    if (!adminSettings.email) {
      alert(t('admin.inputEmail'));
      return;
    }

    if (adminSettings.password && adminSettings.password !== adminSettings.editPassword) {
      alert(t('admin.passwordMismatch'));
      return;
    }

    setIsAdminLoading(true);
    try {
      await api_adminUser.postAdminUser({
        username: adminSettings.email,
        password: adminSettings.password,
        isDynamicEmail: adminSettings.enhancedProtection
      });

      alert(t('admin.saveSuccess'));
      setAdminSettings({
        email: '',
        password: '',
        editPassword: '',
        enhancedProtection: false
      });
      getAdminUsers();

    } catch (error) {
      console.error('保存失败:', error);
      alert(t('admin.saveFailed'));
    } finally {
      setIsAdminLoading(false);
    }
  };

  // 删除管理员
  const handleDeleteAdmin = async (id: string) => {
    if (!confirm(t('admin.deleteConfirm'))) return;

    try {
      await api_adminUser.deleteAdminUser(Number(id));
      alert(t('admin.deleteSuccess'));
      getAdminUsers();

    } catch (error) {
      console.error('删除失败:', error);
      alert(t('admin.deleteFailed'));
    }
  };

  // 切换增强保护模式
  const handleToggleProtection = async (id: string, currentStatus: boolean) => {
    try {
      await api_adminUser.putAdminUser({
        id: Number(id),
        isDynamicEmail: !currentStatus
      });
      getAdminUsers();

    } catch (error) {
      console.error('操作失败:', error);
      alert(t('admin.operationFailed'));
    }
  };

  // 页面加载时获取数据
  useEffect(() => {
    getAdminUsers();
  }, []);

  return (
    <main className="min-h-screen bg-cover bg-center bg-sky-100/60 dark:bg-gray-900/60 py-8">
      <div className="container mx-auto px-4 grid grid-cols-1  gap-8" >

        {/* 添加管理员表单区域 */}
        <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <header className="p-6 pb-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Plus className="h-5 w-5" />
              {t('admin.adminUsers')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('admin.addAdminDesc')}
            </p>
          </header>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('admin.emailAddress')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('admin.emailPlaceholder_admin')}
                value={adminSettings.email}
                onChange={(e) => setAdminSettings({ ...adminSettings, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('admin.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('admin.passwordPlaceholder')}
                value={adminSettings.password}
                onChange={(e) => setAdminSettings({ ...adminSettings, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('admin.confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t('admin.confirmPasswordPlaceholder')}
                value={adminSettings.editPassword}
                onChange={(e) => setAdminSettings({ ...adminSettings, editPassword: e.target.value })}
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <input
                  id="enhancedProtection"
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600"
                  defaultChecked={adminSettings.enhancedProtection}
                  checked={adminSettings.enhancedProtection}
                  onChange={(e) => setAdminSettings({ ...adminSettings, enhancedProtection: e.target.checked })}
                />
                <Label
                  htmlFor="enhancedProtection"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t('admin.enhancedProtection')}
                </Label>
              </div>
              <p className="text-xs text-gray-500 mt-1">{t('admin.enhancedProtectionHint')}</p>
            </div>
            <Button
              onClick={handleAdminSave}
              disabled={isAdminLoading}
              className="w-auto bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {isAdminLoading ? t('admin.saving') : t('admin.saveAdmin')}
            </Button>
          </div>
        </section>

        {/* 管理员列表区域 */}
        <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <header className="p-6 pb-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              {t('admin.adminListCount', { count: adminUsers.length })}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('admin.adminListDesc')}
            </p>
          </header>
          <div>
            <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
              {adminUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>{t('admin.noAdmin')}</p>
                </div>
              ) : (
                adminUsers.map((user: AdminUser) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-gray-900 dark:text-white">{user.username}</div>

                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t('admin.createdAt')}{new Date(user.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleProtection(user.id.toString(), user.isDynamicEmail)}
                        className={user.isDynamicEmail ? 'bg-green-100 dark:bg-green-900 border-green-300' : ''}
                      >
                        {user.isDynamicEmail ? t('admin.protected') : t('admin.unprotected')}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteAdmin(user.id.toString())}
                        disabled={user.username === session?.user?.email}
                        title={user.username === session?.user?.email ? t('admin.cannotDeleteSelf') : t('admin.deleteAdmin')}
                      >
                        {t('admin.delete')}
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}