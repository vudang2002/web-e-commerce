import StatsCards from "./StatsCards";
import BestSellers from "./BestSellers";
import RecentOrdersTable from "./RecentOrdersTable";

const DashboardHome = () => {
  return (
    <div className="space-y-6">
      {/* Breadcrumb + Date */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <p className="text-sm text-gray-500">Home &gt; Dashboard</p>
        </div>
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <span className="inline-block">
            <i className="ri-calendar-line" />
          </span>
          Oct 11,2023 - Nov 11,2022
        </div>
      </div>

      {/* Stats cards */}
      <StatsCards />

      {/* Sales chart & Best sellers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BestSellers />
      </div>

      {/* Recent orders table */}
      <RecentOrdersTable />
    </div>
  );
};

export default DashboardHome;
