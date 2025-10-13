"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcnComponents/card"
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/shadcnComponents/chart"
import { useEffect, useState } from "react"
import { Technology } from "./SkillRoadmap"
import { Note } from "@/app/notes/[notesID]/page"

export const description = "A radar chart"

// const chartData = [
//   { month: "January", desktop: 186 },
//   { month: "February", desktop: 305 },
//   { month: "March", desktop: 237 },
//   { month: "April", desktop: 273 },
//   { month: "May", desktop: 209 },
// ]

// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "var(--chart-1)",
//   },
// } satisfies ChartConfig

export function ChartRadarDefault() {
   const [notes, setNotes] = useState<Note[]>([]);

  useEffect(()=>{
    const fetchNotes=async()=>{
      try {
        const res=await fetch('/api/notes')
        if(!res.ok){
          throw new Error('获取数据失败')
        }
         const data=await res.json()
          setNotes(data)
      } catch (error) {
        console.error('获取笔记时出错:', error);
      }finally{

      }
    }
    fetchNotes()
  },[])
  const chartData=notes.map((item)=>({
    month:item.title,
    desktop:item.page.length,
  }))
  const[isTitle,setIsTitle]=useState(true)
 
  return (
    <div>

      {/* 移除 CardHeader 和相关组件的导入 */}

        {/* <ChartContainer
          config={chartConfig}
          className=" aspect-square"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid />
            <Radar
              dataKey="desktop"
              fill="var(--color-desktop)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
   */}
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground flex items-center gap-2 leading-none">
          January - June 2024
        </div>
      </CardFooter> */}
   
    </div>
  )
}
