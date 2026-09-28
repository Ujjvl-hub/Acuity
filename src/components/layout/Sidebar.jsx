
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Mic,
  FileText,
  History,
  BookOpen,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Practice", path: "/sessions/create", icon: Mic },
  { name: "Resume", path: "/resumes", icon: FileText },
  { name: "History", path: "/history", icon: History },
  { name: "Question Bank", path: "/questions", icon: BookOpen },
];

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const linkClass = ({ isActive }) =>
    `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white shadow-sm"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <aside
      className={`hidden min-h-[calc(100vh-68px)] shrink-0 flex-col border-r border-slate-800 bg-[#192440] transition-[width] duration-200 md:flex ${
        collapsed ? "w-[76px]" : "w-64"
      }`}
    >
      {/* Workspace heading */}
      <div
        className={`px-4 pb-3 pt-7 ${
          collapsed ? "text-center" : ""
        }`}
      >
        {!collapsed && (
          <p className="px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </p>
        )}
      </div>

      {/* Main navigation */}
      <nav
        className="flex-1 space-y-1 px-3 pb-5"
        aria-label="Main navigation"
      >
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/dashboard"}
              className={linkClass}
              title={collapsed ? item.name : undefined}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-white/80" />
                  )}

                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-500 text-white"
                        : "bg-transparent text-slate-400 group-hover:text-white"
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.9} />
                  </span>

                  {!collapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom navigation */}
      <div className="space-y-1 border-t border-slate-700/70 p-3">
        <NavLink
          to="/settings"
          className={linkClass}
          title={collapsed ? "Settings" : undefined}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-white/80" />
              )}

              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "text-slate-400 group-hover:text-white"
                }`}
              >
                <Settings size={18} strokeWidth={1.9} />
              </span>

              {!collapsed && <span>Settings</span>}
            </>
          )}
        </NavLink>

        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white ${
            collapsed ? "justify-center" : ""
          }`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : undefined}
        >
          {collapsed ? (
            <ChevronsRight size={19} strokeWidth={1.8} />
          ) : (
            <>
              <ChevronsLeft size={19} strokeWidth={1.8} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;