"use client";

import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { CekStatusModal } from "@/components/CekStatusModal";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [cekStatusOpen, setCekStatusOpen] = useState(false);

  return (
    <>
    <CekStatusModal isOpen={cekStatusOpen} onClose={() => setCekStatusOpen(false)} />
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-2">
              <div className="text-3xl font-black text-brand-600">SJ</div>
              <div>
                <div className="font-black text-brand-600 text-base leading-tight">sijah Asy-Syifa</div>
                <div className="text-xs text-ink-500">Sistem Informasi Penjahit Syifa</div>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-sm text-ink-700 hover:text-brand-600 transition font-medium">
                Home
              </a>
              <a href="#services" className="text-sm text-ink-700 hover:text-brand-600 transition font-medium">
                Layanan Kami
              </a>
              <a href="#process" className="text-sm text-ink-700 hover:text-brand-600 transition font-medium">
                Cara Pemesanan
              </a>
              <a href="#about" className="text-sm text-ink-700 hover:text-brand-600 transition font-medium">
                About
              </a>
              <a href="#contact" className="text-sm text-ink-700 hover:text-brand-600 transition font-medium">
                Kontak Kami
              </a>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setCekStatusOpen(true)}
                className="px-4 py-2 text-sm text-ink-700 hover:text-brand-600 transition font-medium"
              >
                Cek Status
              </button>
              <Link
                href="/buat-pesanan"
                className="px-5 py-2 bg-brand-600 text-white text-sm rounded hover:bg-brand-700 transition font-semibold"
              >
                Buat Pesanan
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-ink-100 mt-4 pt-4 pb-4">
              <div className="space-y-3">
                <a href="#home" className="block text-sm text-ink-700 hover:text-brand-600 font-medium">
                  Home
                </a>
                <a href="#services" className="block text-sm text-ink-700 hover:text-brand-600 font-medium">
                  Layanan Kami
                </a>
                <a href="#process" className="block text-sm text-ink-700 hover:text-brand-600 font-medium">
                  Cara Pemesanan
                </a>
                <a href="#about" className="block text-sm text-ink-700 hover:text-brand-600 font-medium">
                  About
                </a>
                <a href="#contact" className="block text-sm text-ink-700 hover:text-brand-600 font-medium">
                  Kontak Kami
                </a>
                <div className="pt-3 space-y-2 border-t border-ink-100">
                  <button
                    onClick={() => {
                      setCekStatusOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-center py-2 text-sm text-ink-700 font-medium"
                  >
                    Cek Status
                  </button>
                  <Link
                    href="/buat-pesanan"
                    className="block w-full text-center py-2 bg-brand-600 text-white text-sm rounded font-semibold"
                  >
                    Buat Pesanan
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-b from-brand-50 to-white py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold text-ink-900 leading-tight mb-3">
                Jahit Seragam & Pakaian Custom
              </h1>
              <h2 className="text-3xl sm:text-4xl text-brand-600 font-bold mb-6">
                Sesuai Kebutuhanmu
              </h2>
              <p className="text-base sm:text-lg text-ink-700 mb-8 leading-relaxed">
                Kami menyediakan layanan jahit seragam dan pakaian custom dengan kualitas terjamin. Semua bisa disesuaikan dengan mudah, rapi, dan sesuai ukuran.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/buat-pesanan"
                  className="px-6 py-3 bg-brand-600 text-white rounded hover:bg-brand-700 transition font-semibold text-center text-sm"
                >
                  Buat Pesanan
                </Link>
                <a href="https://wa.me/62855333343" target="_blank" rel="noopener noreferrer" className="px-6 py-3 border-2 border-brand-600 text-brand-600 rounded hover:bg-brand-50 transition font-semibold text-sm flex items-center justify-center gap-2">
                  💬 Tanya-tanya WA
                </a>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-brand-100 to-brand-50 rounded-3xl overflow-hidden aspect-square">
                <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-transparent" />
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-ink-400">
                    <div className="text-6xl mb-2">🪡</div>
                    <p className="text-sm">Sewing Machine Image</p>
                  </div>
                </div>
              </div>
              {/* Badge */}
              <div className="absolute -bottom-4 -right-4 bg-brand-600 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg">
                <div className="text-center text-sm font-bold">
                  👍<br />Hasil Jahitan<br />yang Rapi
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-brand-100 text-brand-600 rounded-full text-xs font-bold mb-4">
              Layanan Kami
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-3">
              Layanan Jahit yang Tersedia
            </h2>
            <p className="text-base text-ink-700 max-w-2xl mx-auto">
              Kami melayani berbagai kebutuhan jahit untuk komunitas, hingga inslansi dengan hasil rapi dan tepat waktu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-brand-600 rounded-2xl p-8 text-white hover:shadow-lg transition">
              <h3 className="text-2xl font-bold mb-4">Alasan</h3>
              <p className="text-sm leading-relaxed opacity-90">
                Jahit Seragam sekolah, PDH, insiansi, zipperjas, Kaos Komunitas, Gamir, Kemaja formal, Jas Sekolah, dll
              </p>
            </div>

            <div className="bg-brand-500 rounded-2xl p-8 text-white hover:shadow-lg transition">
              <h3 className="text-2xl font-bold mb-4">Bahan-bahan</h3>
              <p className="text-sm leading-relaxed opacity-90">
                Jahit Celana Sekolah, Celana Formal, Celana Dinas, Training, Rok dll
              </p>
            </div>

            <div className="bg-brand-300 rounded-2xl p-8 text-white hover:shadow-lg transition">
              <h3 className="text-2xl font-bold mb-4">Atribut Lainnya</h3>
              <p className="text-sm leading-relaxed opacity-90">
                Kaos/Topi, Cius Sekolah dan Atribut Lainnya
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Link
              href="/buat-pesanan"
              className="px-6 py-3 bg-brand-600 text-white rounded hover:bg-brand-700 transition font-semibold text-sm"
            >
              Buat Pesanan
            </Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-16 sm:py-24 bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-brand-100 text-brand-600 rounded-full text-xs font-bold mb-4">
              Alur Pemesanan
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-3">
              Alur Pemesanan yang Mudah
            </h2>
            <p className="text-base text-ink-700 max-w-2xl mx-auto">
              Pesan pakaian custom kini lebih praktis, huni langkah berikut untuk mulai memesan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                number: 1,
                title: "Isi Data Pelanggaan",
                description: "untuk mempermudah proses",
              },
              {
                number: 2,
                title: "Tambahkan Ukuran",
                description: "masukkan ukuran badan pelanggan",
              },
              {
                number: 3,
                title: "Masukkan Ukuran",
                description: "Masukkan Ukuran-Ukuran untuk tahu besar yang dibutuhkan",
              },
              {
                number: 4,
                title: "Buat Pesanan",
                description: "Buat pesanan berdasarkan detail dan ukuran yang sudah diinput",
              },
              {
                number: 5,
                title: "Admin Konfirmasi",
                description: "admin kami akan segera mengkonfirmasi pesanan anda",
              },
              {
                number: 6,
                title: "Metode Pembayaran",
                description: "anda bisa memilih metode pembayaran yang tersedia",
              },
            ].map((step) => (
              <div key={step.number} className="bg-brand-600 rounded-2xl p-6 text-white hover:shadow-lg transition">
                <div className="flex items-start gap-4 mb-3">
                  <div className="h-8 w-8 rounded-full bg-white text-brand-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-bold">{step.title}</h3>
                </div>
                <p className="text-sm opacity-90 ml-12">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden aspect-square bg-ink-100">
                <div className="w-full h-full flex items-center justify-center text-ink-400">
                  <div className="text-center">
                    <div className="text-6xl mb-2">✂️</div>
                    <p className="text-sm">Workshop Image</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="inline-block px-3 py-1 bg-brand-100 text-brand-600 rounded-full text-xs font-bold mb-4">
                About
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-6">
                Tentang Penjahit Syifa
              </h2>
              <p className="text-base text-ink-700 mb-4 leading-relaxed">
                Kami merupakan UMKM jasa jahit yang melayani berbagai kebutuhan pakaian custom dengan kualitas terjamin. Kami telah berpengalaman melayani seragam sekolah, PDH, kaos komunitas, hingga jas sekolah, somoa dalaman dengan teliti kebutuhan pelanggan.
              </p>
              <p className="text-base text-ink-700 leading-relaxed">
                Dengan pelayanan ramah kami, kami berkomitmen membantikan pelanggan mendapatkan pakaian pas, nyaman, dan berkualitas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-24 bg-brand-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-3">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Apakah bisa pesan dalam jumlah banyak?",
                a: "Ya, kami melayani pemesanan dalam jumlah besar dengan harga khusus.",
              },
              {
                q: "Apakah bisa custom ukuran sendiri?",
                a: "Tentu saja! Kami menyediakan opsi custom ukuran sesuai kebutuhan Anda.",
              },
              {
                q: "Berapa lama proses pengerjaannya?",
                a: "Waktu proses tergantung jumlah pesanan dan kompleksitas desain. Rata-rata 1-3 minggu.",
              },
              {
                q: "Apakah bisa konsultasi sebelum memesan?",
                a: "Tentu bisa! Hubungi kami via WhatsApp untuk konsultasi gratis.",
              },
              {
                q: "Metode Pembayaran lewat mana ya?",
                a: "Kami menerima pembayaran via transfer bank atau tunai. Bisa juga DP + pelunasan.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl overflow-hidden border border-brand-100">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-brand-50 transition text-left"
                >
                  <span className="font-semibold text-ink-900 text-sm sm:text-base">▶ {faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-brand-600 flex-shrink-0 transition-transform ${
                      expandedFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFaq === idx && (
                  <div className="px-6 py-4 bg-brand-50 border-t border-brand-100">
                    <p className="text-ink-700 text-sm">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-brand-600 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
            {/* Logo & Description */}
            <div>
              <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-6 inline-block">
                <div className="flex items-start gap-3">
                  <div className="text-4xl font-black text-white">SJ</div>
                  <div>
                    <div className="font-black text-white text-lg leading-tight">sijah</div>
                    <div className="text-xs opacity-90">Sistem Informasi Penjahit</div>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-3">Siap Buat Pakaian?</h3>
              <p className="text-sm opacity-90 leading-relaxed">
                Pesan sekarang dengan mudah dengan hasil jahitan yang rapi.
              </p>
            </div>

            {/* Hubungi Kami */}
            <div>
              <span className="inline-block px-3 py-1 bg-brand-300 text-white rounded-full text-xs font-bold mb-4">
                Kontak Kami
              </span>
              <h3 className="font-bold text-lg mb-3">Hubungi Kami</h3>
              <p className="text-sm opacity-90 mb-4">
                Punya pertanyaan terbuka dahulu? Kami siap membantu kebutuhan jahitmu.
              </p>
              <a href="https://wa.me/62855333343" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-white text-brand-600 rounded font-semibold text-sm hover:bg-brand-50 transition">
                Hubungi Kami
              </a>
            </div>

            {/* Contact Details */}
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold mb-1 flex items-center gap-2">
                  📱 <span>0855333343</span>
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1 flex items-center gap-2">
                  📍 <span>Dukuh, RT 0/RW 03, Kalisat, Kec. Sayang, Kab. Derma, 59563 Jawa Tengah, Indonesia</span>
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">⏰ Jam Operasional: Senin - Sabtu</p>
                <p className="opacity-90">08.00 - 20.00 WIB</p>
              </div>
            </div>
          </div>

          <div className="border-t border-brand-500 pt-6">
            <p className="text-center text-xs opacity-75">
              © 2026 Penjahit syifa. Hak Cipta Dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
