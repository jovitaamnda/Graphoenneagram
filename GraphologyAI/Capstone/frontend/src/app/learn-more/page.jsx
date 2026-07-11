"use client";

import Link from "next/link";
import Image from "next/image";
import { FileText, Cpu, ClipboardCheck, FileOutput, MapPin, Heart, Lightbulb, Zap } from "lucide-react";

const NAV_SECTIONS = [
  { label: "Ilmu Grafologi", desc: "Analisis psikologis mendalam melalui struktur goresan dan spasi tulisan tangan." },
  { label: "Panduan Pengguna", desc: "Cara menggunakan Grafologi untuk mendapatkan profil diri yang paling akurat." },
  { label: "Sistem Enneagram", desc: "Sembilan tipe kepribadian yang memetakan motivasi dan ketakutan terdalam kita." },
];

const TRIAD_ITEMS = [
  {
    icon: Heart,
    title1: "Pusat Jantung",
    title2: "(Heart)",
    types: "Tipe 2, 3, 4.",
    desc: "Fokus pada citra diri dan perasaan.",
    subtypes: [
      "Tipe 2: Sang Penolong",
      "Tipe 3: Sang Penyelesai",
      "Tipe 4: Sang Individualis",
    ],
    topBorder: "border-[#7A3B2E]",
    iconBg: "bg-[#EFE8E6]",
    iconColor: "text-[#7A3B2E]",
  },
  {
    icon: Lightbulb,
    title1: "Pusat Kepala",
    title2: "(Head)",
    types: "Tipe 5, 6, 7.",
    desc: "Fokus pada logika dan keamanan.",
    subtypes: [
      "Tipe 5: Sang Penyelidik",
      "Tipe 6: Sang Loyalis",
      "Tipe 7: Sang Penggemar",
    ],
    topBorder: "border-[#D9C8B5]",
    iconBg: "bg-[#F2ECE7]",
    iconColor: "text-[#9C8C7D]",
  },
  {
    icon: Zap,
    title1: "Pusat Insting",
    title2: "(Gut)",
    types: "Tipe 8, 9, 1.",
    desc: "Fokus pada kontrol dan otonomi.",
    subtypes: [
      "Tipe 8: Sang Penantang",
      "Tipe 9: Sang Pendamai",
      "Tipe 1: Sang Reformis",
    ],
    topBorder: "border-[#725C47]",
    iconBg: "bg-[#FDF6ED]",
    iconColor: "text-[#725C47]",
  },
];

const STEPS = [
  {
    icon: FileText,
    number: "01",
    label: "LANGKAH 01",
    title: "Unggah Tulisan",
    desc: "Foto dan unggah tulisan tangan Anda di atas kertas putih polos.",
  },
  {
    icon: Cpu,
    number: "02",
    label: "LANGKAH 02",
    title: "Proses AI",
    desc: "Algoritma kami menganalisis lebih dari 10 parameter grafologi secara terinci.",
  },
  {
    icon: ClipboardCheck,
    number: "03",
    label: "LANGKAH 03",
    title: "Validasi Diri",
    desc: "Jawab beberapa pertanyaan untuk menyempurnakan hasil dengan refleksi Anda.",
  },
  {
    icon: FileOutput,
    number: "04",
    label: "LANGKAH 04",
    title: "Hasil Akhir",
    desc: "Terima laporan PDF komprehensif tentang pola dan kepribadian Anda.",
    accent: true,
  },
];

