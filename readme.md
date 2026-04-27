# 🧵 AIS Sijah — Sistem Informasi Penjahit

---

## 🤖 Peran Kamu di Project Ini (Baca Ini Dulu)

Kamu adalah **senior full-stack developer** yang ditugaskan membantu membangun project **AIS Sijah** dari awal hingga selesai.

Sikap dan cara kerja kamu:
- **Proaktif** — jangan tunggu disuruh detail per detail. Kalau ada yang kurang jelas, tanyakan dulu sebelum eksekusi.
- **Opinionated** — kalau ada pilihan teknis (struktur folder, penamaan, pendekatan), berikan rekomendasi terbaik beserta alasannya, jangan tanya balik tanpa pendapat.
- **Sabar & komunikatif** — project owner bukan developer. Jelaskan keputusan teknis dengan bahasa yang mudah dimengerti, tanpa menggurui.
- **Konsisten** — ikuti konvensi yang sudah disepakati di seluruh codebase. Jangan ganti gaya di tengah jalan.
- **Teliti** — setiap fitur yang dibuat harus mempertimbangkan edge case (misal: pesanan tanpa ukuran, pembayaran melebihi total, data kosong).
- **Berbahasa Indonesia** — semua komunikasi, komentar kode, dan penjelasan gunakan Bahasa Indonesia yang santai tapi profesional.

Kamu tidak hanya menulis kode — kamu juga **menjaga kualitas arsitektur**, **mengingatkan potensi bug**, dan **memberi saran** kalau ada pendekatan yang lebih baik dari yang diminta.

---

> Platform manajemen operasional digital untuk UMKM penjahit. Mengubah catatan pesanan tradisional menjadi sistem terintegrasi: dari data pelanggan, riwayat ukuran, pelacakan produksi, hingga pembayaran bertahap.

---

## 📋 Deskripsi Proyek

**AIS Sijah** adalah aplikasi web manajemen operasional yang dirancang khusus untuk kebutuhan bisnis penjahit skala UMKM. Sistem ini memungkinkan pemilik usaha untuk mengelola seluruh alur kerja secara digital — mulai dari pencatatan pelanggan baru, penyimpanan data ukuran badan, pembuatan pesanan (individu maupun seragam/rombongan), hingga pemantauan status produksi dan pencatatan pembayaran bertahap.

Fitur unggulan utama adalah **Data Snapshotting** — data pelanggan dan ukuran yang digunakan saat pesanan dibuat akan disalin ke dalam detail pesanan, sehingga perubahan data di kemudian hari tidak akan mengubah riwayat pesanan lama.

---

## ✨ Fitur Utama

### 1. Manajemen Pelanggan & Multi-Ukuran
- Database pelanggan terpusat (nama, no. WhatsApp, alamat, gender)
- Satu pelanggan dapat memiliki banyak catatan ukuran (multi-version)
- Labeling ukuran untuk memudahkan identifikasi (misal: "Ukuran Formal 2024", "Ukuran Santai")
- Pencatatan ukuran badan lengkap: lingkar leher, lebar bahu, lingkar dada, lingkar pinggang, panjang lengan, panjang baju, lingkar panggul, dll.
- Kolom catatan khusus per ukuran (misal: "Minta pinggang agak longgar")

### 2. Pencatatan Pesanan
- Mendukung pesanan individu maupun seragam/rombongan
- Pilih dari database pelanggan yang sudah ada atau buat baru
- Pilih ukuran dari riwayat ukuran pelanggan (di-snapshot ke pesanan)
- Upload foto referensi model pakaian
- Monitoring progres produksi:
  - `Antrean` → `Potong Kain` → `Dijahit` → `Fitting` → `Selesai` → `Diambil`
- Pengurutan dan filter pesanan berdasarkan status, tanggal, dan jenis pakaian

### 3. Manajemen Keuangan
- Input harga manual per pesanan (biaya jasa + biaya tambahan)
- Mendukung pembayaran bertahap (DP dan pelunasan)
- Status pembayaran otomatis berubah menjadi `Lunas` jika total pembayaran sudah sesuai nilai kontrak
- Riwayat transaksi per pesanan
- Metode pembayaran: Tunai / Transfer

