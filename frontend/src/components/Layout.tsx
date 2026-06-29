import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { 
  Home, 
  ShieldAlert, 
  FileSearch, 
  Database, 
  Clock, 
  Users as UsersIcon, 
  Settings as SettingsIcon, 
  History, 
  User, 
  Bell, 
  Search, 
  ChevronRight,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Sun,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../utils/api";
import CommandPalette from "./CommandPalette";
import NotificationDrawer from "./NotificationDrawer";

interface Notification {
  id: string;
  type: "critical" | "warning" | "success" | "info";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    // Load active profile
    api.get("/api/auth/me")
      .then((data) => setUser(data))
      .catch((err) => {
        console.error("Failed to load user profile:", err);
      });
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  };

  // Mock notifications state
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "n-1",
      type: "critical",
      title: "YARA Rules Match",
      description: "suspicious_payload.exe matched CobaltStrike rule",
      time: "2m ago",
      read: false
    },
    {
      id: "n-2",
      type: "success",
      title: "Audit Log Generated",
      description: "Incident INC-2026-001 audit log generated successfully",
      time: "1h ago",
      read: true
    },
    {
      id: "n-3",
      type: "info",
      title: "New Team Member",
      description: "Sarah Jenkins was assigned to Incident Response L3",
      time: "4h ago",
      read: true
    }
  ]);

  // Handle Ctrl+K Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle auto-collapse sidebar on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Incidents", path: "/incidents", icon: ShieldAlert },
    { name: "File Analysis", path: "/analysis", icon: FileSearch },
    { name: "Evidence & Custody", path: "/evidence", icon: Database },
    { name: "Investigation Timeline", path: "/timeline", icon: Clock },
    { name: "User Management", path: "/users", icon: UsersIcon, adminOnly: true },
    { name: "Audit Log", path: "/audit", icon: History, adminOnly: true },
    { name: "Settings", path: "/settings", icon: SettingsIcon },
  ];

  // Filter menu items by user role if user profile is available
  const visibleMenuItems = menuItems.filter(item => {
    if (item.adminOnly) {
      return user?.role === "Admin";
    }
    return true;
  });

  const handleLogout = () => {
    localStorage.removeItem("forensiguard_token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-brand-abyssal text-brand-text-primary overflow-hidden font-inter relative">
      {/* Subtle background nodes/dots */}
      <div className="app-bg" />

      {/* Sidebar Backdrop for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth <= 1024 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 ${
          isSidebarOpen ? "w-64" : "w-20"
        } shrink-0 border-r border-brand-border bg-brand-card flex flex-col justify-between transition-all duration-300 z-40`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-brand-border">
            <Link to="/dashboard" className="flex items-center space-x-3 overflow-hidden">
              <div className="p-2 bg-brand-cyan rounded-lg text-white shadow-sm">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              {isSidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-outfit font-bold text-base tracking-wide text-brand-text-primary"
                >
                  Forensi<span className="text-brand-cyan">Guard</span>
                </motion.span>
              )}
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 hover:bg-theme-tint rounded-md text-brand-text-secondary hover:text-brand-text-primary transition-colors cursor-pointer"
            >
              {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="px-4 py-3 space-y-2">
            {visibleMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth <= 1024) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all text-sm font-medium ${
                    isActive
                      ? "bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/10 shadow-xs"
                      : "border border-transparent text-brand-text-secondary hover:bg-theme-tint hover:text-brand-text-primary"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-brand-cyan" : "text-brand-text-secondary"}`} />
                  {isSidebarOpen && <span>{item.name}</span>}
                  {isActive && isSidebarOpen && <ChevronRight className="h-3.5 w-3.5 ml-auto text-brand-cyan" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar / Profile details */}
          <div className="px-4 py-3 border-t border-brand-border space-y-1">
          <Link
            to="/profile"
            onClick={() => {
              if (window.innerWidth <= 1024) {
                setIsSidebarOpen(false);
              }
            }}
            className={`flex items-center space-x-3 px-3 py-3 rounded-lg border transition-all ${
              location.pathname === "/profile"
                ? "bg-brand-cyan/10 border-brand-cyan/10 text-brand-cyan"
                : "border-transparent text-brand-text-secondary hover:bg-theme-tint hover:text-brand-text-primary"
            }`}
          >
            <User className="h-4.5 w-4.5 shrink-0" />
            {isSidebarOpen && (
              <div className="flex-1 text-left overflow-hidden">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-brand-text-primary truncate">{user?.name || "R. Jenkins"}</p>
                  {user?.role && (
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/15 uppercase">
                      {user.role}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-brand-text-secondary truncate">{user?.email || "r.jenkins@forensiguard.com"}</p>
              </div>
            )}
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg border border-transparent text-sm text-brand-text-secondary hover:bg-brand-crimson/5 hover:text-brand-crimson transition-all cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            {isSidebarOpen && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Topbar */}
        <header className="h-16 border-b border-brand-border bg-brand-card flex items-center justify-between px-6 md:px-8">
          <div className="flex items-center space-x-3">
            {/* Sidebar toggle for mobile */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-1.5 hover:bg-theme-tint rounded-md text-brand-text-secondary hover:text-brand-text-primary cursor-pointer"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>

            {/* Global Search Bar Trigger */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center space-x-2.5 w-10 md:w-56 h-9 md:h-auto justify-center md:justify-start px-0 md:px-2.5 py-1.5 bg-brand-abyssal border border-brand-border hover:border-brand-cyan/35 rounded-lg text-brand-text-secondary text-xs text-left transition-colors cursor-pointer"
            >
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden md:inline">Search console...</span>
              <kbd className="hidden md:inline ml-auto text-[9px] bg-brand-card border border-brand-border px-1 py-0.5 rounded text-brand-text-secondary font-mono">
                Ctrl+K
              </kbd>
            </button>
          </div>

          {/* User actions */}
          <div className="flex items-center space-x-2.5 md:space-x-4">
            {/* System Status Indicators */}
            <div className="hidden md:flex items-center space-x-2 text-xs border-r border-brand-border pr-4 h-5">
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-emerald opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-emerald"></span>
              </span>
              <span className="text-brand-text-secondary text-[11px] font-medium">YARA Daemon: Active</span>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-1.5 hover:bg-theme-tint rounded-md text-brand-text-secondary hover:text-brand-text-primary transition-colors cursor-pointer"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Notification Bell */}
            <button 
              onClick={() => setIsNotificationOpen(true)}
              className="p-1.5 hover:bg-theme-tint rounded-md text-brand-text-secondary hover:text-brand-text-primary relative cursor-pointer"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 h-3.5 w-3.5 bg-brand-crimson text-white text-[8px] font-bold flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Dynamic Route View */}
        <main className="flex-1 overflow-y-auto bg-transparent p-6 md:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Interactive Elements */}
      <CommandPalette 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onNavigate={(path) => navigate(path)}
      />

      <NotificationDrawer 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onClearAll={handleClearAll}
      />
    </div>
  );
}

