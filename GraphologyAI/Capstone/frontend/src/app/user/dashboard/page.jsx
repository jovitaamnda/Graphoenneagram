"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LandingHero from "@/components/landing/LandingHero";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingNavbar from "@/components/landing/LandingNavbar";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFF8F4]">
        <div className="w-10 h-10 border-4 border-[#854C4A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F4] text-[#221A13] flex flex-col">
      <LandingNavbar />
      <main className="flex-1 pt-16">
        <LandingHero />
      </main>
      <LandingFooter />
    </div>
  );
}
