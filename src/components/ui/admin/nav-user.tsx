"use client"

import {
  ChevronsUpDown,
  LogOut,
} from "lucide-react"


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/shadcnComponents/overlay/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/shadcnComponents/navigation/sidebar"
import Link from "next/link"
import { useSession } from "next-auth/react"
import Image from "next/image"

export function NavUser({
  user,
}: {
  user: {
    name: string
    username: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const { data: session } = useSession()




  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="
              bg-sky-200/40 hover:bg-sky-300/40
               hover:dark:bg-slate-600/40 
               dark:bg-slate-600/40 
               rounded-none text-foreground
               text-black dark:text-white
               "
            >
              <Image
                src={session?.user?.image || ''}
                width={40}
                height={40}
                alt={''}
                className="rounded-full"
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{session?.user?.name}</span>
                <span className="truncate text-xs">{user.username}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 
            rounded-lg bg-sky-200 dark:bg-slate-600"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Image
                  src={session?.user?.image || ''}
                  width={40}
                  height={40}
                  alt={user.name}
                  className="rounded-full"
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{session?.user?.name}</span>
                  <span className="truncate text-xs">{user.username}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                账户
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                账单
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                通知
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
            <DropdownMenuSeparator />
            <Link href="/" className="text-red-500">
              <DropdownMenuItem className="text-red-500">
                <LogOut className="text-red-500" />
                返回主页
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
