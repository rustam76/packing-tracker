"use client";

import { NavBar } from "@/components/nav-bar";
import { BottomNav } from "@/components/bottom-nav";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SharePage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-surface pb-32">
      <NavBar title="Share & Collaborate" icon="group" onAction={() => router.back()} />

      <main className="pt-24 px-margin-mobile max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
        {/* Share Link Card */}
        <section className="bg-primary-container text-on-primary-container rounded-3xl p-lg shadow-xl shadow-primary/10 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div>
              <span className="font-heading text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">Private Link</span>
              <h2 className="font-heading text-h1 font-bold">Invite Partners</h2>
            </div>
            <div className="flex bg-white/10 backdrop-blur-md rounded-2xl p-2 items-center gap-2 border border-white/20">
              <input 
                className="flex-grow bg-transparent border-none text-body-sm font-sans text-white placeholder:text-white/40 focus:ring-0 truncate" 
                readOnly 
                value={`https://packing.app/trip/${id}/join`}
              />
              <button className="bg-white text-primary px-4 py-2 rounded-xl text-xs font-bold shadow-lg">Copy</button>
            </div>
            <p className="font-sans text-[11px] text-white/70">Anyone with this link can view and add items to this trip.</p>
          </div>
          <span className="material-symbols-outlined text-[100px] text-white/10 absolute -right-4 -bottom-4">share</span>
        </section>

        {/* Members List */}
        <div className="space-y-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading text-label-caps text-primary tracking-widest uppercase ml-1">Current Members</h3>
            <span className="bg-surface-container-high px-3 py-1 rounded-full font-heading text-[10px] font-bold text-outline">2 Total</span>
          </div>
          
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden divide-y divide-outline-variant/10">
            <MemberItem 
              name="Rustam G. (You)" 
              email="rustam@example.com" 
              role="Owner" 
              avatar="https://lh3.googleusercontent.com/a/ACg8ocL_pX-R-gD6-Y_Xf5-v9S-X-G-9-v-X-G-9-v-X-G-9-v=s96-c" 
            />
            <MemberItem 
              name="Sarah J." 
              email="sarah.j@traveler.com" 
              role="Editor" 
              avatar="https://lh3.googleusercontent.com/a/ACg8ocM-6N7W9v-v-v-v-v-v-v-v-v-v-v-v-v-v-v-v-v=s96-c" 
            />
          </div>

          <div className="bg-surface-container-low rounded-3xl p-lg border-2 border-dashed border-outline-variant/50 flex flex-col items-center gap-3 text-center opacity-70">
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-outline">
              <span className="material-symbols-outlined text-[24px]">person_add</span>
            </div>
            <p className="font-heading text-body-sm font-semibold text-on-surface">Waiting for more explorers...</p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function MemberItem({ name, email, role, avatar }: { name: string, email: string, role: string, avatar: string }) {
  return (
    <div className="flex items-center justify-between p-md">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <span className="font-heading text-body-base font-semibold text-on-surface">{name}</span>
          <span className="font-sans text-[11px] text-outline font-medium">{email}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={cn(
          "px-2 py-0.5 rounded-md text-[8px] font-bold tracking-widest uppercase",
          role === "Owner" ? "bg-primary-container text-on-primary-container" : "bg-outline-variant/30 text-outline"
        )}>
          {role}
        </span>
        <button className="p-2 text-outline hover:text-error transition-colors">
          <span className="material-symbols-outlined text-[20px]">more_vert</span>
        </button>
      </div>
    </div>
  );
}