### 4. Dashboard *(opsional)*
- Jumlah pesanan berdasarkan status produksi
- Tren pertumbuhan pelanggan baru
- Distribusi pesanan berdasarkan kategori pakaian

---

## 🗄️ Skema Database

### Entitas 1: `customers` (Pelanggan)

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id_pelanggan` | UUID / INT | Primary Key |
| `nama_lengkap` | VARCHAR | Nama lengkap pelanggan |
| `no_whatsapp` | VARCHAR | Nomor WA aktif |
| `alamat` | TEXT | Alamat lengkap |
| `gender` | ENUM | `Pria` / `Wanita` |
| `created_at` | TIMESTAMP | — |
| `updated_at` | TIMESTAMP | — |

---

### Entitas 2: `measurements` (Ukuran Badan)

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id_ukuran` | UUID / INT | Primary Key |
| `id_pelanggan` | FK → customers | Foreign Key |
| `nama_ukuran` | VARCHAR | Label ukuran (misal: "Ukuran Formal 2025") |
| `lingkar_leher` | DECIMAL | dalam cm |
| `lebar_bahu` | DECIMAL | dalam cm |
| `lingkar_dada` | DECIMAL | dalam cm |
| `lingkar_pinggang` | DECIMAL | dalam cm |
| `lingkar_panggul` | DECIMAL | dalam cm |
| `panjang_lengan` | DECIMAL | dalam cm |
| `panjang_baju` | DECIMAL | dalam cm |
| `catatan_khusus` | TEXT | Catatan preferensi fitting |
| `created_at` | TIMESTAMP | — |
| `updated_at` | TIMESTAMP | — |

> ⚠️ Ukuran badan lainnya bisa ditambahkan sesuai kebutuhan (misal: panjang celana, lingkar paha, dll.)

---

### Entitas 3: `orders` (Pesanan)

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id_pesanan` | UUID / INT | Primary Key |
| `id_pelanggan` | FK → customers | Foreign Key |
| `judul_pesanan` | VARCHAR | Nama/judul pesanan |
| `tgl_masuk` | DATE | Tanggal pesanan diterima |
| `tgl_estimasi_selesai` | DATE | Deadline pengerjaan |
| `jenis_pakaian` | VARCHAR | Kebaya, Jas, Celana, dll. |
| `jumlah` | INT | Jumlah item (untuk rombongan) |
| `foto_referensi` | VARCHAR | Path / URL gambar referensi |
| `status_pesanan` | ENUM | `Antrean`, `Potong Kain`, `Dijahit`, `Fitting`, `Selesai`, `Diambil` |
| `catatan` | TEXT | Catatan tambahan pesanan |
| `biaya_jasa` | DECIMAL | Biaya jasa jahit |
| `biaya_tambahan` | DECIMAL | Biaya kain, aksesoris, dll. |
| `total_harga` | DECIMAL | Total = biaya_jasa + biaya_tambahan |
| `status_pembayaran` | ENUM | `Belum Bayar`, `DP`, `Lunas` |
| **[SNAPSHOT] nama_pelanggan** | VARCHAR | Disalin saat pesanan dibuat |
| **[SNAPSHOT] no_whatsapp** | VARCHAR | Disalin saat pesanan dibuat |
| **[SNAPSHOT] detail_ukuran** | JSON / TEXT | Seluruh data ukuran disalin |
| `created_at` | TIMESTAMP | — |
| `updated_at` | TIMESTAMP | — |

> 💡 **Data Snapshotting**: Kolom berlabel `[SNAPSHOT]` adalah salinan data pelanggan dan ukuran pada saat pesanan dibuat. Teknik ini memastikan riwayat pesanan lama tidak berubah meski data induk diperbarui di kemudian hari.

---

### Entitas 4: `payments` (Pembayaran)

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id_pembayaran` | UUID / INT | Primary Key |
| `id_pesanan` | FK → orders | Foreign Key |
| `total_harga` | DECIMAL | Total tagihan pesanan |
| `jumlah_bayar` | DECIMAL | Nominal yang dibayarkan |
| `sisa_tagihan` | DECIMAL | Otomatis: total_harga - SUM(jumlah_bayar) |
| `metode_bayar` | ENUM | `Tunai`, `Transfer` |
| `created_at` | TIMESTAMP | — |
| `updated_at` | TIMESTAMP | — |

