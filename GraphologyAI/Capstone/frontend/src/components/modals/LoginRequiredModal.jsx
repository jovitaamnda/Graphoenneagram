"use client";

import { useRouter } from "next/navigation";

export default function LoginRequiredModal({ isOpen, onClose }) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleMasuk = () => {
    onClose();
    router.push("/auth/login");
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(34,26,19,0.35)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center border border-[#E8D5CF]"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "modalIn 0.2s ease" }}
      >
        {/* Lock Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#FFF0EC] flex items-center justify-center mb-5 border border-[#DBC9C4]">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#854C4A" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path strokeLinecap="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#221A13] mb-3">
          Login Diperlukan
        </h2>

        {/* Description */}
        <p className="text-[#524342] text-sm leading-relaxed mb-8">
          Silakan masuk atau daftar untuk mengakses fitur ini dan menyimpan hasil analisis Anda secara permanen di profil Anda.
        </p>

        {/* Masuk Button */}
        <button
          id="btn-masuk-sekarang"
          onClick={handleMasuk}
          className="w-full rounded-full bg-[#854C4A] text-white font-semibold text-sm py-3.5 hover:bg-[#6B3A38] active:scale-95 transition shadow-md shadow-[#854C4A]/20 mb-3"
        >
          Masuk Sekarang
        </button>

        {/* Nanti Saja */}
        <button
          id="btn-nanti-saja"
          onClick={onClose}
          className="text-sm text-[#6E5B42] hover:text-[#854C4A] transition font-medium"
        >
          Nanti Saja
        </button>
      </div>

      <style>{`
        @keyframes modalIn {
          from { transform: scale(0.93); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
