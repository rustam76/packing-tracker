"use client";

import { NavBar } from "@/components/nav-bar";
import { BottomNav } from "@/components/bottom-nav";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SharedPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-surface pb-32">
      <NavBar title="Shared Collaborations" icon="group" />

      <main className="pt-24 px-margin-mobile max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
        {/* Collaborative Header */}
        <section className="bg-primary-container text-on-primary-container rounded-3xl p-lg shadow-xl shadow-primary/10 relative overflow-hidden">
          <div className="relative z-10 space-y-2">
             <p className="font-heading text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">Collective Traveling</p>
             <h2 className="font-heading text-h1 font-bold">Planned Together</h2>
             <p className="font-sans text-[12px] text-white/80 max-w-[80%] pt-2">Manage all the trips you are collaborating on with friends and family.</p>
          </div>
          <span className="material-symbols-outlined text-[100px] text-white/10 absolute -right-4 -bottom-4">hub</span>
        </section>

        {/* Shared Trips List */}
        <div className="space-y-lg">
          <h3 className="font-heading text-label-caps text-primary tracking-widest uppercase ml-1">Active Collaborations</h3>
          
          <div className="space-y-4">
             {/* Example Shared Trip Card */}
             <div className="bg-surface-container-lowest rounded-3xl p-md border border-outline-variant/30 shadow-sm flex items-center gap-4 group cursor-pointer hover:border-primary/30 transition-all">
                <div className="w-16 h-16 rounded-2xl bg-surface-container-high overflow-hidden">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxh3Xiv-vb1Ik0s8IJRGt-u0jo4_o3yXTgIhX6qKkyWOZjvkcG0964yt2sESVlC0hWIJB5rS6XjCs8T4_I0A4sMszfLbnHmXJyCkkibW2cQyCzYvbw4vpt_3QDWLWLkgeQ_pvV0pNY6Zj7q-pYUzLaAbFthpLfXe1Yl2woJuRIIW1coVTzSGs9ZqYNRAD2RRjPoQhXZ3IAXfM4IQryTwuM8yo7QPVUVwe1CVyv-j2jAZPBHVnYGHnNUR_4CIBBlS8i9JGuaoWlc8w" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-grow">
                   <h4 className="font-heading text-body-base font-bold text-on-surface">Bali Summer '24</h4>
                   <p className="font-sans text-[11px] text-outline">Shared by Sarah J.</p>
                </div>
                <div className="flex -space-x-2 mr-2">
                   <div className="w-7 h-7 rounded-full border-2 border-surface bg-surface-container-highest overflow-hidden">
                      <img src="https://lh3.googleusercontent.com/a/ACg8ocL_pX-R-gD6-Y_Xf5-v9S-X-G-9-v-X-G-9-v-X-G-9-v=s96-c" className="w-full h-full object-cover" />
                   </div>
                   <div className="w-7 h-7 rounded-full border-2 border-surface bg-primary text-on-primary flex items-center justify-center font-bold text-[8px]">
                      +2
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Empty State / Invitation Card */}
        <div className="bg-surface-container-low rounded-3xl p-lg border-2 border-dashed border-outline-variant/50 flex flex-col items-center gap-3 text-center opacity-70">
          <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-outline">
            <span className="material-symbols-outlined text-[24px]">add_link</span>
          </div>
          <div>
            <p className="font-heading text-body-sm font-semibold text-on-surface">Enter Invitation Code</p>
            <p className="font-sans text-[11px] text-outline">Join a trip someone shared with you</p>
          </div>
          <button className="mt-2 bg-surface-container-highest px-6 py-2 rounded-xl text-xs font-bold text-on-surface hover:bg-primary hover:text-on-primary transition-all">
            Join Trip
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
