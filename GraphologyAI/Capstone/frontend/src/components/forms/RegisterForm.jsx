"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/api";

export default function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!name.trim()) {
      setError("Nama tidak boleh kosong");
      return false;
    }
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
    if (password !== confirmPassword) {
      setError("Password tidak cocok");
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
      const data = await authApi.register({
        name,
        email,
        password
      });

      if (data.token) {
        localStorage.setItem("authToken", data.token);

        try {
          const userProfile = await authApi.getProfile();
          const userDataToSave = {
            id: userProfile._id || userProfile.id,
            email: userProfile.email,
            name: userProfile.name,
            role: userProfile.role || "user",
            photo: userProfile.photo,
          };

          login({ ...userDataToSave, token: data.token });
          localStorage.setItem("userData", JSON.stringify(userDataToSave));
        } catch (profileError) {
          console.error("Failed to fetch profile after register:", profileError);
          login({
            id: data._id || data.id,
            email: data.email,
            name: data.name,
            role: data.role || "user",
            photo: data.photo,
            token: data.token,
          });
        }
      }

      setLoading(false);
      router.push("/user/dashboard");
    } catch (err) {
      console.error("Register error:", err);
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-live="polite">
      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Nama */}
      <div className="relative">
        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#854C4A] w-5 h-5" />
        <input 
          type="text" 
          placeholder="Nama Lengkap" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#DBC9C4] rounded-xl text-[#221A13] placeholder-[#6E5B42]/60 focus:outline-none focus:border-[#854C4A] focus:ring-1 focus:ring-[#854C4A] transition" 
          required 
        />
      </div>

      {/* Email */}
      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#854C4A] w-5 h-5" />
        <input 
          type="email" 
          placeholder="Alamat Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#DBC9C4] rounded-xl text-[#221A13] placeholder-[#6E5B42]/60 focus:outline-none focus:border-[#854C4A] focus:ring-1 focus:ring-[#854C4A] transition" 
          required 
        />
      </div>

      {/* Password */}
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#854C4A] w-5 h-5" />
        <input 
          type={showPassword ? "text" : "password"} 
          placeholder="Kata Sandi" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full pl-12 pr-12 py-3.5 bg-white border border-[#DBC9C4] rounded-xl text-[#221A13] placeholder-[#6E5B42]/60 focus:outline-none focus:border-[#854C4A] focus:ring-1 focus:ring-[#854C4A] transition" 
          required 
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6E5B42] hover:text-[#854C4A] transition">
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {/* Konfirmasi Password */}
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#854C4A] w-5 h-5" />
        <input 
          type={showConfirmPassword ? "text" : "password"} 
          placeholder="Konfirmasi Kata Sandi" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          className="w-full pl-12 pr-12 py-3.5 bg-white border border-[#DBC9C4] rounded-xl text-[#221A13] placeholder-[#6E5B42]/60 focus:outline-none focus:border-[#854C4A] focus:ring-1 focus:ring-[#854C4A] transition" 
          required 
        />
        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6E5B42] hover:text-[#854C4A] transition">
          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <button 
        type="submit" 
        disabled={loading} 
        className="w-full py-3.5 mt-4 bg-[#854C4A] hover:bg-[#6B3A38] disabled:bg-[#DBC9C4] text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Memproses...
          </>
        ) : (
          "Buat Akun"
        )}
      </button>
    </form>
  );
}
