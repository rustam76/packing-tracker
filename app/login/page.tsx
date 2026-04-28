"use client";

import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import Image from "next/image";
import logo from "@/public/go.svg";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (e: any) {
      toast.error(e.message || "Failed to login");
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface font-sans antialiased min-h-screen flex flex-col items-center justify-center p-margin-mobile">
      <div className="w-full max-w-md flex flex-col gap-xl">
        <header className="flex flex-col items-center gap-md">
          <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center shadow-lg shadow-primary/10 animate-in zoom-in duration-500">
            <span className="material-symbols-outlined text-white text-[32px]">
              inventory_2
            </span>
          </div>
          <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-700">
            <h1 className="font-heading text-h1 text-on-surface">
              Welcome Back
            </h1>
            <p className="font-sans text-body-sm text-on-surface-variant mt-xs">
              Sign in with your Google account to continue
            </p>
          </div>
        </header>

        <main className="bg-surface-container-lowest border border-outline-variant p-lg rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <div className="flex flex-col items-center w-full">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-surface border border-outline-variant py-4 px-md rounded-xl hover:bg-surface-container-low active:scale-[0.98] transition-all shadow-sm disabled:opacity-50"
            >
              <Image 
                src={logo}
                alt="Google" 
                width={24} 
                height={24} 
                priority
              />
              <span className="font-heading text-body-base font-semibold text-on-surface">
                {loading ? "Connecting..." : "Continue with Google"}
              </span>
            </button>
          </div>
        </main>

        <footer className="text-center flex flex-col gap-lg animate-in fade-in duration-1000 delay-300">
          <p className="font-sans text-body-sm text-on-surface-variant">
            Don't have an account?{" "}
            <a className="text-primary font-semibold hover:underline" href="#">
              Sign up
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
