"use client";

import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";

export default function PWAInstaller() {
  const [mounted, setMounted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // 1. Register Service Worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
          (registration) => {
            console.log("SW registered: ", registration);
          },
          (registrationError) => {
            console.log("SW registration failed: ", registrationError);
          }
        );
      });
    }

    // 2. Listen for BeforeInstallPrompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
      if (!isInstalled) {
        setShowBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  if (!mounted) return null;
  if (!showBanner) return null;

  return (
    <div className="fixed bottom-24 left-margin-mobile right-margin-mobile z-[60] md:max-w-md md:mx-auto animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="bg-primary-container text-on-primary-container p-4 rounded-3xl shadow-2xl border border-primary/20 flex items-center gap-4 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 opacity-10">
          <Smartphone size={100} />
        </div>

        <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-lg">
          <Download size={24} />
        </div>
        
        <div className="flex-1 space-y-0.5">
          <h4 className="font-heading text-body-base font-bold">Install Packing App</h4>
          <p className="font-sans text-[11px] opacity-80 leading-tight">Add to home screen for faster access and offline support.</p>
        </div>

        <div className="flex items-center gap-2">
              <button 
                onClick={handleInstall}
                className="rounded-xl h-10 px-4 bg-primary text-on-primary font-bold text-xs flex items-center justify-center"
              >
                Install
              </button>
          <button 
            onClick={() => setShowBanner(false)}
            className="p-1 hover:bg-black/5 rounded-full"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
