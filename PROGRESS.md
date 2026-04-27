# 🧵 AIS Sijah — Progress Report

> Sistem Informasi Penjahit untuk UMKM
> **Status:** ✅ MVP Selesai — sudah deploy ke production (Vercel + Neon)
> **Repository:** https://github.com/NurmalaDwiAmalina/sijah
> **Live URL:** https://sijah.vercel.app

---

## 🔑 Demo Login

| Email | Password |
|---|---|
| `admin@sijah.com` | `admin123` |

---

## 🛠️ Tech Stack

### Frontend
| Tools | Versi | Fungsi |
|---|---|---|
| **Next.js** | 14.2.15 | Framework React, App Router (file-based routing) |
| **TypeScript** | 5.6 | Type safety di seluruh codebase |
| **Tailwind CSS** | 3.4 | Utility-first styling (no global CSS file) |
| **lucide-react** | 0.456 | Icon library (tree-shakeable, ringan) |
| **clsx** | 2.1 | Conditional className helper |

### Backend & Database
| Tools | Versi | Fungsi |
|---|---|---|
| **Prisma ORM** | 6.19 | Type-safe database client + migration tool |
| **PostgreSQL** | via Neon | Cloud database serverless |
| **Neon** | — | Postgres provider (gratis 0.5 GB, region Singapore) |
| **bcryptjs** | 3.0 | Hashing password user |
| **Server Actions** | (Next.js 14) | Mutasi data tanpa perlu API route terpisah |

### Deploy & Infra
| Layanan | Fungsi |
|---|---|
| **Vercel** | Hosting + CI/CD (auto-deploy tiap push ke `main`) |
| **GitHub** | Source control + integrasi Vercel |
| **Neon Postgres** | Database production (cloud, serverless) |
| **Cookie-based session** | Auth tanpa NextAuth — disimpan di tabel `Session` |

### Tools Pengembangan
- **tsx** — runner TypeScript untuk seed
- **ESLint** + **PostCSS** + **Autoprefixer**
- **Prisma Studio** (`npx prisma studio`) — GUI database lokal

---

## 🎨 Color Palette (Brand Identity)

```
Primary Greens:
  #019537  Dark green   — tombol, link aktif, badge sukses
  #17D55C  Vibrant      — accent, donut chart
  #0FD859  Bright       — gradient
  #DEFFA7  Light yellow-green — sidebar aktif, profile bg
  #F6FEE9  Pale         — header tabel, focus ring

Accent:
  #FF4B4B / #FFD1C9   Merah — error, badge "Dibatalkan"
  #008BFF / #DAEEFF   Biru — badge "Laki-laki", "Potong Kain"
  #FFB62E / #FFEDB1   Oranye — badge "Dijahit", "DP"

Neutrals:
  #000000 / #504F4F / #868686 / #CECECE / #DFDFDF / #EEEEEE
```

---

## ✅ Fitur yang Sudah Diimplementasikan

### 🔐 1. Auth & User Management
- [x] **Login** dengan email + password (bcrypt hash)
- [x] **Update Password** — verifikasi password lama, validasi 4 rule (min 8 char, ada nomor, special char, uppercase)
- [x] **Cookie session** 30 hari (HttpOnly, secure)
- [x] **Logout** — hapus session di DB + cookie
- [x] **Middleware** — auto-redirect `/login` jika belum auth
- [x] **Update profile** — username, email, **upload foto avatar** (base64, max 800KB)

### 📊 2. Dashboard
- [x] **3 Stat cards** real-time:
  - Total Revenue (sum semua pembayaran)
  - Total Pesanan Belum Terbayar
  - Total Pesanan
- [x] **Donut Chart** SVG custom — distribusi status pesanan
- [x] **Tabel Ringkasan Pesanan** — 7 pesanan terbaru
- [x] Semua angka di-aggregate dari DB (bukan hardcode)

