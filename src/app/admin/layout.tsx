'use client';
import SidebarAuthor from "@/components/admin/SideBarAdmin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      {/* Sidebar Author */}
      <SidebarAuthor sidebarOpen={true} setSidebarOpen={() => {}} />
      
      {/* Main Content */}
      <main className="flex-grow p-4">
        {children}
      </main>
    </div>
  );
}
