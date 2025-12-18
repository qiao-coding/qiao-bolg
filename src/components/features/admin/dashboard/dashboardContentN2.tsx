"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcnComponents/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/admin/chart/chart"

import { useNotes } from "@/hooks/note/useNotes"
import { Note } from "@/types/note/type"

const chartConfig = {
  desktop: {
    label: "相关笔记",
    color: "#3b82f6",
  }
} satisfies ChartConfig

export function DashboardContentChart() {
  const [noteChartData, setNoteChartData] = React.useState<Note[]>([])

  const notesData = async () => {
    try {
      const notes = await useNotes.getNote()
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
    <Card className="pt-0 mx-4 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-slate-200/50 dark:border-slate-700/50 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-slate-800 dark:text-white">笔记分布图</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
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
            <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
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
              fill="#3b82f6" 
              radius={8}
              strokeWidth={2}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-slate-700 dark:fill-slate-300"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}