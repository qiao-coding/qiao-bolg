'use client'
import { useSession } from "next-auth/react";


export function DashboardHeader() {
    const { data: session } = useSession();


    return (
        <header className="flex flex-col gap-4 py-4 px-6 md:gap-6 md:py-6 border-b mb-4">
            <div className="flex justify-between items-center">
                <p className="text-muted-foreground">欢迎回来，{session?.user?.name}。</p>
            </div>
        </header>
    )

}