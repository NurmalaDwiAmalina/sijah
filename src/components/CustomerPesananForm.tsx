"use client";

import { useState } from "react";
import { VALIDATION } from "@/lib/config";
import { Plus, Trash2, X, ImageIcon, Loader, PencilLine } from "lucide-react";

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

const FIELD_LABEL: Record<string, string> = Object.fromEntries(
  [...ATASAN_FIELDS, ...BAWAHAN_FIELDS]
);

type Product = {
  id: number;
  judul: string;
  kategori: string;
  jumlah: number;
  measurements: Record<string, string>;
  catatan: string;
};

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
  const [foto, setFoto] = useState<string | null>(null);
  const [fotoUploading, setFotoUploading] = useState(false);
  const [fotoErr, setFotoErr] = useState<string | null>(null);

  // Daftar produk dalam satu pesanan
  const [products, setProducts] = useState<Product[]>([]);

  // Draft produk yang sedang diisi
  const [pJudul, setPJudul] = useState("");
  const [pKategori, setPKategori] = useState("Atasan");
  const [pJumlah, setPJumlah] = useState("1");
  const [pMeasurements, setPMeasurements] = useState<Record<string, string>>({});
  const [pCatatan, setPCatatan] = useState("");

  const currentFields = pKategori === "Atasan" ? ATASAN_FIELDS : BAWAHAN_FIELDS;

  function resetDraft() {
    setPJudul("");
    setPKategori("Atasan");
    setPJumlah("1");
    setPMeasurements({});
    setPCatatan("");
  }

  function addProduct() {
    if (!pJudul.trim()) return;
    const fieldNames = (
      pKategori === "Atasan" ? ATASAN_FIELDS : BAWAHAN_FIELDS
    ).map(([n]) => n as string);
    const cleanMeas: Record<string, string> = {};
    fieldNames.forEach((n) => {
      if (pMeasurements[n]) cleanMeas[n] = pMeasurements[n];
    });
    setProducts((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        judul: pJudul.trim(),
        kategori: pKategori,
        jumlah: Math.max(1, parseInt(pJumlah, 10) || 1),
        measurements: cleanMeas,
        catatan: pCatatan.trim(),
      },
    ]);
    resetDraft();
  }

  function removeProduct(id: number) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleFoto(file: File) {
    setFotoErr(null);
    const allowed = VALIDATION.upload.allowedImageTypes as readonly string[];
    if (!allowed.includes(file.type)) {
      setFotoErr(`Format harus ${VALIDATION.upload.allowedExtensionsLabel}`);
      return;
    }
    if (file.size > VALIDATION.upload.fotoReferensiMaxBytes) {
      setFotoErr(
        `Maksimal ${Math.round(VALIDATION.upload.fotoReferensiMaxBytes / 1024 / 1024)}MB`
      );
      return;
    }
    setFotoUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/image", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setFotoErr(data.error || "Upload gagal");
        return;
      }
      const data = await res.json();
      setFoto(data.url);
    } catch (err) {
      setFotoErr("Upload gagal, coba lagi");
      console.error(err);
    } finally {
      setFotoUploading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Hanya proses di langkah ringkasan, dan minimal ada satu produk.
    if (step !== 4 || products.length === 0) return;
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

      // Create order dengan banyak produk
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customer.id,
          judul,
          catatan: catatanOrder,
          tglEstimasi: new Date(tglEstimasi),
          fotoReferensi: foto,
          items: products.map((p) => ({
            judul: p.judul,
            kategori: p.kategori,
            jumlah: p.jumlah,
            catatan: p.catatan,
            ...p.measurements,
          })),
        }),
      });
      if (!orderResponse.ok) {
        const err = await orderResponse.json().catch(() => ({}));
        throw new Error(err.error || "Gagal membuat pesanan");
      }

      const order = await orderResponse.json();
      // Arahkan pelanggan ke halaman konfirmasi (bukan dashboard admin).
      window.location.href = `/pesanan-berhasil/${order.code}`;
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
      {/* Indikator langkah */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={
              "h-1.5 flex-1 rounded-full " +
              (s <= step ? "bg-brand-600" : "bg-ink-100")
            }
          />
        ))}
      </div>

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
            <label className="block text-sm font-medium text-ink-900 mb-2">No Wa</label>
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
            <label className="block text-sm font-medium text-ink-900 mb-2">Alamat</label>
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
            <label className="block text-sm font-medium text-ink-900 mb-2">Gender</label>
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

      {/* Step 2: Data Pesanan + foto referensi */}
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

          {/* Upload foto referensi */}
          <div>
            <label className="block text-sm font-medium text-ink-900 mb-2">
              Foto Referensi <span className="text-ink-400 font-normal">(opsional)</span>
            </label>
            <input
              id="foto-referensi"
              type="file"
              accept={VALIDATION.upload.allowedAcceptString}
              className="hidden"
              disabled={fotoUploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFoto(f);
              }}
            />
            {foto ? (
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={foto}
                  alt="referensi"
                  className="h-40 rounded-lg border border-ink-200 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFoto(null)}
                  disabled={fotoUploading}
                  className="absolute -top-2 -right-2 grid h-7 w-7 place-items-center rounded-full bg-red-500 text-white shadow disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="foto-referensi"
                className="flex w-full items-center justify-between rounded-lg border-2 border-dashed border-ink-200 px-4 py-6 text-sm text-ink-500 hover:border-brand-500 hover:bg-brand-50/40 transition cursor-pointer"
              >
                <span>
                  {fotoUploading
                    ? "Mengunggah..."
                    : `Klik untuk upload gambar referensi (${VALIDATION.upload.allowedExtensionsLabel}, max 5MB)`}
                </span>
                {fotoUploading ? (
                  <Loader className="h-5 w-5 text-ink-400 animate-spin" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-ink-400" />
                )}
              </label>
            )}
            {fotoErr && <p className="mt-1 text-xs text-red-500">{fotoErr}</p>}
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
              disabled={!judul || !tglEstimasi || fotoUploading}
              className="flex-1 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition font-semibold disabled:opacity-50"
            >
              Lanjut
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Produk (multi) */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-ink-900">Produk & Ukuran</h2>
          <p className="text-ink-700">
            Tambahkan satu atau beberapa produk. Bisa pesan lebih dari satu produk
            dalam satu pesanan.
          </p>

          {/* Daftar produk yang sudah ditambahkan */}
          {products.length > 0 && (
            <div className="space-y-3">
              {products.map((p, i) => (
                <div
                  key={p.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-ink-200 bg-brand-50/40 p-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-ink-900">
                      {i + 1}. {p.judul}
                    </p>
                    <p className="text-xs text-ink-600 mt-0.5">
                      {p.kategori} • Jumlah: {p.jumlah}
                    </p>
                    {Object.keys(p.measurements).length > 0 && (
                      <p className="text-xs text-ink-500 mt-1">
                        {Object.entries(p.measurements)
                          .map(([k, v]) => `${FIELD_LABEL[k] ?? k}: ${v}cm`)
                          .join(" · ")}
                      </p>
                    )}
                    {p.catatan && (
                      <p className="text-xs text-ink-500 mt-1 italic">“{p.catatan}”</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeProduct(p.id)}
                    className="text-red-500 hover:text-red-600 p-1 flex-shrink-0"
                    aria-label="Hapus produk"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Form tambah produk */}
          <div className="rounded-xl border border-ink-200 p-4 sm:p-5 space-y-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
              <PencilLine className="h-4 w-4 text-brand-600" />
              {products.length > 0 ? "Tambah Produk Lain" : "Tambah Produk"}
            </p>

            <div>
              <label className="block text-sm font-medium text-ink-900 mb-2">
                Nama / Jenis Produk
              </label>
              <input
                type="text"
                value={pJudul}
                onChange={(e) => setPJudul(e.target.value)}
                placeholder="Misal: Kemeja Putih"
                className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none focus:border-brand-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink-900 mb-2">
                  Kategori
                </label>
                <div className="flex gap-4 pt-1">
                  {["Atasan", "Bawahan"].map((k) => (
                    <label key={k} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="pKategori"
                        value={k}
                        checked={pKategori === k}
                        onChange={(e) => setPKategori(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-ink-700 text-sm">{k}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-900 mb-2">
                  Jumlah
                </label>
                <input
                  type="number"
                  min={1}
                  value={pJumlah}
                  onChange={(e) => setPJumlah(e.target.value)}
                  className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none focus:border-brand-600"
                />
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
                      value={pMeasurements[fieldName] || ""}
                      onChange={(e) =>
                        setPMeasurements((prev) => ({
                          ...prev,
                          [fieldName]: e.target.value,
                        }))
                      }
                      placeholder="0"
                      className="flex-1 px-3 py-2 border border-ink-200 rounded-lg focus:outline-none focus:border-brand-600 min-w-0"
                    />
                    <span className="py-2 text-ink-700 text-sm">cm</span>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-900 mb-2">
                Catatan Produk
              </label>
              <textarea
                value={pCatatan}
                onChange={(e) => setPCatatan(e.target.value)}
                placeholder="Catatan atau referensi khusus untuk produk ini"
                className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none focus:border-brand-600 min-h-[70px]"
              />
            </div>

            <button
              type="button"
              onClick={addProduct}
              disabled={!pJudul.trim()}
              className="flex w-full items-center justify-center gap-2 py-3 border-2 border-brand-600 text-brand-600 rounded-lg hover:bg-brand-50 transition font-semibold disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> Tambah Produk
            </button>
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
              type="button"
              onClick={() => setStep(4)}
              disabled={products.length === 0}
              className="flex-1 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition font-semibold disabled:opacity-50"
            >
              Lanjut ke Ringkasan
            </button>
          </div>
          {products.length === 0 && (
            <p className="text-center text-xs text-ink-400 -mt-2">
              Tambahkan minimal satu produk untuk melanjutkan.
            </p>
          )}
        </div>
      )}

      {/* Step 4: Ringkasan */}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-ink-900">Ringkasan Pesanan</h2>
          <p className="text-ink-700">
            Periksa kembali detail pesananmu sebelum dikirim.
          </p>

          {/* Data pelanggan */}
          <div className="rounded-xl border border-ink-200 p-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-1">
              Data Pelanggan
            </p>
            <p className="text-sm text-ink-900 font-medium">{nama}</p>
            <p className="text-sm text-ink-600">{noWa}</p>
            <p className="text-sm text-ink-600">{alamat}</p>
            <p className="text-sm text-ink-600">{gender}</p>
          </div>

          {/* Info pesanan */}
          <div className="rounded-xl border border-ink-200 p-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-1">
              Informasi Pesanan
            </p>
            <p className="text-sm text-ink-900 font-medium">{judul}</p>
            {catatanOrder && <p className="text-sm text-ink-600">{catatanOrder}</p>}
            <p className="text-sm text-ink-600">Estimasi selesai: {tglEstimasi || "-"}</p>
            {foto && (
              <div className="pt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={foto}
                  alt="referensi"
                  className="h-28 rounded-lg border border-ink-200 object-cover"
                />
              </div>
            )}
          </div>

          {/* Produk */}
          <div className="rounded-xl border border-ink-200 p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
              Produk ({products.length})
            </p>
            {products.map((p, i) => (
              <div key={p.id} className="border-t border-ink-100 pt-3 first:border-0 first:pt-0">
                <p className="font-semibold text-ink-900 text-sm">
                  {i + 1}. {p.judul}
                </p>
                <p className="text-xs text-ink-600 mt-0.5">
                  {p.kategori} • Jumlah: {p.jumlah}
                </p>
                {Object.keys(p.measurements).length > 0 && (
                  <p className="text-xs text-ink-500 mt-1">
                    {Object.entries(p.measurements)
                      .map(([k, v]) => `${FIELD_LABEL[k] ?? k}: ${v}cm`)
                      .join(" · ")}
                  </p>
                )}
                {p.catatan && (
                  <p className="text-xs text-ink-500 mt-1 italic">“{p.catatan}”</p>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-brand-50 p-3 text-xs text-ink-600">
            Harga akan dikonfirmasi oleh admin kami setelah pesanan masuk.
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex-1 py-3 border-2 border-ink-900 text-ink-900 rounded-lg hover:bg-ink-50 transition font-semibold"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={loading || products.length === 0}
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
