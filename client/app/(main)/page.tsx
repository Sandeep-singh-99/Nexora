"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Testimonials } from "@/components/landing/testimonials";
import { FinalCTA } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { AuthModal } from "@/components/auth/auth-modal";

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");

  const handleOpenAuth = (tab: "signin" | "signup") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#05070B] text-[#F5F7FA] selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar onOpenAuth={handleOpenAuth} />
      <main className="flex-1">
        <Hero onOpenAuth={handleOpenAuth} />
        <Features />
        <Testimonials />
        <FinalCTA onOpenAuth={handleOpenAuth} />
      </main>
      <Footer />
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialTab={authTab}
      />
    </div>
  );
}
