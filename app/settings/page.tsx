"use client";

import { NavBar } from "@/components/nav-bar";
import { BottomNav } from "@/components/bottom-nav";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle"; // Assuming this exists or I'll use simple buttons

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-surface pb-32">
      <NavBar title="Settings" icon="settings" />

      <main className="pt-24 px-margin-mobile max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
        {/* User Card */}
        <section className="bg-surface-container-lowest rounded-3xl p-lg border border-outline-variant/30 shadow-sm flex flex-col items-center text-center gap-md">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface shadow-lg">
              <img 
                src="https://lh3.googleusercontent.com/a/ACg8ocL_pX-R-gD6-Y_Xf5-v9S-X-G-9-v-X-G-9-v-X-G-9-v=s96-c" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg border-2 border-surface">
              <span className="material-symbols-outlined text-[16px]">edit</span>
            </button>
          </div>
          <div>
            <h2 className="font-heading text-h1 font-bold text-on-surface">Rustam G.</h2>
            <p className="font-sans text-body-sm text-outline">Pro Explorer • 12 Trips</p>
          </div>
        </section>

        {/* Setting Groups */}
        <div className="space-y-lg">
           <div>
             <h3 className="font-heading text-label-caps text-primary tracking-widest uppercase mb-md ml-1">Account & Security</h3>
             <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden divide-y divide-outline-variant/10">
               <SettingItem icon="person" label="Personal Information" value="rustam@example.com" />
               <SettingItem icon="notifications" label="Notifications" value="Enabled" />
               <SettingItem icon="security" label="Two-Step Verification" value="Active" badge="SECURE" />
             </div>
           </div>

           <div>
             <h3 className="font-heading text-label-caps text-primary tracking-widest uppercase mb-md ml-1">Preferences</h3>
             <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden divide-y divide-outline-variant/10">
               <div className="flex items-center justify-between p-md hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface">
                      <span className="material-symbols-outlined">dark_mode</span>
                    </div>
                    <span className="font-heading text-body-base font-semibold text-on-surface">Dark Mode</span>
                  </div>
                  <ThemeToggle />
               </div>
               <SettingItem icon="language" label="Language" value="English (US)" />
               <SettingItem icon="distance" label="Measurement Units" value="Metric (kg/cm)" />
             </div>
           </div>

           <button className="w-full flex items-center justify-center gap-3 p-lg bg-error-container/10 border border-error-container/20 text-error rounded-3xl hover:bg-error-container/20 transition-all font-heading font-bold">
             <span className="material-symbols-outlined">logout</span>
             Logout from Google
           </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function SettingItem({ icon, label, value, badge }: { icon: string, label: string, value?: string, badge?: string }) {
  return (
    <div className="flex items-center justify-between p-md hover:bg-surface-container-low cursor-pointer transition-colors group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface group-hover:bg-primary-container group-hover:text-on-primary-container transition-all">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-heading text-body-base font-semibold text-on-surface">{label}</span>
          {value && <span className="font-sans text-[11px] text-outline font-medium">{value}</span>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="px-2 py-0.5 rounded-md bg-primary-container text-on-primary-container text-[8px] font-bold tracking-widest">{badge}</span>
        )}
        <span className="material-symbols-outlined text-outline text-[20px]">chevron_right</span>
      </div>
    </div>
  );
}
