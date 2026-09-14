import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../features/landing/pages/Home.jsx";
import Login from "../features/auth/pages/Login.jsx";
import Register from "../features/auth/pages/Register.jsx";

import Dashboard from "../features/dashboard/pages/Dashboard.jsx";
import ResumeManager from "../features/resumes/pages/ResumeManager.jsx";

import CreateSession from "../features/sessions/pages/CreateSession.jsx";
import InterviewSession from "../features/sessions/pages/InterviewSession.jsx";
import SessionResult from "../features/sessions/pages/SessionResult.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resumes" element={<ResumeManager />} />
            <Route path="/session/create" element={<CreateSession />} />
          </Route>

          {/* Full-screen interview routes */}
          <Route
            path="/session/:id"
            element={<InterviewSession />}
          />

          <Route
            path="/session/:id/result"
            element={<SessionResult />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;