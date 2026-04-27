"use client";

import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
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
            <h1 className="font-heading text-h1 text-on-surface">Welcome Back</h1>
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
              <img
                alt="Google"
                className="w-6 h-6"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1b9OUfowsXvuo3Lp0JSbfI5JIO4eYvpKzUGja6eNWDpafCur5Zq5RTvB0PYjpxwIkPYwYiZ76_Ge7AaUb3K15KygnbDqlSp_uiU20TUJU-5Zh4WFaCOrx14Qv-kfQl6M783b84wW2V5q6QmchX9THdgyMfEx1mPSkX0_tQGAfD_vd1YTwfr6cLuE9Z665z9zmmZCjmTUqdNGJTbc2dCQGN_oNw1pcxDKIDpBwwCTNg3sQAKUcyrVHKVb1WZKcRUuNRXourRPed3E"
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
          <div className="relative w-full h-40 overflow-hidden rounded-2xl grayscale opacity-30 pointer-events-none">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuANxCED2J2ikLjXSt4tw-6B534ShO5-nf7WlvO--7Xku4GldUopQToGF2-S3P2_GC6qw9F88mFPuhFYp09D285hmhAWH9-Z5Bn04SBKvSD8i6Pc6aKMpX3fHfauqfQTYISPXEKIbLEuogqKu4PuIS8U3PHCax4QUcOHs_4yvAr6SRlBXpoSpNcSYunEC-uDRFuml87z5g_k6mAI1tjcePYj6FyASD9UEKhkyLWjkd8RofWDoHg4JzwdbzAUmtUwHUS-AlXF05xEEBs"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
          </div>
        </footer>
      </div>
    </div>
  );
}
