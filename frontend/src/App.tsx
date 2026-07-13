import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Layout & Pages
import Layout from "./components/Layout";
import { SettingsProvider } from "./context/SettingsContext";
import Landing from "./pages/Landing";
import LandingV2 from "./pages/LandingV2";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OAuthCallback from "./pages/OAuthCallback";
import Dashboard from "./pages/Dashboard";
import Incidents from "./pages/Incidents";
import FileAnalysis from "./pages/FileAnalysis";
import Report from "./pages/Report";
import Evidence from "./pages/Evidence";
import Timeline from "./pages/Timeline";
import Users from "./pages/Users";
import AuditLog from "./pages/AuditLog";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import History from "./pages/History";
import ThreatIntel from "./pages/ThreatIntel";
import UltraAdmin from "./pages/UltraAdmin";
import Documentation from "./pages/Documentation";
import MissionWizard from "./pages/MissionWizard";
import NotFound from "./pages/NotFound";

// Initialize Query Client for TanStack Query API calls
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

const AUTH_TOKEN_KEY = "forensiguard_token";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuth = Boolean(localStorage.getItem(AUTH_TOKEN_KEY));
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const isAuth = Boolean(localStorage.getItem(AUTH_TOKEN_KEY));

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Marketing/Auth routes */}
            <Route index element={isAuth ? <Navigate to="/dashboard" replace /> : <Landing />} />
            <Route path="landing-v2" element={<LandingV2 />} />
            <Route path="login" element={isAuth ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="register" element={isAuth ? <Navigate to="/dashboard" replace /> : <Register />} />
            <Route path="auth/callback" element={<OAuthCallback />} />
            <Route path="docs" element={<Documentation />} />

          {/* Secure application shell */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="incidents" element={<Incidents />} />
            <Route path="analysis" element={<FileAnalysis />} />
            <Route path="intel" element={<ThreatIntel />} />
            <Route path="history" element={<History />} />
            <Route path="report/:id" element={<Report />} />
            <Route path="evidence" element={<Evidence />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="users" element={<Users />} />
            <Route path="audit" element={<AuditLog />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="ultra-admin" element={<UltraAdmin />} />
            <Route path="mission" element={<MissionWizard />} />
          </Route>

          {/* Fallback routing */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