> 💡 **Auto-Lunas Logic**: Sistem secara otomatis mengubah `status_pembayaran` di tabel `orders` menjadi `Lunas` ketika `SUM(jumlah_bayar)` dari semua record pembayaran terkait sudah sama atau melebihi `total_harga`.

---

## 🔄 Alur Data (Business Logic)

```
[Buat Pesanan]
    │
    ├── Pilih Pelanggan dari Database
    │       └── Jika baru → Buat pelanggan baru dulu
    │
    ├── Pilih Ukuran dari Riwayat Ukuran Pelanggan
    │       └── Data ukuran di-SNAPSHOT ke tabel orders
    │
    ├── Isi Detail Pesanan (jenis, deadline, harga, catatan)
    │
    └── Pesanan tersimpan dengan status: Antrean

[Update Status Produksi]
    Antrean → Potong Kain → Dijahit → Fitting → Selesai → Diambil

[Catat Pembayaran]
    │
    ├── Input nominal pembayaran (DP atau pelunasan)
    │
    └── Sistem cek: SUM(bayar) >= total_harga?
            ├── YA  → status_pembayaran = "Lunas" (otomatis)
            └── TIDAK → status_pembayaran = "DP"
```

---

## 🛠️ Tech Stack (Rekomendasi)

> Sesuaikan dengan preferensi atau requirement capstone project kamu.

| Layer | Teknologi |
|---|---|
| **Frontend** | React.js / Next.js |
| **Backend** | Laravel (PHP) / Express.js / FastAPI |
| **Database** | MySQL / PostgreSQL |
| **File Storage** | Local storage / Cloudinary (foto referensi) |
| **Styling** | Tailwind CSS |
| **Auth** | Laravel Sanctum / JWT |

---

## 📁 Struktur Folder (Rekomendasi)

```
ais-sijah/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── dashboard/
│   │   │   ├── customers/        # List, detail, tambah, edit pelanggan
│   │   │   ├── measurements/     # Riwayat ukuran per pelanggan
│   │   │   ├── orders/           # List, tambah, detail, update status pesanan
│   │   │   └── payments/         # Catat & riwayat pembayaran
│   │   ├── components/
│   │   └── utils/
│   └── public/
│
├── backend/
│   ├── app/
│   │   ├── Models/
│   │   │   ├── Customer.php
│   │   │   ├── Measurement.php
│   │   │   ├── Order.php
│   │   │   └── Payment.php
│   │   ├── Http/Controllers/
│   │   └── ...
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
│
└── README.md
```

---

## 📌 Catatan Penting untuk Development

1. **Data Snapshotting** wajib diimplementasikan. Saat pesanan dibuat, salin `nama_pelanggan`, `no_whatsapp`, dan seluruh data ukuran yang dipilih ke dalam tabel `orders` (bisa dalam kolom JSON atau kolom terpisah). Jangan hanya menyimpan FK saja.

2. **Auto-Lunas Logic** diimplementasikan di backend. Setiap kali record baru ditambahkan ke tabel `payments`, trigger atau service akan menghitung ulang total bayar dan memperbarui `status_pembayaran` di tabel `orders`.

3. **Upload Foto Referensi** — pastikan validasi tipe file (jpg, png, webp) dan batas ukuran file di backend.

4. **Enum Status** — gunakan enum atau konstanta yang konsisten antara frontend dan backend untuk menghindari typo.

5. **No. WhatsApp** — simpan dalam format internasional (628xxx) untuk memudahkan integrasi WhatsApp link (`wa.me/628xxx`) jika dibutuhkan di kemudian hari.

---

## 🎯 Scope MVP (Minimum Viable Product)

Prioritaskan fitur berikut untuk versi pertama:

- [x] CRUD Pelanggan
- [x] CRUD Ukuran Badan (multi per pelanggan)
- [x] CRUD Pesanan + snapshot data
- [x] Update status produksi pesanan
- [x] Pencatatan pembayaran + auto-lunas logic
- [ ] Dashboard *(opsional, kerjakan jika waktu memungkinkan)*

---

*AIS Sijah — Capstone Project | Sistem Informasi Penjahit untuk UMKM*