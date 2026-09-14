import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Flame, Menu, X, ChevronDown } from "lucide-react";
import logo from "../../assets/logo.jpg";

const NAV_LINKS = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Practice", path: "/sessions/create" },
  { label: "Resume", path: "/resumes" },
  { label: "History", path: "/history" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-paper">
      {/* Full-width navbar */}
      <div className="w-full px-6 sm:px-8 lg:px-10">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex shrink-0 items-center gap-2.5"
          >
            <img
              src={logo}
              alt="Acuity logo"
              className="h-8 w-8 rounded-[5px] object-cover"
            />

            <span className="text-[17px] font-semibold tracking-tight text-ink">
              Acuity
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-ink"
                      : "text-slate hover:text-ink"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}

                    {isActive && (
                      <span className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-focus" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden items-center gap-4 md:flex">

            {/* Streak */}
            <div className="flex items-center gap-1.5 rounded-[4px] border border-brass/30 bg-brass/10 px-3 py-1.5">
              <Flame
                size={15}
                className="text-brass"
                strokeWidth={2.5}
              />

              <span className="text-sm font-semibold text-ink">
                6 day streak
              </span>
            </div>

            {/* Start session */}
            <Link
              to="/sessions/create"
              className="rounded-[4px] bg-focus px-4 py-2 text-sm font-semibold text-paper transition-opacity hover:opacity-90"
            >
              Start session
            </Link>

            {/* Avatar */}
            <div className="relative">
              <button
                onClick={() => setAvatarOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-[4px] py-1 pl-1 pr-2 transition-colors hover:bg-ink/5"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink">
                  <span className="text-xs font-semibold text-paper">
                    UK
                  </span>
                </div>

                <ChevronDown size={14} className="text-slate" />
              </button>

              {avatarOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-[4px] border border-hairline bg-paper py-1 shadow-lg">

                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-sm text-ink hover:bg-ink/5"
                  >
                    Your profile
                  </Link>

                  <Link
                    to="/settings"
                    className="block px-3 py-2 text-sm text-ink hover:bg-ink/5"
                  >
                    Settings
                  </Link>

                  <div className="my-1 border-t border-hairline" />

                  <button
                    className="block w-full px-3 py-2 text-left text-sm text-ink hover:bg-ink/5"
                  >
                    Sign out
                  </button>

                </div>
              )}
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            className="text-ink md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-hairline px-6 py-4 md:hidden">

          <nav className="space-y-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block w-full rounded-[4px] px-3 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-focus/10 text-focus"
                      : "text-slate hover:bg-ink/5"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-3 flex items-center justify-between border-t border-hairline pt-3">

            <div className="flex items-center gap-1.5 rounded-[4px] border border-brass/30 bg-brass/10 px-3 py-1.5">
              <Flame
                size={15}
                className="text-brass"
                strokeWidth={2.5}
              />

              <span className="text-sm font-semibold text-ink">
                6 day streak
              </span>
            </div>

            <Link
              to="/sessions/create"
              onClick={() => setMobileOpen(false)}
              className="rounded-[4px] bg-focus px-4 py-2 text-sm font-semibold text-paper"
            >
              Start session
            </Link>

          </div>
        </div>
      )}
    </header>
  );
}