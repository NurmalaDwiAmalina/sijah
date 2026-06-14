"use client";

import { useState } from "react";
import { STANDAR_SIZES, MEASUREMENT_KATEGORI } from "@/lib/config";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const ATASAN_FIELDS = [
  ["lingkarLeher", "Lingkar Leher"],
  ["lebarBahu", "Lebar Bahu"],
  ["lingkarDada", "Lingkar Dada"],
  ["lingkarPinggang", "Lingkar Pinggang"],
  ["panjangLengan", "Panjang Lengan"],
  ["panjangBaju", "Panjang Baju"],
] as const;

const BAWAHAN_FIELDS = [
  ["lingkarPinggang", "Lingkar Pinggang"],
  ["lingkarPinggul", "Lingkar Pinggul"],
  ["lingkarPaha", "Lingkar Paha"],
  ["panjangCelana", "Panjang Celana"],
] as const;

export function CustomerPesananForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Customer data
  const [nama, setNama] = useState("");
  const [noWa, setNoWa] = useState("");
  const [alamat, setAlamat] = useState("");
  const [gender, setGender] = useState("Laki-laki");

  // Order data
  const [judul, setJudul] = useState("");
  const [catatanOrder, setCatatanOrder] = useState("");
  const [tglEstimasi, setTglEstimasi] = useState("");

  // Measurements
  const [kategori, setKategori] = useState("Atasan");
  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [catatan, setCatatan] = useState("");

  const currentFields = kategori === "Atasan" ? ATASAN_FIELDS : BAWAHAN_FIELDS;

  const handleMeasurementChange = (field: string, value: string) => {
    setMeasurements((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create customer first (or find if exists)
      const customerResponse = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, noWa, alamat, gender }),
      });
      if (!customerResponse.ok) {
        const err = await customerResponse.json().catch(() => ({}));
        throw new Error(err.error || "Gagal menyimpan data pelanggan");
      }
      const customer = await customerResponse.json();

      // Create order
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customer.id,
          judul,
          catatan: catatanOrder,
          tglEstimasi: new Date(tglEstimasi),
          measurements: {
            judul,
            kategori,
            ...measurements,
            catatan,
          },
        }),
      });
      if (!orderResponse.ok) {
        const err = await orderResponse.json().catch(() => ({}));
        throw new Error(err.error || "Gagal membuat pesanan");
      }

      alert("Pesanan berhasil dibuat! Kami akan segera menghubungi Anda.");
      window.location.href = "/";
    } catch (error) {
      console.error("Error creating order:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Gagal membuat pesanan. Coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step 1: Data Pelanggan */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-ink-900">Lengkapi Data Pesanan</h2>
          <p className="text-ink-700">
            Masukkan data diri kamu untuk mempermudah proses pemesanan
          </p>

          <div>
            <label className="block text-sm font-medium text-ink-900 mb-2">
              Nama Pelanggan
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama pelanggan"
              required
              className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none focus:border-brand-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-900 mb-2">
              No Wa
            </label>
            <input
              type="text"
              value={noWa}
              onChange={(e) => setNoWa(e.target.value)}
              placeholder="Masukkan no WA pelanggan"
              required
              className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none focus:border-brand-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-900 mb-2">
              Alamat
            </label>
            <input
              type="text"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Masukkan alamat pelanggan"
              required
              className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none focus:border-brand-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-900 mb-2">
              Gender
            </label>
            <div className="flex gap-6">
              {["Laki-laki", "Perempuan"].map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={gender === g}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-ink-700">{g}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={!nama || !noWa || !alamat}
            className="w-full py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition font-semibold disabled:opacity-50"
          >
            Lanjut
          </button>
        </div>
      )}

      {/* Step 2: Data Pesanan */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-ink-900">Informasi Pesanan</h2>

          <div>
            <label className="block text-sm font-medium text-ink-900 mb-2">
              Nama Pesanan
            </label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Misal: Seragam SD Merah Putih"
              required
              className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none focus:border-brand-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-900 mb-2">
              Deskripsi Pesanan
            </label>
            <textarea
              value={catatanOrder}
              onChange={(e) => setCatatanOrder(e.target.value)}
              placeholder="Jelaskan detail pesanan Anda"
              className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none focus:border-brand-600 min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-900 mb-2">
              Tanggal Estimasi Selesai
            </label>
            <input
              type="date"
              value={tglEstimasi}
              onChange={(e) => setTglEstimasi(e.target.value)}
              required
              className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none focus:border-brand-600"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-3 border-2 border-ink-900 text-ink-900 rounded-lg hover:bg-ink-50 transition font-semibold"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={!judul || !tglEstimasi}
              className="flex-1 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition font-semibold disabled:opacity-50"
            >
              Lanjut
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Measurements */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-ink-900">Detail Ukuran</h2>
          <p className="text-ink-700">Informasi ukuran badan pelanggan untuk referensi jahitan.</p>

          <div>
            <label className="block text-sm font-medium text-ink-900 mb-2">
              Kategori Ukuran
            </label>
            <div className="flex gap-4">
              {["Atasan", "Bawahan"].map((k) => (
                <label key={k} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="kategori"
                    value={k}
                    checked={kategori === k}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-ink-700">{k}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {currentFields.map(([fieldName, label]) => (
              <div key={fieldName}>
                <label className="block text-sm font-medium text-ink-900 mb-2">
                  {label}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={measurements[fieldName] || ""}
                    onChange={(e) => handleMeasurementChange(fieldName, e.target.value)}
                    placeholder="0"
                    className="flex-1 px-3 py-2 border border-ink-200 rounded-lg focus:outline-none focus:border-brand-600"
                  />
                  <span className="py-2 text-ink-700">cm</span>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-900 mb-2">
              Catatan Tambahan
            </label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Catatan atau referensi khusus"
              className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none focus:border-brand-600 min-h-[80px]"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 py-3 border-2 border-ink-900 text-ink-900 rounded-lg hover:bg-ink-50 transition font-semibold"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition font-semibold disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Buat Pesanan"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
