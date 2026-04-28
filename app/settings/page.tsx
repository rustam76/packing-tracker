"use client";

import { NavBar } from "@/components/nav-bar";
import { BottomNav } from "@/components/bottom-nav";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTrips } from "@/lib/hooks/useTrips";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { trips } = useTrips();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
      toast.success("Logged out successfully");
    } catch (e) {
      toast.error("Failed to logout");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  const userInitial = user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || "U";
  const fullName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Traveler";

  return (
    <div className="min-h-screen bg-surface pb-32">
      <NavBar title="Settings" icon="settings" />

      <main className="pt-24 px-margin-mobile max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
        {/* User Card */}
        <section className="bg-surface-container-lowest rounded-3xl p-lg border border-outline-variant/30 shadow-sm flex flex-col items-center text-center gap-md">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface shadow-lg bg-primary-container flex items-center justify-center text-on-primary-container text-4xl font-heading font-bold">
              {user?.user_metadata?.avatar_url ? (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                userInitial
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg border-2 border-surface">
              <span className="material-symbols-outlined text-[16px]">edit</span>
            </button>
          </div>
          <div>
            <h2 className="font-heading text-h1 font-bold text-on-surface">{fullName}</h2>
            <p className="font-sans text-body-sm text-outline">Explorer • {trips.length} Trips</p>
          </div>
        </section>

        {/* Setting Groups */}
        <div className="space-y-lg">
           <div>
             <h3 className="font-heading text-label-caps text-primary tracking-widest uppercase mb-md ml-1">Account & Security</h3>
             <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden divide-y divide-outline-variant/10">
               <SettingItem 
                 icon="person" 
                 label="Personal Information" 
                 value={user?.email || "No email linked"} 
               />
               <SettingItem icon="notifications" label="Notifications" value="Enabled" />
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
             </div>
           </div>

           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center gap-3 p-lg bg-error-container/10 border border-error-container/20 text-error rounded-3xl hover:bg-error-container/20 transition-all font-heading font-bold"
           >
             <span className="material-symbols-outlined">logout</span>
             Logout from Account
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
