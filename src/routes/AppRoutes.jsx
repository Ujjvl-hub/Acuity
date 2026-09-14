import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../features/landing/pages/Home.jsx";

import Login from "../features/auth/pages/Login.jsx";
import Register from "../features/auth/pages/Register.jsx";

import Dashboard from "../features/dashboard/pages/Dashboard.jsx";

import History from "../features/history/pages/History.jsx";

import QuestionBank from "../features/questions/pages/QuestionBank.jsx";

import ResumeManager from "../features/resumes/pages/ResumeManager.jsx";

import CreateSession from "../features/sessions/pages/CreateSession.jsx";
import InterviewSession from "../features/sessions/pages/InterviewSession.jsx";
import SessionResult from "../features/sessions/pages/SessionResult.jsx";

import Settings from "../features/settings/pages/Settings.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          
          {/* Dashboard layout routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/sessions/create" element={<CreateSession />} />

            <Route path="/resumes" element={<ResumeManager />} />

            <Route path="/history" element={<History />} />

            <Route path="/questions" element={<QuestionBank />} />

            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Full-screen interview routes */}
          <Route
            path="/sessions/:id"
            element={<InterviewSession />}
          />

          <Route
            path="/sessions/:id/result"
            element={<SessionResult />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;