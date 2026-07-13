"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoginRequiredModal from "@/components/modals/LoginRequiredModal";

const NAV_LINKS = [
  { label: "Beranda", href: "/", protected: false },
  { label: "Analisis Tulisan Tangan", href: "/user/homeanalisis", protected: true },
  { label: "Pelajari Lebih Lanjut", href: "/learn-more", protected: true },
  { label: "Akun", href: "/auth/login", protected: true },
];

export default function LandingNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (link) => {
    setMobileOpen(false);
    if (link.protected && !user) {
      setShowLoginModal(true);
      return;
    }
    if (link.href === "/akun" && user) {
      router.push("/user/profile");
      return;
    }
    router.push(link.href);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFF8F4] border-b border-[#E8D5CF]">
        <div className="mx-auto max-w-[1280px] px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => router.push("/")}
            className="text-[#854C4A] font-bold text-2xl tracking-tight hover:opacity-80 transition font-serif"
          >
            Grafologi
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <button
                  key={link.label}
                  onClick={() => handleNav(link)}
                  className={`text-sm font-medium transition-colors relative pb-0.5 ${
                    isActive
                      ? "text-[#854C4A] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#854C4A]"
                      : "text-[#524342] hover:text-[#854C4A]"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Right: User Icon */}
          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={() => router.push("/user/profile")}
                className="w-9 h-9 rounded-full bg-[#DBC9C4] flex items-center justify-center text-[#854C4A] hover:bg-[#C17F7C]/30 transition"
                title={user.name}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </button>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-9 h-9 rounded-full bg-[#DBC9C4] flex items-center justify-center text-[#854C4A] hover:bg-[#C17F7C]/30 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              className="md:hidden text-[#524342] hover:text-[#854C4A] transition"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[#FFF8F4] border-t border-[#E8D5CF] px-8 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link)}
                className="text-sm font-medium text-[#524342] hover:text-[#854C4A] text-left transition"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
