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
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Practice",
    path: "/sessions/create",
    icon: Mic,
  },
  {
    name: "Resume",
    path: "/resumes",
    icon: FileText,
  },
  {
    name: "History",
    path: "/history",
    icon: History,
  },
  {
    name: "Question Bank",
    path: "/questions",
    icon: BookOpen,
  },
];

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-[4px] px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? "bg-focus/10 text-focus"
        : "text-slate hover:bg-ink/5 hover:text-ink"
    }`;

  return (
    <aside
      className={`hidden min-h-[calc(100vh-64px)] shrink-0 border-r border-hairline bg-paper transition-all duration-200 md:flex md:flex-col ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* Main navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={linkClass}
              title={collapsed ? item.name : undefined}
            >
              <Icon
                size={18}
                strokeWidth={1.8}
                className="shrink-0"
              />

              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom navigation */}
      <div className="space-y-1 border-t border-hairline p-3">
        <NavLink
          to="/settings"
          className={linkClass}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings
            size={18}
            strokeWidth={1.8}
            className="shrink-0"
          />

          {!collapsed && <span>Settings</span>}
        </NavLink>

        {/* Collapse button */}
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="flex w-full items-center gap-3 rounded-[4px] px-3 py-2.5 text-sm font-medium text-slate/70 transition-colors hover:bg-ink/5 hover:text-slate"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronsRight
              size={18}
              strokeWidth={1.8}
            />
          ) : (
            <>
              <ChevronsLeft
                size={18}
                strokeWidth={1.8}
              />

              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;