### 👥 3. Manajemen Pelanggan
- [x] **CRUD lengkap** — Create, Read, Update, Delete
- [x] **List view** dengan pagination siap (table)
- [x] **Search** by nama/ID/WA/alamat
- [x] **Filter** by gender (Laki-laki / Perempuan)
- [x] **Ekspor CSV** — download data dengan filter aktif
- [x] **Auto-generate kode** (P0011, P0012, dst.)
- [x] **Multi-ukuran** — 1 pelanggan punya banyak ukuran (judul + catatan)
- [x] **Tambah/hapus ukuran** dari halaman detail
- [x] **Validasi** — tidak bisa hapus pelanggan yang masih punya pesanan

### 🛒 4. Manajemen Pesanan
- [x] **Create pesanan** — dengan multi-item ukuran (checkbox + jumlah + harga)
- [x] **Biaya tambahan** — bisa ditambah dinamis (label + nominal)
- [x] **Auto-calculate total** — subtotal + biaya tambahan
- [x] **Snapshot data** ✨ — saat pesanan dibuat, data pelanggan & ukuran disalin ke tabel `Order` dan `OrderItem` (kolom `snapshotNama`, `snapshotNoWa`, `snapshotData` JSON)
- [x] **Upload foto referensi** — base64 (max 1MB), preview + hapus
- [x] **Status produksi 7 tahap**: `Antrean` → `Potong Kain` → `Dijahit` → `Fitting` → `Selesai` → `Diambil` (+ `Dibatalkan`)
- [x] **Ubah status inline** — klik badge di list → dropdown → langsung simpan ke DB
- [x] **Search & filter** by status/judul/pelanggan
- [x] **Ekspor CSV** + **Hapus** via Action menu

### 💰 5. Manajemen Pembayaran
- [x] **Tambah pembayaran** — pilih ID pesanan → detail muncul → input nominal
- [x] **Auto-Lunas Logic** ✨ — sistem otomatis ubah status:
  - 0 pembayaran → `Belum Bayar`
  - Sebagian → `DP`
  - Total ≥ harga → `Lunas`
- [x] **Multi-pembayaran** per pesanan (cicilan)
- [x] **Sisa tagihan** auto-calculate
- [x] **Metode** — Tunai / Transfer
- [x] **Filter** pembayaran by status (Belum Bayar/DP/Lunas)
- [x] **Ekspor CSV** riwayat pembayaran
- [x] Pesanan yang sudah Lunas otomatis tersembunyi dari form "Buat Pembayaran"

### 🎨 6. UI/UX
- [x] **Sidebar navigation** dengan section Main + Support
- [x] **Topbar** dengan avatar (clickable → ke profile)
- [x] **Responsive layout** mobile-tablet-desktop
- [x] **Empty states** semua list ada pesan kosong yang informatif
- [x] **Loading states** — tombol "Menyimpan..." saat pending
- [x] **Confirm dialog** sebelum hapus
- [x] **Status badges** dengan color palette resmi
- [x] **Error display** — pesan error inline (red box) untuk validation

---

## 🗄️ Database Schema

### Entity Relationship
```
User ─┬── Session
      └── (admin sistem)

Customer ─┬── Measurement (1-to-many)
          └── Order ──┬── OrderItem (1-to-many)
                      ├── AdditionalCost (1-to-many)
                      └── Payment (1-to-many)
```

### Tabel Utama

| Tabel | Kolom Penting | Catatan |
|---|---|---|
| **User** | email, username, password (bcrypt), avatar (base64) | Auth admin |
| **Session** | userId, expiresAt | Cookie-based session |
| **Customer** | code (P0001), nama, noWa, alamat, gender | Auto-increment kode |
| **Measurement** | judul, catatan, lingkar leher/dada/dll | Multi per customer |
| **Order** | code (S0001), judul, status, totalHarga, **snapshotNama**, **snapshotNoWa** | ✨ Snapshot data |
| **OrderItem** | judulUkuran, jumlah, hargaSatuan, **snapshotData (JSON)** | ✨ Snapshot ukuran |
| **AdditionalCost** | label, amount | Biaya non-jasa per pesanan |
| **Payment** | jumlah, metode (Tunai/Transfer) | Trigger auto-lunas |

