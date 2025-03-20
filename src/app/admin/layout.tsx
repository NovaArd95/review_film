'use client';
import SidebarAuthor from "@/components/admin/SideBarAdmin";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

      {/* Toast Container untuk Notifikasi */}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}