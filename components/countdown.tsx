"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function Countdown({ date }: { date: string }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
  } | null>(null);

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const target = new Date(date).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        totalMs: diff
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [date]);

  if (!timeLeft) return null;

  const isUrgent = timeLeft.totalMs > 0 && timeLeft.totalMs < 24 * 60 * 60 * 1000;
  const isPast = timeLeft.totalMs <= 0;

  if (isPast) {
    return (
      <div className="flex items-center gap-1.5 text-outline opacity-50">
        <Clock size={12} />
        <span className="text-[10px] font-bold uppercase">Departed</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center gap-2 px-2 py-1 rounded-lg transition-colors",
      isUrgent ? "bg-error/10 text-error animate-pulse" : "bg-primary/5 text-primary"
    )}>
      {isUrgent ? <AlertTriangle size={12} /> : <Clock size={12} />}
      <div className="flex items-baseline gap-1">
        {timeLeft.days > 0 && (
          <><span className="text-[11px] font-bold">{timeLeft.days}</span><span className="text-[8px] font-bold opacity-70">D</span></>
        )}
        <span className="text-[11px] font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="text-[8px] font-bold opacity-70">:</span>
        <span className="text-[11px] font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-[8px] font-bold opacity-70">:</span>
        <span className="text-[11px] font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
      </div>
    </div>
  );
}