### ✨ Highlight: Data Snapshotting
Saat pesanan dibuat, data pelanggan (`nama`, `noWa`) dan **seluruh detail ukuran** (lingkar leher, dada, dll.) disalin ke tabel `Order` dan `OrderItem`. Tujuannya: kalau pelanggan ubah ukurannya nanti, pesanan lama tetap mencatat ukuran yang dipakai saat itu.

### ✨ Highlight: Auto-Lunas Logic
Setiap kali ada record `Payment` baru, server action menghitung ulang:
```ts
totalBayar = SUM(payment.jumlah where orderId = X)
if (totalBayar >= order.totalHarga) → status = "Lunas"
else if (totalBayar > 0)            → status = "DP"
else                                → status = "Belum Bayar"
```

---

## 🏗️ Arsitektur Singkat

```
┌─────────────────────────────────────┐
│  Browser (React Client Component)   │
│  • Form, dropdown, modal interaktif │
└────────┬────────────────────────────┘
         │ Server Action (RPC, type-safe)
         ▼
┌─────────────────────────────────────┐
│  Vercel Edge / Serverless Function  │
│  • Middleware (auth check)          │
│  • Server Component (RSC) — fetch   │
│  • Server Action — mutate           │
└────────┬────────────────────────────┘
         │ Prisma Client (typed query)
         ▼
┌─────────────────────────────────────┐
│  Neon PostgreSQL (Singapore region) │
│  • Connection pooling               │
│  • Auto-scale to zero               │
└─────────────────────────────────────┘
```

**Kenapa pilihan ini:**
- **Server Actions** — gak perlu bikin API route terpisah, pemanggilan dari client otomatis type-safe
- **RSC (React Server Components)** — fetch data langsung di server, no waterfall, auto-cached
- **Neon Postgres** — gratis, serverless, integrasi langsung dengan Vercel
- **SQLite di dev** kalau perlu offline (sekarang sudah migrasi ke Postgres untuk konsistensi dev↔prod)

---

## 📁 Struktur Folder

```
sijah/
├── prisma/
│   ├── schema.prisma          # Definisi 8 model
│   └── seed.ts                # Seed admin + 10 pelanggan + 10 pesanan
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── login/
│   │   ├── update-password/
│   │   ├── dashboard/
│   │   ├── pelanggan/
│   │   │   ├── page.tsx       # List
│   │   │   ├── new/page.tsx   # Form tambah
│   │   │   └── [id]/page.tsx  # Detail/edit
│   │   ├── pesanan/
│   │   ├── pembayaran/
│   │   ├── profile/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Redirect ke /login
│   │   └── globals.css        # Tailwind + custom utilities
│   │
│   ├── components/            # 13 reusable components
│   │   ├── AuthShell.tsx      # Layout login & update password
│   │   ├── DashboardShell.tsx # Layout dashboard (sidebar + main)
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   ├── Logo.tsx
│   │   ├── Badge.tsx
│   │   ├── DonutChart.tsx     # SVG chart custom
│   │   ├── PelangganForm.tsx
│   │   ├── PesananForm.tsx
│   │   ├── PembayaranForm.tsx
│   │   ├── ProfileForm.tsx
│   │   ├── AvatarUpload.tsx
│   │   ├── StatusDropdown.tsx
│   │   ├── RowActions.tsx     # ... menu (Detail/Hapus)
│   │   ├── SearchFilterBar.tsx
│   │   └── ExportButton.tsx
│   │
│   ├── lib/
│   │   ├── db.ts              # Prisma client singleton
│   │   ├── auth.ts            # Session helpers
│   │   ├── code.ts            # Auto-generate P0001/S0001
│   │   ├── format.ts          # formatRupiah, formatDate
│   │   ├── cn.ts              # className helper
│   │   └── actions/           # Server Actions per modul
│   │       ├── auth.ts
│   │       ├── pelanggan.ts
│   │       ├── pesanan.ts
│   │       └── pembayaran.ts
│   │
│   └── middleware.ts          # Auth protection
│
├── tailwind.config.ts         # Brand color tokens
├── next.config.js
├── package.json
└── .env.example               # Template env vars
```

