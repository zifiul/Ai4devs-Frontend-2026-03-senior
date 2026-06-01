import React from 'react';
import { Outlet } from 'react-router-dom';
import SideNavBar from './SideNavBar';
import TopNavBar from './TopNavBar';

const DashboardLayout: React.FC = () => (
  <div className="min-h-screen bg-[#f9f9f9]">
    <SideNavBar />
    <TopNavBar />
    <main className="pl-[256px] pt-[48px]">
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;
