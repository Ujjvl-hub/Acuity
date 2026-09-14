import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

// Wraps every authenticated page: Navbar on top, Sidebar on the left,
// page content (children, or an <Outlet /> if you're using react-router)
// scrolls independently on the right.
export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0 px-8 py-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}