---

## 🚀 Cara Menjalankan Lokal

```bash
# 1. Install dependencies
npm install

# 2. Setup database (SQLite untuk dev, atau pakai DATABASE_URL Postgres)
cp .env.example .env
# edit .env, isi DATABASE_URL dan SESSION_SECRET

# 3. Push schema & seed data awal
npm run db:push
npm run db:seed

# 4. Run dev server
npm run dev
# → http://localhost:3000

# 5. Login dengan admin@sijah.com / admin123
```

### Script tersedia
| Command | Fungsi |
|---|---|
| `npm run dev` | Development server dengan hot reload |
| `npm run build` | Production build (auto `prisma generate`) |
| `npm run start` | Run production build |
| `npm run db:push` | Apply schema ke DB |
| `npm run db:seed` | Isi data awal |
| `npm run db:reset` | Wipe DB + re-seed |

---

## 🌐 Deployment

### Production
- **Hosting:** Vercel (auto-deploy dari `main` branch)
- **Database:** Neon Postgres (region `us-east-1`)
- **Domain:** sijah.vercel.app
- **Environment Variables di Vercel:**
  - `DATABASE_URL` — connection string Neon (pooled)
  - `SESSION_SECRET` — random string 32 char

### CI/CD Flow
```
git push origin main
    ↓
Vercel webhook trigger
    ↓
npm install → prisma generate → next build
    ↓
Deploy ke edge worldwide
    ↓
Live di sijah.vercel.app (~1-2 menit)
```

---

## 📈 Statistik Kode

```
Total file source: ~50 file TypeScript/TSX
Total baris kode:  ~3,500 LOC
Halaman:           11 routes
Server Actions:    16 fungsi
Database tables:   8 model
Build size:        ~99 KB First Load JS (gzipped)
```

---

## 🎯 Roadmap (jika ada waktu lebih)

### High-priority
- [ ] Halaman detail pesanan (history status, pembayaran log)
- [ ] Edit pesanan (ubah judul, deadline, dll)
- [ ] Print invoice / nota PDF

### Medium
- [ ] Notifikasi WhatsApp (link `wa.me/`) ke pelanggan untuk reminder pickup
- [ ] Kalender deadline pesanan
- [ ] Multi-user dengan role (admin / staff)
- [ ] Riwayat aktivitas (audit log)

### Nice-to-have
- [ ] Vercel Blob untuk foto (gantikan base64 di DB)
- [ ] Dark mode
- [ ] Mobile app (PWA)
- [ ] Export laporan bulanan (PDF/Excel)

---

## 💡 Highlight Teknis untuk Presentasi

1. **Type-safety end-to-end** — schema Prisma → client query → server action → React component, semuanya typed. Hampir mustahil bug runtime karena type mismatch.

2. **No REST API** — pakai **Server Actions** (fitur baru Next.js 14). Form submit langsung memanggil function di server, no JSON parsing, no fetch boilerplate.

3. **Data Snapshotting pattern** — solusi elegan untuk "history immutability" tanpa perlu event sourcing yang kompleks.

4. **Single bahasa** — TypeScript dari frontend sampai backend sampai database query. 1 codebase, 1 deployment, 1 mental model.

5. **Edge-ready** — middleware jalan di Vercel Edge Runtime (super cepat), pages auto-cached oleh Vercel CDN.

6. **Cost: $0** — semua tier gratis (Vercel Hobby + Neon Free + GitHub) cukup untuk traffic UMKM kecil-menengah.

---

*AIS Sijah — Capstone Project | Sistem Informasi Penjahit untuk UMKM*
*Last updated: 2026-04-27*
