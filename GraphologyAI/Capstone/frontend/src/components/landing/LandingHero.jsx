"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoginRequiredModal from "@/components/modals/LoginRequiredModal";

export default function LandingHero() {
  const router = useRouter();
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleMulaiTes = () => {
    if (user) {
      router.push("/user/homeanalisis");
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLihatSemua = () => {
    if (user) {
      router.push("/user/dashboard");
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <section className="bg-[#FFF8F4] text-[#221A13]">
        <div className="mx-auto max-w-[1280px] w-full px-8 pb-20 pt-16">
          <div className="space-y-12">
            {/* Heading */}
            <div className="max-w-4xl">
              <h1 className="text-[3.5rem] font-bold tracking-tight leading-[1.1] text-[#221A13] font-serif">
                Selamat Datang{user?.name ? <span>, <span className="text-[#854C4A] italic">{user.name.split(' ')[0]}</span></span> : ","}
              </h1>
              <p className="mt-4 text-xl leading-relaxed text-[#524342] font-serif">
                Mulai perjalanan mengenal dirimu melalui analisis tulisan tangan dan kepribadian.
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">

              {/* Card Kiri — Grafologi + Enneagram */}
              <div className="rounded-[1rem] bg-[#854C4A] shadow-md overflow-hidden flex flex-col md:flex-row min-h-[380px]">
                {/* Text Side */}
                <div className="p-10 flex flex-col justify-center flex-1">
                  <p className="text-[0.7rem] uppercase tracking-widest text-[#E8D5CF] font-semibold mb-6">
                    Kenali dirimu lebih dalam
                  </p>
                  <h2 className="text-[1.3rem] font-bold leading-relaxed text-white font-serif mb-10">
                    Lengkapi profilmu dengan grafologi &amp; tes Enneagram untuk memahami motivasi dan kecenderungan kepribadianmu.
                  </h2>
                  <button
                    onClick={handleMulaiTes}
                    className="self-start inline-flex items-center justify-center rounded bg-white px-8 py-2.5 text-sm font-semibold text-[#854C4A] shadow-sm hover:bg-[#FFF8F4] transition"
                  >
                    Mulai Tes
                  </button>
                </div>

                {/* Image Side */}
                <div className="relative overflow-hidden bg-[#4F3633] flex-1 min-h-[250px] md:min-h-0">
                  <img
                    src="/graf.png"
                    alt="Ilustrasi grafologi"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/grafologi.png';
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#854C4A] via-transparent to-transparent md:block hidden" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#854C4A] via-transparent to-transparent md:hidden block" />
                </div>
              </div>

              {/* Card Kanan — Aktivitas Terbaru */}
              <div className="rounded-[1rem] border border-[#DBC9C4] bg-white p-8 shadow-sm min-h-[380px] flex flex-col">
                <div className="flex items-center justify-between gap-4 border-b border-[#E8D5CF] pb-4 mb-6">
                  <p className="text-xs uppercase tracking-widest text-[#6E5B42] font-bold">
                    Aktivitas Terbaru
                  </p>
                  <button
                    onClick={handleLihatSemua}
                    className="text-xs font-semibold text-[#854C4A] hover:text-[#C17F7C] transition border-b border-[#854C4A]"
                  >
                    Lihat Semua
                  </button>
                </div>

                <div className="flex-1">
                  <p className="text-[1.1rem] leading-relaxed text-[#524342] font-serif">
                    Mulai unggah tulisan tangan untuk melihat riwayat aktivitasmu di sini.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
