'use client'
import { useSession } from "next-auth/react";

export function DashboardHeader() {
    const { data: session } = useSession();

    return (
        <header className="py-6 px-4 mb-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-700 dark:text-white">
                    欢迎回来，{session?.user?.name || '管理员'}！
                </h1>
                <p className="text-slate-600 dark:text-slate-300">
                    管理面板
                </p>
            </div>
        </header>
    )
}