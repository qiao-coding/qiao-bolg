// 管理员仪表板页面组件 - 展示管理功能导航和数据统计
import DashboardContentN1 from "@/components/features/admin/dashboard/dashboardContentN1";
import { DashboardContentChart } from "@/components/features/admin/dashboard/dashboardContentN2";
import { DashboardNavCards } from "@/components/features/admin/dashboard/dashboardNavCards";

export default function AdminPage() {
  return (
    <main>
      <DashboardNavCards />

      {/* 仪表板主要内容区域 */}
      <section className="flex flex-col lg:flex-row gap-6 mt-6">
        <div className="lg:w-2/3">
          <DashboardContentChart />
        </div>
        <div className="lg:w-1/3">
          <DashboardContentN1 />
        </div>
      </section>
    </main>
  );
}