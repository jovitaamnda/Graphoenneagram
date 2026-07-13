"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/api";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email tidak boleh kosong");
      return false;
    }
    if (!email.includes("@")) {
      setError("Format email tidak valid");
      return false;
    }
    if (!password) {
      setError("Password tidak boleh kosong");
      return false;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const loginResponse = await authApi.login(email, password);

      if (loginResponse.token) {
        localStorage.setItem("authToken", loginResponse.token);

        try {
          const userProfile = await authApi.getProfile();

          const userDataToSave = {
            id: userProfile._id || userProfile.id,
            email: userProfile.email,
            name: userProfile.name,
            role: userProfile.role || "user",
            photo: userProfile.photo,
          };

          login({ ...userDataToSave, token: loginResponse.token });
          localStorage.setItem("userData", JSON.stringify(userDataToSave));

          if (userProfile.role === 'admin') {
            router.push("/admin/admin");
          } else {
            router.push("/user/dashboard");
          }
        } catch (profileError) {
          console.error("Failed to fetch profile:", profileError);
          throw new Error("Gagal mengambil data profil user.");
        }
      } else {
        throw new Error("Login berhasil tetapi tidak menerima token.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(`Terjadi kesalahan: ${err.message || 'Silakan coba lagi.'}`);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Email */}
      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#854C4A] w-5 h-5" />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Alamat Email"
          autoComplete="email"
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#DBC9C4] rounded-xl text-[#221A13] placeholder-[#6E5B42]/60 focus:outline-none focus:border-[#854C4A] focus:ring-1 focus:ring-[#854C4A] transition"
        />
      </div>

      {/* Password */}
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#854C4A] w-5 h-5" />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? "text" : "password"}
          placeholder="Kata Sandi"
          autoComplete="current-password"
          className="w-full pl-12 pr-12 py-3.5 bg-white border border-[#DBC9C4] rounded-xl text-[#221A13] placeholder-[#6E5B42]/60 focus:outline-none focus:border-[#854C4A] focus:ring-1 focus:ring-[#854C4A] transition"
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6E5B42] hover:text-[#854C4A] transition">
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {/* Ingat Saya */}
      <div className="flex items-center justify-between text-sm mt-2">
        <label className="flex items-center gap-2 text-[#524342] cursor-pointer">
          <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="accent-[#854C4A] w-4 h-4 rounded border-[#DBC9C4]" />
          Ingat saya
        </label>

        <a href="/forgot-password" className="text-[#854C4A] hover:underline transition font-medium">
          Lupa password?
        </a>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 mt-2 bg-[#854C4A] hover:bg-[#6B3A38] disabled:bg-[#DBC9C4] text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Memproses...
          </>
        ) : (
          "Masuk Sekarang"
        )}
      </button>
    </form>
  );
}
