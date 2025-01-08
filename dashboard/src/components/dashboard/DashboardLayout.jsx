import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import Header from "./Header";

function DashboardLayout() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <div className="flex-1 bg-gray-100 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
