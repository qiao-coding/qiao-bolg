import DashboardContentN1 from "@/components/features/admin/dashboard/dashboardContentN1";
import { DashboardContentChart } from "@/components/features/admin/dashboard/dashboardContentN2";
import { DashboardHeader } from "@/components/features/admin/dashboard/dashboardHeader";
import { DashboardNavCards } from "@/components/features/admin/dashboard/dashboardNavCards";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-cover bg-center bg-sky-100/60 dark:bg-gray-900/60">
      <div className="container mx-auto px-4 py-6">
        {/* <DashboardHeader /> */}
        <DashboardNavCards />
        <div className="flex flex-col lg:flex-row gap-6 my-6">
          <div className="w-[88vw] lg:w-2/3">
            <DashboardContentChart />
          </div>
          <div className="lg:w-1/3">
            <DashboardContentN1 />
          </div>
        </div>
      </div>
    </div>
  );
}