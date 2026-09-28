
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { getDashboardData } from "../../api/session.api.js";

function getDateKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getStreak(sessions) {
  const dates = [
    ...new Set(
      sessions
        .filter((s) => s.status === "Completed")
        .map((s) => getDateKey(s.created_at))
    ),
  ].sort().reverse();

  if (!dates.length) return 0;

  const today = new Date();
  const todayKey = getDateKey(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = getDateKey(yesterday);

  if (dates[0] !== todayKey && dates[0] !== yesterdayKey) {
    return 0;
  }

  let streak = 0;
  const current = new Date(`${dates[0]}T00:00:00`);

  for (const date of dates) {
    if (getDateKey(current) !== date) break;
    streak++;
    current.setDate(current.getDate() - 1);
  }

  return streak;
}

export default function DashboardLayout() {
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadStreak() {
      try {
        const response = await getDashboardData();
        const sessions = Array.isArray(response.data)
          ? response.data
          : [];

        if (!cancelled) {
          setCurrentStreak(getStreak(sessions));
        }
      } catch (error) {
        console.error("Failed to load streak:", error);
      }
    }

    loadStreak();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <Navbar currentStreak={currentStreak} />
      <div className="flex">
        <Sidebar />
        <main className="min-w-0 flex-1 px-6 py-8 sm:px-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}