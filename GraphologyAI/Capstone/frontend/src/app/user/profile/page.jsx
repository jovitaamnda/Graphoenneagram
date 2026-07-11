"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/api";
import { Camera } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout, updateUser } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: ""
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const fileInputRef = useRef(null);

  // Protected Route Check
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  // Fetch Data on Load
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const data = await authApi.getProfile();
        setFormData({
          name: data.name || "",
          email: data.email || "",
          age: data.profile?.age || "",
          gender: data.profile?.gender || ""
        });

        if (data.profilePicture) {
          const url = data.profilePicture.startsWith('http')
            ? data.profilePicture
            : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${data.profilePicture}`;
          setAvatarPreview(url);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSubmit = new FormData();
      dataToSubmit.append('name', formData.name);
      dataToSubmit.append('email', formData.email);
      dataToSubmit.append('age', formData.age);
      dataToSubmit.append('gender', formData.gender);
      if (file) {
        dataToSubmit.append('profilePicture', file);
      }

      // Update Profile
      const updatedUser = await authApi.updateProfile(dataToSubmit);

      if (updateUser) updateUser(updatedUser);

      alert("Profil berhasil diperbarui!");

    } catch (error) {
      console.error("Update failed:", error);
      alert(error.response?.data?.message || "Gagal menyimpan profil.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  if (loading || initialLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8F4] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#E7D7D1] border-t-[#854C4A] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FFF8F4] font-sans flex items-center justify-center pb-20">
      <div className="w-full max-w-4xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row items-stretch gap-8">
          
          {/* Left panel */}
          <div className="md:w-1/3 bg-white border border-[#E7D7D1] shadow-sm rounded-[2rem] p-10 flex flex-col items-center justify-center text-center">
            {/* Avatar */}
            <div
              className="relative w-40 h-40 rounded-[2rem] bg-[#F9F0E8] mb-6 overflow-hidden shadow-sm cursor-pointer group border-4 border-[#F5EBE3]"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image
                src={avatarPreview || "/profile.jpeg"}
                alt="avatar"
                fill
                className="object-cover"
                onError={(e) => { e.target.src = "/profile.jpeg" }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>

            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

            <h2 className="text-3xl font-bold text-[#221A13] mb-2">{formData.name}</h2>
            <p className="text-sm font-medium text-[#854C4A] bg-[#F9F0E8] px-4 py-1.5 rounded-full">{user.email}</p>
          </div>

          {/* Right white card */}
          <div className="md:w-2/3 bg-white rounded-[2rem] shadow-sm p-10 border border-[#E7D7D1]">
            <h1 className="text-3xl font-bold mb-2 text-[#221A13]">Pengaturan Profil</h1>
            <p className="text-base text-[#6E5B42] mb-10">Kelola informasi pribadi dan preferensi akun Anda.</p>

            <form onSubmit={handleSave} className="space-y-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <div>
                  <label className="block text-sm font-bold text-[#854C4A] uppercase tracking-wide mb-2">Nama Lengkap</label>
                  <input name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-[#FFFBF9] border border-[#E7D7D1] rounded-xl px-5 py-3.5 text-[#221A13] font-medium focus:outline-none focus:ring-2 focus:ring-[#854C4A]/30 focus:border-[#854C4A] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#854C4A] uppercase tracking-wide mb-2">Email</label>
                  <input name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-[#FFFBF9] border border-[#E7D7D1] rounded-xl px-5 py-3.5 text-[#221A13] font-medium focus:outline-none focus:ring-2 focus:ring-[#854C4A]/30 focus:border-[#854C4A] transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <div>
                  <label className="block text-sm font-bold text-[#854C4A] uppercase tracking-wide mb-2">Umur</label>
                  <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full bg-[#FFFBF9] border border-[#E7D7D1] rounded-xl px-5 py-3.5 text-[#221A13] font-medium focus:outline-none focus:ring-2 focus:ring-[#854C4A]/30 focus:border-[#854C4A] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#854C4A] uppercase tracking-wide mb-2">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full bg-[#FFFBF9] border border-[#E7D7D1] rounded-xl px-5 py-3.5 text-[#221A13] font-medium focus:outline-none focus:ring-2 focus:ring-[#854C4A]/30 focus:border-[#854C4A] transition-colors cursor-pointer appearance-none">
                    <option value="">Pilih...</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="mt-10 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6">
                <button type="button" onClick={handleLogout} className="w-full sm:w-auto text-[#C15454] bg-[#FFF2F2] hover:bg-[#FFE5E5] px-6 py-3.5 rounded-xl font-bold transition-colors">
                  Keluar Akun
                </button>
                <button type="submit" disabled={saving} className="w-full sm:w-auto bg-[#854C4A] text-white px-8 py-3.5 rounded-xl shadow-md hover:bg-[#6A3937] hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed font-bold text-base">
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
