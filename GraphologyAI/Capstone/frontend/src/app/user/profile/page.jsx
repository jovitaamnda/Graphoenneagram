"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/api";

export default function ProfilePage() {
  const router = useRouter();
  const { user, login, logout, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/auth/login");
      } else {
        fetchProfile();
      }
    }
  }, [user, authLoading, router]);

  const fetchProfile = async () => {
    try {
      const data = await authApi.getProfile();
      setName(data.name || "");
      setEmail(data.email || "");
      setPhone(data.phone || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authApi.updateProfile({ name, phone });
      alert("Profil berhasil disimpan.");
      // update user in context
      login({ ...user, name });
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan profil.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center bg-[#FFF8F4]">Loading...</div>;

  const avatarSrc = user?.photo || "/profile.jpeg";

  return (
    <div className="min-h-screen bg-[#FFF8F4] flex flex-col items-center pt-24 px-4 pb-12">
      <div className="w-full max-w-4xl bg-white rounded-[1.5rem] shadow-sm border border-[#DBC9C4] p-8 md:p-12">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          
          {/* Left panel (Avatar) */}
          <div className="flex flex-col items-center w-full md:w-1/3">
            <div className="w-40 h-40 rounded-full border-[6px] border-[#FFF8F4] shadow-md overflow-hidden mb-5 bg-[#DBC9C4]">
              <Image src={avatarSrc} alt="avatar" width={160} height={160} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl font-bold text-[#221A13] font-serif mb-2 text-center">{name || "User"}</h2>
            <p className="text-xs text-[#854C4A] bg-[#FFF8F4] px-4 py-1.5 rounded-full font-semibold uppercase tracking-widest border border-[#DBC9C4]">{user?.role === 'admin' ? "Admin" : "User"}</p>
          </div>

          {/* Right form */}
          <div className="w-full md:w-2/3">
            <h1 className="text-[2.2rem] font-bold font-serif text-[#221A13] mb-2">Pengaturan Profil</h1>
            <p className="text-[#524342] text-sm mb-10">Kelola informasi pribadi Anda dan detail akun</p>

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#524342] mb-2">Nama Lengkap</label>
                <input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full border border-[#DBC9C4] rounded-xl px-5 py-3.5 bg-white focus:outline-none focus:border-[#854C4A] focus:ring-1 focus:ring-[#854C4A] transition text-[#221A13]" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#524342] mb-2">Alamat Email</label>
                <input 
                  value={email} 
                  readOnly 
                  className="w-full border border-[#DBC9C4] rounded-xl px-5 py-3.5 bg-[#FFF8F4] text-[#6E5B42] outline-none cursor-not-allowed" 
                />
                <p className="text-xs text-[#854C4A] mt-2 italic">* Email tidak dapat diubah untuk menjaga keamanan data.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#524342] mb-2">Nomor Telepon</label>
                <input 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="w-full border border-[#DBC9C4] rounded-xl px-5 py-3.5 bg-white focus:outline-none focus:border-[#854C4A] focus:ring-1 focus:ring-[#854C4A] transition text-[#221A13]" 
                  placeholder="Contoh: 08123456789" 
                />
              </div>

              <div className="pt-8 border-t border-[#DBC9C4] flex flex-wrap gap-4 mt-8">
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="bg-[#854C4A] text-white px-8 py-3.5 rounded-xl shadow-sm hover:bg-[#6B3A38] disabled:opacity-50 font-semibold transition"
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
                <button 
                  type="button" 
                  onClick={handleLogout} 
                  className="text-[#854C4A] bg-white border border-[#854C4A] px-8 py-3.5 rounded-xl hover:bg-[#FFF8F4] font-semibold transition"
                >
                  Keluar Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
