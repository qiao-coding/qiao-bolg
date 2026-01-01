'use client'
import Link from "next/link";
import { Button } from "@/components/ui/shadcnComponents/forms/button";
import { Shield, User } from "lucide-react";


import { usePathname } from "next/navigation";

export default function UserQuickNavigation() {
    const pathname = usePathname();


  return (
   <div className="px-6 mb-6">
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/user-management">
            <Button variant={pathname === '/admin/user-management' ? 'default' : 'ghost'} size="sm" className="gap-1">
              <User className="h-4 w-4" />
              <span>普通用户</span>
            </Button>
          </Link>
          <Link href="/admin/user-management/admin-users">
            <Button variant={pathname === '/admin/user-management/admin-users' ? 'default' : 'ghost'} size="sm" className="gap-1">
              <Shield className="h-4 w-4" />
              <span>管理员用户</span>
            </Button>
          </Link>
          {/* <Link href="/admin/user-management/comment-management">
            <Button variant="ghost" size="sm" className="gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>评论管理</span>
            </Button>
          </Link> */}
        </div>
      </div>
  )
}