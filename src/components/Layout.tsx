import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Activity,
  LayoutDashboard,
  Map,
  Stethoscope,
  MessageCircle,
} from "lucide-react";
import ChatbotWidget from "./ChatbotWidget";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/map", label: "Disease Map", icon: Map },
  { path: "/resources", label: "Resource Planning", icon: Stethoscope },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [chatbotOpen, setChatbotOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-base font-bold tracking-tight">Disease Monitor</span>
          <span className="hidden sm:inline-block text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            AI-Powered
          </span>
        </div>

        <nav className="flex items-center gap-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location === path;
            return (
              <Link
                key={path}
                href={path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <button
        onClick={() => setChatbotOpen(!chatbotOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:opacity-90 transition-all z-40"
        title="AI Assistant"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card" />
      </button>

      {chatbotOpen && (
        <div className="fixed bottom-24 right-6 z-50">
          <ChatbotWidget onClose={() => setChatbotOpen(false)} />
        </div>
      )}
    </div>
  );
}
