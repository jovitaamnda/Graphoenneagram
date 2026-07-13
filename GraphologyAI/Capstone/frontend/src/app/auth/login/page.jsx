"use client";

import { motion } from "framer-motion";
import LoginForm from "@/components/forms/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F4] px-4 relative">
      {/* Simple Top Navigation */}
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-center">
        <Link href="/" className="text-[#854C4A] font-bold text-2xl tracking-tight hover:opacity-80 transition font-serif">
          Grafologi
        </Link>
        <Link href="/" className="text-sm font-medium text-[#524342] hover:text-[#854C4A] transition">
          &larr; Kembali ke Beranda
        </Link>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md mt-16">
        
        <div className="text-center mb-8">
          <h1 className="text-[2.5rem] font-bold text-[#221A13] font-serif mb-2">Masuk</h1>
        </div>

        <div className="bg-white rounded-[1.5rem] shadow-sm border border-[#DBC9C4] p-8 md:p-10">
          <LoginForm />

          <div className="mt-8 text-center text-[#524342] text-sm">
            Belum punya akun?{" "}
            <Link href="/auth/register" className="font-bold text-[#854C4A] hover:underline transition">
              Daftar di sini
            </Link>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
