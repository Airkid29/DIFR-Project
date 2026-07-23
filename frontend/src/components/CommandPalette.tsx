import React, { useEffect, useState, useRef } from "react";
import {
  Search,
  CornerDownLeft,
  Sparkles,
  AlertTriangle,
  FileText,
  Settings,
} from "lucide-react";
import { t } from "../i18n";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
}: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSearch("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle global keydown to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Mock index for search
  const items = [
    {
      id: "act-1",
      title: t("commandPalette.createIncident"),
      category: t("commandPalette.categoryActions"),
      path: "/incidents",
      icon: Sparkles,
    },
    {
      id: "act-2",
      title: t("commandPalette.goToSettings"),
      category: t("commandPalette.categoryActions"),
      path: "/settings",
      icon: Settings,
    },
    {
      id: "act-3",
      title: t("commandPalette.uploadFile"),
      category: t("commandPalette.categoryActions"),
      path: "/analysis",
      icon: FileText,
    },
    {
      id: "inc-1",
      title: "INC-2026-001: SSH Brute Force on Web01",
      category: t("commandPalette.categoryIncidents"),
      path: "/incidents",
      icon: AlertTriangle,
    },
    {
      id: "inc-2",
      title: "INC-2026-002: Ransomware indicator on DC01",
      category: t("commandPalette.categoryIncidents"),
      path: "/incidents",
      icon: AlertTriangle,
    },
    {
      id: "inc-3",
      title: "INC-2026-003: Phishing campaign target sales",
      category: t("commandPalette.categoryIncidents"),
      path: "/incidents",
      icon: AlertTriangle,
    },
    {
      id: "file-1",
      title: "mimikatz.exe (SHA-256: 4f129a...)",
      category: t("commandPalette.categoryFiles"),
      path: "/report/mimikatz",
      icon: FileText,
    },
    {
      id: "file-2",
      title: "cobalt_strike_beacon.dll (SHA-256: 8a42b...)",
      category: t("commandPalette.categoryFiles"),
      path: "/report/cobalt_strike",
      icon: FileText,
    },
    {
      id: "file-3",
      title: "powershell_payload.ps1 (SHA-256: f9b2d...)",
      category: t("commandPalette.categoryFiles"),
      path: "/report/payload",
      icon: FileText,
    },
  ];

  // Filter items
  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()),
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + filtered.length) % filtered.length,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        onNavigate(filtered[selectedIndex].path);
        onClose();
      }
    }
  };

  React.useEffect(() => {
    if (selectedIndex >= filtered.length) {
      setSelectedIndex(Math.max(0, filtered.length - 1));
    }
  }, [filtered.length, selectedIndex]);

  if (!isOpen) return null;

  // Group items by category
  const categories = Array.from(new Set(filtered.map((item) => item.category)));

  let absoluteIndex = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-brand-border bg-brand-card shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input */}
        <div className="flex items-center border-b border-brand-border px-4 py-4">
          <Search className="h-4.5 w-4.5 text-brand-text-secondary mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="form-input bg-transparent border-0 p-0 text-sm text-brand-text-primary placeholder-brand-text-secondary outline-none font-sans"
            placeholder={t("commandPalette.searchPlaceholder")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <kbd className="ml-3 text-[10px] bg-brand-card border border-brand-border px-2 py-1 rounded font-mono text-brand-text-secondary">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[350px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-brand-text-secondary">
              {t("commandPalette.noResults", { query: search })}
            </div>
          ) : (
            categories.map((category) => (
              <div key={category} className="mb-2">
                <div className="px-3 py-1.5 text-[10px] font-bold text-brand-cyan tracking-wider uppercase">
                  {category}
                </div>
                <div className="space-y-0.5">
                  {filtered
                    .filter((item) => item.category === category)
                    .map((item) => {
                      const currentIndex = absoluteIndex++;
                      const isSelected = currentIndex === selectedIndex;
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-colors text-sm ${
                            isSelected
                              ? "bg-brand-cyan/10 text-brand-cyan"
                              : "hover:bg-theme-tint text-brand-text-primary"
                          }`}
                          onClick={() => {
                            onNavigate(item.path);
                            onClose();
                          }}
                          onMouseEnter={() => setSelectedIndex(currentIndex)}
                        >
                          <div className="flex items-center space-x-3">
                            <Icon
                              className={`h-4 w-4 ${isSelected ? "text-brand-cyan" : "text-brand-text-secondary"}`}
                            />
                            <span className="font-medium">{item.title}</span>
                          </div>
                          {isSelected && (
                            <div className="flex items-center space-x-1 text-[9px] text-brand-cyan bg-brand-cyan/10 px-1.5 py-0.5 rounded border border-brand-cyan/10">
                              <span>{t("commandPalette.enter")}</span>
                              <CornerDownLeft className="h-2.5 w-2.5" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
