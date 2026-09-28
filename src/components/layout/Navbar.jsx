
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Flame,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
} from "lucide-react";
import useAuth from "../../hooks/useAuth.js";
import logo from "../../assets/logo.jpg";


export default function Navbar({ currentStreak = 0 }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const username = user?.username || "User";
  const email = user?.email || "";
  const initials =
    username
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const handleLogout = () => {
    logout();
    setAvatarOpen(false);
    setMobileOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#30343B] bg-[#17191B]">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-[68px] items-center justify-between">
          {/* Brand */}
          <Link
            to="/dashboard"
            className="flex shrink-0 items-center gap-2.5"
            onClick={() => setMobileOpen(false)}
          >
            <img
              src={logo}
              alt="Acuity logo"
              className="h-9 w-9 rounded-xl object-cover shadow-sm"
            />
            <span className="text-xl font-bold tracking-tight text-white">
              Acuity<span className="text-blue-500">.</span>
            </span>
          </Link>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 md:flex">
            <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2">
              <Flame
                size={17}
                className="text-amber-400"
                strokeWidth={2.3}
              />
              <span className="text-sm font-semibold text-gray-200">
                {currentStreak} day streak
              </span>
            </div>

            <Link
              to="/sessions/create"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
            >
              Start session
            </Link>

            {/* Profile menu */}
            <div className="relative ml-1">
              <button
                type="button"
                onClick={() => setAvatarOpen((prev) => !prev)}
                className={`flex items-center gap-2 rounded-xl border px-2 py-1.5 transition-colors ${
                  avatarOpen
                    ? "border-slate-600 bg-slate-800"
                    : "border-transparent hover:border-slate-700 hover:bg-slate-800"
                }`}
                aria-label="Open profile menu"
                aria-expanded={avatarOpen}
                aria-haspopup="menu"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#192440] text-xs font-semibold text-white">
                  {initials}
                </div>
                <ChevronDown
                  size={15}
                  className={`text-gray-400 transition-transform duration-200 ${
                    avatarOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {avatarOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-3 w-60 overflow-hidden rounded-2xl border border-slate-700 bg-[#202329] py-1.5 shadow-xl shadow-black/30"
                >
                  <div className="border-b border-slate-700 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-white">
                      {username}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-gray-400">
                      {email}
                    </p>
                  </div>

                  <Link
                    to="/settings"
                    role="menuitem"
                    onClick={() => setAvatarOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-slate-800 hover:text-white"
                  >
                    <Settings size={16} />
                    Settings
                  </Link>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 text-gray-200 transition-colors hover:bg-slate-800 md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="border-t border-slate-700 bg-[#17191B] px-4 py-4 sm:px-6 md:hidden">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#202329] p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#192440] text-sm font-semibold text-white">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {username}
                </p>
                <p className="truncate text-xs text-gray-400">{email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5">
              <Flame
                size={17}
                className="text-amber-400"
                strokeWidth={2.3}
              />
              <span className="text-sm font-semibold text-gray-200">
                {currentStreak} day streak
              </span>
            </div>

            <Link
              to="/sessions/create"
              onClick={() => setMobileOpen(false)}
              className="flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Start session
            </Link>

            <Link
              to="/settings"
              onClick={() => setMobileOpen(false)}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:bg-slate-800"
            >
              <Settings size={16} />
              Settings
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}