// 管理员仪表板页面组件 - 展示管理功能导航和数据统计
import DashboardContentN1 from "@/components/features/admin/dashboard/dashboardContentN1";
import { DashboardContentChart } from "@/components/features/admin/dashboard/dashboardContentN2";
import { DashboardNavCards } from "@/components/features/admin/dashboard/dashboardNavCards";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-cover bg-center bg-sky-100/60 dark:bg-gray-900/60">
      <div className="container mx-auto px-4 py-6">
        {/* 仪表板导航区域 */}
        <DashboardNavCards />
        
        {/* 仪表板主要内容区域 */}
        <section className="flex flex-col lg:flex-row gap-6 my-6">
          <div className="w-[88vw] lg:w-2/3">
            {/* 图表内容区域 */}
            <article className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <DashboardContentChart />
            </article>
          </div>
          <div className="lg:w-1/3">
            {/* 统计数据区域 */}
            <article className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <DashboardContentN1 />
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}