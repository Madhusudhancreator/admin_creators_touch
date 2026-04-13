import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#0d1b2e] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50/5 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
