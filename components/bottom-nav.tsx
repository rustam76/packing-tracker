"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Pack", icon: "task_alt", href: "/", pattern: /^\/trip\/[^/]+$/ },
  { label: "Trips", icon: "luggage", href: "/", pattern: /^\/$/ },
  { label: "Shared", icon: "group", href: "/shared", pattern: /^\/shared/ },
  { label: "Settings", icon: "settings", href: "/settings", pattern: /^\/settings/ },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-4 pt-2 pb-safe-offset-2 h-20 bg-surface-bright/90 dark:bg-surface-dim/90 backdrop-blur-lg border-t border-outline-variant/30 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      {navItems.map((item) => {
        const isActive = item.pattern.test(pathname);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center px-3 py-1 transition-all duration-200 active:scale-90",
              isActive 
                ? "text-primary bg-primary/5 rounded-xl" 
                : "text-outline hover:text-primary"
            )}
          >
            <span 
              className="material-symbols-outlined" 
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="font-heading text-[11px] font-medium mt-0.5">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
