"use client"

import { useEffect, useState } from "react"
import { ChevronRight, FileText } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/shadcnComponents/navigation/collapsible"
import { Button } from "@/components/ui/shadcnComponents/forms/button"
import { ScrollArea } from "@/components/ui/shadcnComponents/navigation/scroll-area"
import type { NotesPage } from "@/types/note/type"

export default function PageNavigation({
  notesPage,
}: {
  notesPage: NotesPage[]
}) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sorted = [...notesPage].sort((a, b) => {
    const aDate = new Date(a.dateStart || "")
    const bDate = new Date(b.dateStart || "")
    return bDate.getTime() - aDate.getTime()
  })

  useEffect(() => {
    if (!notesPage.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id.replace("section-", ""))
            break
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0.1, 0.5] }
    )

    notesPage.forEach((page) => {
      const el = document.getElementById(`section-${page.uid || page.id}`)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [notesPage])

  const handleClick = (uid: string) => {
    const el = document.getElementById(`section-${uid}`)
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      })
    }
  }

  return (
    <Collapsible defaultOpen className="transition-all duration-700 ease-out">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-sm font-semibold group
                     transition-all duration-700"
        >
          <ChevronRight className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
          <FileText className="size-4" />
          笔记目录
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <ScrollArea className="max-h-[60vh] mt-1 duration-700 ease-out">
          <div className="flex flex-col gap-0.5 pr-3 pl-2">
            {sorted.map((page) => {
              const id = page.uid || String(page.id)
              const isActive = activeId === id
              return (
                <Button
                  key={id}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => handleClick(id)}
                  className="w-full justify-start text-xs font-normal h-auto py-1.5 px-2"
                >
                  <span className="truncate">{page.title}</span>
                </Button>
              )
            })}
          </div>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  )
}
