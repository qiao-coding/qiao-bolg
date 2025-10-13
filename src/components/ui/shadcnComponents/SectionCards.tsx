import { Badge } from "@/components/ui/shadcnComponents/badge"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/shadcnComponents/card"
import { TrendingUp as IconTrendingUp, TrendingDown as IconTrendingDown } from "lucide-react"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-3">
      {/* 访问量数据卡片 */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>访问量</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            0
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            过去30天总访问量
          </div>
        </CardFooter>
      </Card>
      
      {/* 笔记总数数据卡片 */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>笔记总数</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            25
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            平台累计笔记数量
          </div>
        </CardFooter>
      </Card>
      
      {/* 用户量数据卡片 */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>用户</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            2
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            活跃注册用户数
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
