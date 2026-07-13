import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { 
  Home, 
  ShieldAlert, 
  FileSearch, 
  Database, 
  Clock, 
  Globe,
  Archive,
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
import { t } from "../i18n";

interface Notification {
  id: number;
  type: "critical" | "warning" | "success" | "info";
  title: string;
  description: string;
  created_at: string;
  read: boolean;
  link?: string;
}

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [user, setUser] = useState<{ name: string; email: string; role: string; account_type?: string; avatar_url?: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    if (saved === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, []);

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

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    api.get("/api/notifications")
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

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

  const handleMarkRead = async (id: number) => {
    try {
      await api.post(`/api/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    try {
      await api.post("/api/notifications/clear-all");
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  const menuItems = [
    { name: t("nav.dashboard"), path: "/dashboard", icon: Home, group: "ops" },
    { name: t("nav.incidents"), path: "/incidents", icon: ShieldAlert, group: "ops" },
    { name: t("nav.fileAnalysis"), path: "/analysis", icon: FileSearch, group: "investigation" },
    { name: t("nav.threatIntel"), path: "/intel", icon: Globe, group: "investigation" },
    { name: t("nav.evidence"), path: "/evidence", icon: Database, group: "investigation" },
    { name: t("nav.timeline"), path: "/timeline", icon: Clock, group: "investigation" },
    { name: t("nav.history"), path: "/history", icon: Archive, group: "investigation" },
    { name: "Ultra Admin", path: "/ultra-admin", icon: ShieldCheck, ultraAdminOnly: true, group: "admin" },
    { name: t("nav.users"), path: "/users", icon: UsersIcon, adminOnly: true, group: "admin" },
    { name: t("nav.audit"), path: "/audit", icon: History, adminOnly: true, group: "admin" },
    { name: t("nav.settings"), path: "/settings", icon: SettingsIcon, group: "admin" },
  ];

  const isAdminUser = user?.role === "Admin" || user?.role === "SuperAdmin" || user?.role === "UltraAdmin";
  const isUltraAdminUser = user?.role === "UltraAdmin";

  // Filter menu items by user role if user profile is available
  const visibleMenuItems = menuItems.filter(item => {
    if (item.ultraAdminOnly) {
      return isUltraAdminUser;
    }
    if (item.adminOnly) {
      return isAdminUser;
    }
    return true;
  });

  const handleLogout = () => {
    localStorage.removeItem("forensiguard_token");
    navigate("/");
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
        className={`fixed lg:static inset-y-0 left-0 transition-all duration-300 z-40 shrink-0 border-r border-brand-border bg-brand-card flex flex-col justify-between ${
          isSidebarOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-brand-border">
            <Link to="/dashboard" className="flex items-center space-x-3 overflow-hidden">
              {isSidebarOpen ? (
                <img 
                  src={theme === "light" ? "/logo-light.png" : "/logo-dark.png"} 
                  alt="ForensiGuard" 
                  style={{ height: "20px", width: "auto" }} 
                />
              ) : (
                <div className="p-2 bg-brand-cyan rounded-lg text-white shadow-sm">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </div>
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
          <nav className="px-3 py-4 flex flex-col gap-1">
            {visibleMenuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              const prevGroup = index > 0 ? visibleMenuItems[index - 1].group : null;
              const showDivider = prevGroup && item.group && prevGroup !== item.group;
              return (
                <React.Fragment key={item.name}>
                  {showDivider && <div className="h-px bg-brand-border my-2 mx-1" />}
                <Link
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
                </React.Fragment>
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
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="h-8 w-8 rounded-full object-cover border border-brand-border" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-brand-cyan/10 text-brand-cyan flex items-center justify-center text-sm font-semibold">
                {(user?.name || "U").charAt(0).toUpperCase()}
              </div>
            )}
            {isSidebarOpen && (
              <div className="flex-1 text-left overflow-hidden">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-brand-text-primary truncate">{user?.name || "RachCode"}</p>
                  {user?.role && (
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/15 uppercase">
                      {user.account_type === "enterprise" ? "ENT" : user.role}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-brand-text-secondary truncate">{user?.email || "rachcode@forensiguard.com"}</p>
              </div>
            )}
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg border border-transparent text-sm text-brand-text-secondary hover:bg-brand-crimson/5 hover:text-brand-crimson transition-all cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            {isSidebarOpen && <span className="font-medium">{t("common.logout")}</span>}
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
              <span className="hidden md:inline">{t("nav.searchPlaceholder")}</span>
              <kbd className="hidden md:inline ml-auto text-[9px] bg-brand-card border border-brand-border px-1 py-0.5 rounded text-brand-text-secondary font-mono">
                Ctrl+K
              </kbd>
            </button>
          </div>

          {/* User actions */}
          <div className="flex items-center space-x-2.5 md:space-x-4">
            {/* System Status Indicators */}
            {/* <div className="hidden md:flex items-center space-x-2 text-xs border-r border-brand-border pr-4 h-5">
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-emerald opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-emerald"></span>
              </span>
            </div> */}

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-theme-tint rounded-md text-brand-text-secondary hover:text-brand-text-primary transition-colors cursor-pointer"
              title={theme === "dark" ? t("nav.switchToLight") : t("nav.switchToDark")}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notification Bell */}
            <button 
              onClick={() => setIsNotificationOpen(true)}
              className="ml-2 p-2 hover:bg-theme-tint rounded-md text-brand-text-secondary hover:text-brand-text-primary relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-brand-crimson text-white text-[10px] font-bold flex items-center justify-center rounded-full">
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
        notifications={notifications.map((n) => ({ ...n, time: new Date(n.created_at).toLocaleString(), id: String(n.id) }))}
        onMarkRead={(id) => handleMarkRead(Number(id))}
        onClearAll={handleClearAll}
      />
    </div>
  );
}

