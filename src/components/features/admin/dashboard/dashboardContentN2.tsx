"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcnComponents/data-display/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/admin/chart/chart"

import { api_notes } from "@/hooks/note/api_notes"
import { Note } from "@/types/note/type"

const chartConfig = {
  desktop: {
    label: "相关笔记",
    color: "var(--brand-pink)",
  }
} satisfies ChartConfig

export function DashboardContentChart() {
  const [noteChartData, setNoteChartData] = React.useState<Note[]>([])

  const notesData = async () => {
    try {
      const notes = await api_notes.getNote()
      setNoteChartData(notes)
    } catch (error) {
      console.error("获取笔记数据失败:", error)
    }
  }

  React.useEffect(() => {
    notesData()
  }, [])

  const chartData = noteChartData.map((note) => ({
    month: note.title.length > 10 ? note.title.substring(0, 10) + "..." : note.title,
    desktop: note.page?.length || 0,
    title: note.title,
  }))

  return (
    <Card className="pt-0 mx-4 w-full relative overflow-hidden rounded-[28px] border border-white/70 bg-card/72 backdrop-blur-md shadow-[0_24px_70px_rgba(255,132,189,0.14)] transition-all duration-300 hover:shadow-2xl dark:border-[#8fb7df]/20 dark:bg-[#202a3f]/74 dark:shadow-[0_24px_70px_rgba(10,18,34,0.28)]">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-border/40 py-5 sm:flex-row dark:border-[#8fb7df]/20">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-foreground">笔记分布图</CardTitle>
          <CardDescription className="text-muted-foreground">
            展示笔记的分布情况
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2  sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] md:h-[300px] lg:h-[380px] w-full px-4"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent 
                  hideLabel
                  indicator="line"
                />
              }
            />
            <Bar
              dataKey="desktop"
              fill="var(--brand-pink)"
              radius={8}
              strokeWidth={2}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-[var(--muted-foreground)]"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}