export default function LearnMore() {
  return (
    <div className="min-h-screen bg-[#FBF5F0] font-serif">

      {/* ── HERO ── */}
      <section className="relative w-full" style={{ minHeight: "400px" }}>
        {/* Full-bleed background image */}
        <div className="relative w-full" style={{ height: "400px" }}>
          <Image
            src="/handwriting_hero.png"
            alt="Handwriting background"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          {/* Light overlay to match reference image */}
          <div className="absolute inset-0 bg-[#FBF5F0]/85" />

          {/* Centered text on top of image */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-12">
            <h1 className="text-5xl md:text-6xl font-bold text-[#7A3B2E] leading-tight mb-4 tracking-tight">
              Pelajari Lebih Lanjut
            </h1>
            <p className="text-lg md:text-xl font-medium text-[#5C3D2A] max-w-3xl leading-relaxed mb-6">
              Selamat datang di rumah bagi ilmu pengetahuan tentang penemuan jati diri.<br />
              Pelajari bagaimana setiap goresan tinta mengungkap kedalaman jiwa manusia.
            </p>
            <Link href="/user/analysis">
              <button className="inline-flex items-center gap-2 bg-[#7A3B2E] hover:bg-[#6A2E22] text-white font-medium px-6 py-2.5 rounded-md transition-all duration-300 shadow-sm text-base">
                Mulai Belajar ↓
              </button>
            </Link>
          </div>
        </div>

        {/* Three Category Cards strip — sits just below the image */}
        <div className="bg-[#FBF5F0] px-6 py-12">
          <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
            {NAV_SECTIONS.map((s, i) => (
              <div key={i} className="flex flex-col gap-2 p-6 bg-[#FCF1E6] rounded-xl shadow-md border border-[#F2E0D1] transform transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <h3 className="font-extrabold text-[#95544C] text-xl md:text-2xl">{s.label}</h3>
                <p className="text-sm md:text-base font-medium text-[#7C5A4C] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GORESAN TINTA & PSIKOLOGI ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="rounded-[2rem] overflow-hidden border border-[#EDD9CC] bg-white shadow-sm grid md:grid-cols-2 items-stretch">
          
          {/* Left: Text */}
          <div className="p-10 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#2C1B0E] mb-4 leading-snug">
                Goresan Tinta &<br />Psikologi
              </h2>
              <p className="text-[#5C3D2A] text-base md:text-lg font-medium leading-relaxed mb-8">
                Grafologi bukanlah sekadar ramalan.
                Ini adalah studi tentang bagaimana
                impuls motorik dari otak tercermin
                dalam gerakan tangan. Setiap
                kemiringan, tekanan, dan bentuk
                huruf membawa kode psikologis
                tentang emosi dan temperamen
                Anda.
              </p>
            </div>

            {/* Two Feature Chips */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-[#F9F0E8] border border-[#EDD9CC] p-5 shadow-sm">
                <p className="text-sm font-bold text-[#7A3B2E] uppercase tracking-widest mb-2">Tekanan Kuat</p>
                <p className="text-sm font-medium text-[#5C3D2A] leading-relaxed">Mencerminkan vitalitas dan ketegasan emosional yang tinggi.</p>
              </div>
              <div className="rounded-xl bg-[#F9F0E8] border border-[#EDD9CC] p-5 shadow-sm">
                <p className="text-sm font-bold text-[#7A3B2E] uppercase tracking-widest mb-2">Kemiringan Kanan</p>
                <p className="text-sm font-medium text-[#5C3D2A] leading-relaxed">Menunjukkan ekspresi emosional yang terbuka dan sosial.</p>
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative min-h-[320px] md:min-h-0">
            <Image
              src="/handwriting_hero.png"
              alt="Handwriting close up"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Warm color overlay */}
            <div className="absolute inset-0 bg-[#A0522D]/10" />
          </div>
        </div>
      </section>

      {/* ── PANDUAN ENNEAGRAM ── */}
      <section className="bg-[#FBF5F0] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-[2.75rem] font-bold italic text-[#7A3B2E] mb-4">
              Panduan Enneagram: Sembilan Arketipe
            </h2>
            <p className="text-[#5C3D2A] max-w-3xl mx-auto text-lg leading-relaxed font-medium">
              Sistem Enneagram memetakan sembilan cara berbeda dalam memandang dunia dan
              merespons tantangan hidup melalui tiga pusat kecerdasan.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TRIAD_ITEMS.map((triad, i) => {
              const Icon = triad.icon;
              return (
                <div key={i} className={`bg-white rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-t-[6px] ${triad.topBorder}`}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-lg mb-6 ${triad.iconBg}`}>
                    <Icon size={18} className={triad.iconColor} />
                  </div>
                  <h3 className="font-extrabold text-[#7A3B2E] text-2xl md:text-[1.7rem] leading-snug mb-5">
                    {triad.title1}<br />
                    {triad.title2}
                  </h3>
                  <p className="text-base font-bold text-[#5C3D2A] mb-1">{triad.types}</p>
                  <p className="text-base font-medium text-[#5C3D2A] mb-6 leading-relaxed">{triad.desc}</p>
                  <div className="space-y-3 mt-4">
                    {triad.subtypes.map((sub, j) => (
                      <p key={j} className="text-[15px] md:text-base text-[#2C1B0E] font-bold">
                        {sub}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PANDUAN PENGGUNA LANGKAH DEMI LANGKAH ── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#2C1B0E] mb-4">
              Panduan Pengguna: Langkah Demi Langkah
            </h2>
            <p className="text-[#5C3D2A]">
              Proses sederhana untuk mendapatkan hasil analisis yang paling komprehensif.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className={`rounded-2xl p-7 border flex flex-col gap-4 ${
                    step.accent
                      ? "bg-[#7A3B2E] border-[#7A3B2E] text-white shadow-lg"
                      : "bg-white border-[#EDD9CC] text-[#2C1B0E] shadow-sm hover:shadow-md"
                  } transition-shadow`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    step.accent ? "bg-white/20" : "bg-[#F9F0E8]"
                  }`}>
                    <Icon size={22} className={step.accent ? "text-white" : "text-[#7A3B2E]"} />
                  </div>
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${
                      step.accent ? "text-white/80" : "text-[#A07060]"
                    }`}>{step.label}</p>
                    <h4 className={`font-extrabold text-lg md:text-xl mb-3 ${step.accent ? "text-white" : "text-[#2C1B0E]"}`}>
                      {step.title}
                    </h4>
                    <p className={`text-sm md:text-base font-medium leading-relaxed ${step.accent ? "text-white/90" : "text-[#5C3D2A]"}`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link href="/user/analysis">
              <button className="inline-flex items-center gap-2 bg-[#7A3B2E] hover:bg-[#6A2E22] text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg text-base">
                Mulai Analisis Sekarang →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#EDD9CC] py-8 px-6 text-sm text-[#8A6050]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-[#7A3B2E]">Grafologi</span>
            <span className="ml-2">© 2026</span>
          </div>
          <div className="flex gap-6">
            {["Tentang", "Privasi", "Bantuan", "Ketentuan"].map((link) => (
              <a key={link} href="#" className="hover:text-[#7A3B2E] transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
