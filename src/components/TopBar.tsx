import { Activity, MessageCircle, Filter } from "lucide-react";

interface TopBarProps {
  onToggleChatbot: () => void;
  onToggleFilters: () => void;
  filtersOpen: boolean;
}

export default function TopBar({ onToggleChatbot, onToggleFilters, filtersOpen }: TopBarProps) {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">Disease Monitor</h1>
          <p className="text-xs text-muted-foreground">AI-Powered Decision Support</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleFilters}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filtersOpen
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-accent"
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>

        <button
          onClick={onToggleChatbot}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <MessageCircle className="w-4 h-4" />
          AI Assistant
        </button>
      </div>
    </header>
  );
}
