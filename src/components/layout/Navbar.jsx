import { useState } from "react";
import { Link } from "react-router-dom";
import { Flame, Menu, X, ChevronDown } from "lucide-react";

import logo from "../../assets/logo.jpg";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-paper">
      <div className="w-full px-6 sm:px-8 lg:px-10">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex shrink-0 items-center gap-2.5"
            onClick={() => setMobileOpen(false)}
          >
            <img
              src={logo}
              alt="Acuity logo"
              className="h-8 w-8 rounded-full object-cover"
            />

            <span className="text-[17px] font-semibold tracking-tight text-ink">
              Acuity
            </span>
          </Link>

          {/* Desktop actions */}
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

            {/* Profile */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAvatarOpen((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-[4px] py-1 pl-1 pr-2 transition-colors hover:bg-ink/5"
                aria-label="Open profile menu"
                aria-expanded={avatarOpen}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink">
                  <span className="text-xs font-semibold text-paper">
                    UK
                  </span>
                </div>

                <ChevronDown
                  size={14}
                  className={`text-slate transition-transform ${
                    avatarOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {avatarOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-[4px] border border-hairline bg-paper py-1 shadow-lg">
                  <Link
                    to="/settings"
                    onClick={() => setAvatarOpen(false)}
                    className="block px-3 py-2 text-sm text-ink transition-colors hover:bg-ink/5"
                  >
                    Settings
                  </Link>

                  <div className="my-1 border-t border-hairline" />

                  <button
                    type="button"
                    className="block w-full px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-ink/5"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="text-ink md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-hairline px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            
            {/* Streak */}
            <div className="flex items-center gap-1.5 rounded-[4px] border border-brass/30 bg-brass/10 px-3 py-2">
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
              onClick={() => setMobileOpen(false)}
              className="rounded-[4px] bg-focus px-4 py-2.5 text-center text-sm font-semibold text-paper"
            >
              Start session
            </Link>

            {/* Settings */}
            <Link
              to="/settings"
              onClick={() => setMobileOpen(false)}
              className="rounded-[4px] border border-hairline px-4 py-2.5 text-center text-sm font-medium text-ink hover:bg-ink/5"
            >
              Settings
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}