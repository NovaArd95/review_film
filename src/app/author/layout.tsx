'use client';
import SidebarAuthor from "@/components/author/film/SidebarAuthor";
import Navbar from "@/components/author/film/NavbarAuthor";

export default function AuthorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      {/* Sidebar Author */}
      <SidebarAuthor sidebarOpen={true} setSidebarOpen={() => {}} />
      
      {/* Main Content */}
      <main className="flex-grow p-4 mt-16 ml-64"> {/* ml-64 untuk memberi ruang di sebelah kiri agar tidak tertutup sidebar */}
        <Navbar />
        {children}
      </main>
    </div>
  );
}