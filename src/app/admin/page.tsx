
import DashboardContentN1 from "@/components/features/admin/dashboard/dashboardContentN1";
import { DashboardContentChart } from "@/components/features/admin/dashboard/dashboardContentN2";
import { DashboardHeader } from "@/components/features/admin/dashboard/dashboardHeader";
import { DashboardNavCards } from "@/components/features/admin/dashboard/dashboardNavCards";


export default function AdminPage() {

  return (
    <div className="min-h-screen bg-background text-foreground">

      <DashboardHeader />
      <DashboardNavCards />
      <div className="flex flex-col lg:flex-row gap-4 mt-6">
        <DashboardContentChart />
        <DashboardContentN1 />
      </div>




    </div>
  );
}