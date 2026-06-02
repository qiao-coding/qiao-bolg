'use client'
import { useSession } from "next-auth/react";
import { useT } from "@/i18n/LocaleContext";

export function DashboardHeader() {
    const { data: session } = useSession();
    const t = useT();

    return (
        <header className="py-6 px-4 mb-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-700 dark:text-white">
                    {t('admin.welcomeBack', { name: session?.user?.name || t('admin.admin') })}
                </h1>
                <p className="text-slate-600 dark:text-slate-300">
                    {t('admin.adminPanel2')}
                </p>
            </div>
        </header>
    )
}