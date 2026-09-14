import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Mic,
  FileText,
  History,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Practice", path: "/sessions/create", icon: Mic },
  { name: "Resume", path: "/resumes", icon: FileText },
  { name: "History", path: "/history", icon: History },
];

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const linkClass = ({ isActive }) =>
    `relative flex items-center gap-3 rounded-[4px] px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive ? "bg-focus/10 text-focus" : "text-slate hover:bg-ink/5 hover:text-ink"
    }`;

  return (
    <aside
      className={`hidden min-h-[calc(100vh-64px)] shrink-0 border-r border-hairline bg-paper md:flex md:flex-col transition-all duration-200 ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.name} to={item.path} className={linkClass} title={collapsed ? item.name : undefined}>
              <Icon size={18} strokeWidth={1.8} className="shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom navigation */}
      <div className="border-t border-hairline p-3 space-y-1">
        <NavLink to="/settings" className={linkClass} title={collapsed ? "Settings" : undefined}>
          <Settings size={18} strokeWidth={1.8} className="shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>

        <button
          onClick={() => setCollapsed((v) => !v)}
          className="w-full flex items-center gap-3 rounded-[4px] px-3 py-2.5 text-sm font-medium text-slate/70 hover:bg-ink/5 hover:text-slate transition-colors"
        >
          {collapsed ? (
            <ChevronsRight size={18} strokeWidth={1.8} />
          ) : (
            <>
              <ChevronsLeft size={18} strokeWidth={1.8} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;