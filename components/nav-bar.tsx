"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

interface NavBarProps {
  title: string;
  icon?: string;
  onAction?: () => void;
  actionIcon?: string;
}

export function NavBar({ title, icon = "travel", onAction, actionIcon = "expand_more" }: NavBarProps) {
  return (
    <header className="fixed top-0 w-full z-50 flex items-center justify-between px-4 h-14 bg-surface-bright/80 dark:bg-surface-dim/80 backdrop-blur-md shadow-sm border-b border-outline-variant/30">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-[24px]" data-icon={icon}>
          {icon}
        </span>
        <h1 className="font-heading text-h2 font-semibold text-on-surface">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={onAction}
          className="p-2 rounded-full hover:bg-surface-container transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-outline" data-icon={actionIcon}>
            {actionIcon}
          </span>
        </button>
      </div>
    </header>
  );
}
