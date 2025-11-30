"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/admin/chart/chart"

import { useNotes } from "@/hooks/note/useNotes"
import { Note } from "@/types/note/type"

export const description = "An interactive area chart"



const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "相关笔记",
    color: "var(--chart-1)",
  }
} satisfies ChartConfig

export function DashboardContentChart() {
  const [noteChartData, setNoteChartData] = React.useState<Note[]>([])


  const notesData = async () => {
    try {

      const notes = await useNotes.getNote()
      setNoteChartData(notes)

    } catch (error) {

    }


  }

  React.useEffect(() => {
    notesData()
  }, [])

  

  const chartData = [
    ...noteChartData.map(note => ({
      date: note.title,
      desktop: note.page?.length || 0,
    }))
  ]



  return (
    <Card className="pt-0 mx-4 mt-6 w-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>笔记分布图</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] md:h-[300px] lg:h-[500px] w-full px-4"
        >
          <AreaChart data={chartData} >
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelKey="date"
                  labelFormatter={(value, payload) => {
                    if (payload ||value) {
                      return payload[0].payload.date || value
                    }
                    return value
                  }}
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
