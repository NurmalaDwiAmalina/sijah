# 🧵 AIS Sijah — Progress Report

> Sistem Informasi Penjahit untuk UMKM
> **Status:** ✅ MVP Selesai + Revisi QA — production deploy
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
| **TypeScript** | 5.6 | Type safety end-to-end |
| **Tailwind CSS** | 3.4 | Utility-first styling + design tokens |
| **lucide-react** | 0.456 | Icon library (tree-shakeable) |
| **clsx** | 2.1 | Conditional className helper |

### Backend & Database
| Tools | Versi | Fungsi |
|---|---|---|
| **Prisma ORM** | 6.19 | Type-safe database client + migration |
| **PostgreSQL** | via Neon | Cloud database serverless |
| **Neon** | — | Postgres provider (gratis 0.5 GB, region us-east-1) |
| **bcryptjs** | 3.0 | Hashing password user |
| **Server Actions** | (Next.js 14) | Mutasi data tanpa API route terpisah |

### Deploy & Infra
| Layanan | Fungsi |
|---|---|
| **Vercel** | Hosting + CI/CD (auto-deploy tiap push ke `main`) |
| **GitHub** | Source control + integrasi Vercel |
| **Neon Postgres** | Database production |
| **Cookie session** | Auth tanpa NextAuth — disimpan di tabel `Session` |

---

## 🎨 Color Palette (Brand Identity)

```
Primary Greens:
  #019537  Dark green   — tombol, link aktif, badge sukses
  #17D55C  Vibrant      — accent, donut chart "Selesai"
  #0FD859  Bright       — gradient
  #DEFFA7  Light        — sidebar aktif, profile bg
  #F6FEE9  Pale         — header tabel

Status / Accent:
  #FF4B4B / #FFD1C9   Merah — error, "Dibatalkan", "Belum Bayar", "Perempuan"
  #008BFF / #DAEEFF   Biru — "Laki-laki", "Potong Kain", "Transfer"
  #FFB62E / #FFEDB1   Oranye — "Dijahit", "DP", "Tunai"

Neutrals:
  #000000 / #504F4F / #868686 / #CECECE / #DFDFDF / #EEEEEE
```

---

## ✨ Highlight Arsitektur

### 1. Soft-Coding via `src/lib/config.ts`
Semua konstanta domain (status, gender, metode bayar), brand text, validation rules,
upload limits, color palette, dan navigasi terpusat di **satu file**. Ubah 1 baris →
otomatis menjalar ke seluruh app. Audit grep memastikan **0 literal hardcode** di
seluruh `src/`.

### 2. Data Snapshotting
Saat pesanan dibuat, data pelanggan (`nama`, `noWa`) + **detail ukuran lengkap**
disalin ke `Order.snapshot*` dan `OrderItem.snapshotData`. Pelanggan ubah ukuran
nanti → pesanan lama tetap mencatat ukuran saat itu.

### 3. Auto-Lunas Logic
Setiap mutasi pembayaran (create/update/delete) memicu `recalcOrderStatusBayar()`
yang hitung ulang total bayar dan update `Order.statusBayar` ke
`Belum Bayar` / `DP` / `Lunas` otomatis.

### 4. Type-Safety End-to-End
Schema Prisma → Server Actions → React props → form state, semuanya typed.
Hampir mustahil bug runtime karena type mismatch.

### 5. Server Actions (No REST API)
16 fungsi server action di `src/lib/actions/`. Form submit langsung memanggil
function di server tanpa fetch boilerplate, no JSON parsing.

---

## ✅ Fitur Lengkap

### 🔐 Auth & User
- [x] Login email + password (bcrypt)
- [x] Cookie session 30 hari (HttpOnly, secure)
- [x] Logout
- [x] Update Password (verify password lama)
- [x] **Forgot Password flow** (`/forgot-password`)
- [x] **Reset Password via token** (`/reset-password?token=...`) — token expiry 1 jam
- [x] Modal **"Cek Email Anda"** + **"Password Diperbarui"**
- [x] Middleware proteksi route (redirect ke `/login` jika belum auth)
- [x] Update profile (username, email, **upload foto avatar** base64)

### 📊 Dashboard
- [x] **3 Stat Cards** real-time: Total Revenue, Belum Terbayar, Total Pesanan
- [x] **Donut Chart SVG custom** — distribusi 7 status pesanan
- [x] **Tabel Ringkasan Pesanan** — 7 terbaru
- [x] **Filter** by status pesanan
- [x] **Search** by ID/judul/pelanggan
- [x] **Ekspor CSV** (mengikuti filter aktif)
- [x] Greeting menggunakan username login (tidak hardcode)

### 👥 Pelanggan
- [x] **CRUD lengkap** dengan auto-generate kode (P0001, P0002, ...)
- [x] List view + **Search** by nama/ID/WA/alamat
- [x] **Filter** by gender (Laki-laki / Perempuan)
- [x] **Ekspor CSV**
- [x] **Action Menu (...)** — Detail / Edit / Hapus (via React Portal, tidak terpotong)
- [x] **Multi-ukuran** per pelanggan
- [x] **Modal Tambah/Edit/Lihat Ukuran** dengan **3 kategori**:
  - **Atasan**: Lingkar leher/dada/pinggang, lebar bahu, panjang lengan/baju
  - **Bawahan**: Lingkar pinggang/panggul/paha, panjang celana
  - **Standar**: XS / S / M / L / XL / XXL / Custom
- [x] Catatan opsional per ukuran
- [x] **Confirm Dialog** sebelum hapus (sesuai mockup design)
- [x] **Toast notification** saat berhasil hapus

### 🛒 Pesanan
- [x] **CRUD lengkap** dengan auto-generate kode (S0001, S0002, ...)
- [x] List view + Search + **Filter ganda** (status pesanan + status bayar)
- [x] Kolom **Status Pesanan** & **Status Bayar** dengan badge warna
- [x] **Status Dropdown editable** — klik badge → pilih status baru → langsung tersimpan
- [x] **Halaman Detail** `/pesanan/[code]`:
  - Info lengkap (pelanggan, deadline, item, biaya tambahan)
  - **Riwayat pembayaran** dengan link ke detail bayar
  - Status pesanan editable inline
  - Tombol Edit & Hapus
- [x] **Halaman Edit** `/pesanan/[code]/edit`:
  - Edit judul, status pesanan, status bayar, deadline, catatan, foto referensi
- [x] Form Create:
  - Pilih pelanggan dari dropdown
  - Centang ukuran + jumlah + harga satuan (auto subtotal)
  - **Biaya tambahan** dinamis (label + nominal)
  - **Status pesanan & status pembayaran** field
  - Upload foto referensi (base64, max 1MB)
  - Auto-calculate total
- [x] **Data Snapshotting** otomatis saat create
- [x] **Ekspor CSV**
- [x] **Action Menu** Detail/Edit/Hapus

### 💰 Pembayaran
- [x] **Auto-generate kode** PAY-00001 (5 digit)
- [x] List view + Search + **Filter** by metode (Tunai/Transfer)
- [x] Kolom: ID Pembayaran, ID Pesanan, Pelanggan, Jumlah, Metode (badge), Created at, Updated at
- [x] **Halaman Detail** `/pembayaran/[code]`:
  - Info pembayaran lengkap
  - Ringkasan pesanan (total, dibayar, sisa)
  - Status bayar pesanan
  - Link ke pesanan
- [x] **Halaman Edit** `/pembayaran/[code]/edit`:
  - Update jumlah, metode, catatan
  - Auto-recalc status bayar pesanan
- [x] **Action Menu** (Detail/Edit/Hapus)
- [x] **Auto-Lunas Logic** trigger saat create/update/delete
- [x] **1 pesanan banyak pembayaran** (cicilan)
- [x] Pesanan yang sudah Lunas otomatis tersembunyi dari form Add New
- [x] Pre-fill order code via URL param (`?orderCode=S0015`) dari halaman pesanan detail
- [x] Field catatan opsional
- [x] **Ekspor CSV**

### 🎨 UI/UX
- [x] Sidebar navigation (Main: Dashboard/Pelanggan/Pesanan/Pembayaran + Support: Profile)
- [x] Topbar dengan avatar (clickable → profile)
- [x] Responsive layout
- [x] Empty states informatif
- [x] Loading states (button "Menyimpan...")
- [x] **Toast Notification system** (`useToast()` hook) — sukses/error/delete variants
- [x] **Confirm Dialog** dengan custom illustration (sesuai mockup)
- [x] **Popover dengan React Portal + auto-flip** (dropdown tidak terpotong di row terakhir)
- [x] Status badges dengan palette resmi
- [x] Error display inline
- [x] Avatar foto upload preview

---

## 🗄️ Database Schema (8 Tabel)

```
User ─┬── Session
      └── PasswordReset (token + expiry)

Customer ─┬── Measurement (kategori, semua field ukuran)
          └── Order ──┬── OrderItem (snapshot data)
                      ├── AdditionalCost (biaya tambahan)
                      └── Payment (multi cicilan)
```

| Tabel | Highlight |
|---|---|
| **User** | email, username, password (bcrypt), avatar (base64) |
| **Session** | userId, expiresAt — cookie-based |
| **PasswordReset** | token unique, expiresAt 1 jam, used flag |
| **Customer** | code (P0001), nama, noWa, alamat, gender |
| **Measurement** | judul, **kategori** (Atasan/Bawahan/Standar), 9 field ukuran + ukuranStandar + catatan |
| **Order** | code (S0001), status, statusBayar, totalHarga, **snapshotNama/noWa** |
| **OrderItem** | judulUkuran, jumlah, hargaSatuan, **snapshotData JSON** |
| **AdditionalCost** | label, amount per pesanan |
| **Payment** | **code (PAY-00001)**, jumlah, metode, catatan, updatedAt |

---

## 🏗️ Arsitektur

```
Browser (React Client Component)
    │ Server Action (RPC, type-safe)
    ▼
Vercel Serverless Function
    • Middleware (auth check, Edge Runtime)
    • Server Component (fetch data via Prisma)
    • Server Action (mutate via Prisma)
    │ Prisma Client (typed query)
    ▼
Neon PostgreSQL (cloud, serverless, auto-scale to zero)
```

**Konfigurasi terpusat:** `src/lib/config.ts` (single source of truth untuk
brand, enum domain, validation rules, color palette, navigation)

---

## 📁 Struktur Folder

```
sijah/
├── prisma/
│   ├── schema.prisma          # 9 model (User/Session/PasswordReset/Customer/...)
│   └── seed.ts                # admin + 10 pelanggan + 10 pesanan
│
├── src/
│   ├── app/                   # 14 routes
│   │   ├── login/, logout
│   │   ├── forgot-password/, reset-password/, update-password/
│   │   ├── dashboard/
│   │   ├── pelanggan/  →  /, new, [id]
│   │   ├── pesanan/    →  /, new, [code], [code]/edit
│   │   ├── pembayaran/ →  /, new, [code], [code]/edit
│   │   ├── profile/
│   │   ├── layout.tsx, page.tsx, globals.css
│   │
│   ├── components/            # 20 reusable components
│   │   ├── AuthShell, DashboardShell, Sidebar, Topbar, Logo
│   │   ├── Badge, DonutChart
│   │   ├── PelangganForm, PelangganRowActions
│   │   ├── PesananForm, PesananEditForm, PesananDetailActions, PesananRowActions
│   │   ├── PembayaranForm, PembayaranEditForm, PembayaranRowActions
│   │   ├── ProfileForm, AvatarUpload
│   │   ├── UkuranModal              ← modal kategori atasan/bawahan/standar
│   │   ├── StatusDropdown           ← editable status badge
│   │   ├── RowActions               ← ... menu pakai Portal
│   │   ├── Popover                  ← portal + auto-flip
│   │   ├── ConfirmDialog            ← modal konfirmasi delete
│   │   ├── Toast + ToastProvider    ← notif system
│   │   ├── SearchFilterBar          ← search + filter URL-based
│   │   ├── ExportButton             ← download CSV
│   │   ├── CekEmailModal, PasswordSuccessModal, ResetPasswordForm
│   │
│   ├── lib/
│   │   ├── config.ts               ⭐ SINGLE SOURCE OF TRUTH (brand/enum/validation/palette/nav)
│   │   ├── db.ts                   # Prisma client singleton
│   │   ├── auth.ts                 # session helpers
│   │   ├── code.ts                 # generate P/S/PAY auto
│   │   ├── format.ts               # formatRupiah, formatDate
│   │   ├── cn.ts                   # className helper
│   │   └── actions/                # 16 Server Actions
│   │       ├── auth.ts             (login/logout/update/forgot/reset/profile)
│   │       ├── pelanggan.ts        (CRUD + ukuran CRUD)
│   │       ├── pesanan.ts          (create/update/updateStatus/delete)
│   │       └── pembayaran.ts       (CRUD + auto-lunas)
│   │
│   └── middleware.ts               # auth protection (Edge runtime)
│
├── tailwind.config.ts              # design tokens dari config color
├── next.config.js
├── package.json
├── .env.example                    # template env vars
├── readme.md                       # spec asli
└── PROGRESS.md                     # dokumen ini
```

---

## 🚀 Cara Menjalankan Lokal

```bash
# 1. Clone & install
git clone https://github.com/NurmalaDwiAmalina/sijah.git
cd sijah
npm install

# 2. Setup database
cp .env.example .env
# Edit .env, isi DATABASE_URL (Postgres) dan SESSION_SECRET

# 3. Schema + seed data awal
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

### Production (live)
- **Hosting:** Vercel (auto-deploy dari `main`)
- **Database:** Neon Postgres (region `us-east-1`)
- **Domain:** `sijah.vercel.app`
- **Environment Variables di Vercel:**
  - `DATABASE_URL` — connection string Neon (pooled)
  - `SESSION_SECRET` — random string 32+ char

### CI/CD Flow
```
git push origin main
    ↓ Vercel webhook trigger
npm install → prisma generate → next build
    ↓
Deploy ke edge worldwide (~1-2 menit)
    ↓
Live di sijah.vercel.app
```

---

## 📈 Statistik

```
Total file source:    ~70 file TypeScript/TSX
Total baris kode:     ~5,500 LOC
Halaman (routes):     19 routes
Server Actions:       16 fungsi
Database tables:      9 model
Build size:           ~100 KB First Load JS (gzipped)
Build time (Vercel):  ~2 menit
Hardcoded literals:   0 (audited via grep)
```

---

## 📋 Daftar Revisi yang Sudah Diselesaikan

### Round 1 — MVP awal
- 13 halaman UI sesuai mockup
- CRUD penuh untuk pelanggan/pesanan/pembayaran
- Auth login + dashboard real-time

### Round 2 — Functional buttons
- Tombol Ekspor CSV functional
- Search + Filter di list pages
- Status dropdown editable
- Action menu (...)
- Upload foto avatar & referensi

### Round 3 — Cloud deployment
- Migrate SQLite → Neon Postgres
- Fix server action prop pattern
- Suspense untuk useSearchParams

### Round 4 — Revisi besar
- ✅ Filter dashboard + donut chart 7 status
- ✅ Modal ukuran dengan kategori (Atasan/Bawahan/Standar)
- ✅ Edit + view detail ukuran
- ✅ Pop-up tidak terpotong (Portal + auto-flip)
- ✅ Halaman detail & edit pesanan
- ✅ 1 pesanan multi-pembayaran (riwayat)
- ✅ Status pesanan & bayar di form create
- ✅ ID pembayaran PAY-XXXXX
- ✅ Action di list pembayaran
- ✅ Kolom metode + created/updated at
- ✅ Forgot password flow + reset page + success modals
- ✅ Toast & ConfirmDialog (gantikan browser alert/confirm)
- ✅ Ganti Password tidak salah redirect

### Round 5 — Soft-coding refactor
- ✅ Buat `src/lib/config.ts` sebagai single source of truth
- ✅ 26 file di-refactor pakai konfigurasi terpusat
- ✅ 0 literal hardcode di seluruh `src/`

---

## 💡 Highlight Teknis untuk Presentasi

1. **Type-safety end-to-end** — schema Prisma → server action → React component, no runtime type errors.

2. **No REST API** — pakai Server Actions Next.js 14. Form submit langsung panggil function server.

3. **Soft-coding total** — semua brand/enum/validation/color terpusat di 1 file. Ganti brand/tambah status/tambah field cukup edit `config.ts`.

4. **Data Snapshotting** — solusi elegan untuk history immutability tanpa event sourcing kompleks.

5. **Auto-Lunas trigger** — bisnis logic di server action, idempotent, otomatis sync saat ada mutasi pembayaran.

6. **Edge-ready middleware** — auth check di Vercel Edge, super cepat, tidak hit serverless function.

7. **React Portal untuk dropdown** — solve problem dropdown ke-clip oleh tabel, dengan auto-flip up jika di bottom viewport.

8. **Toast + ConfirmDialog system** — UX modern, gantikan browser native alert yang jelek.

9. **Cost: $0** — Vercel Hobby + Neon Free + GitHub. Cukup untuk traffic UMKM kecil-menengah.

10. **CI/CD otomatis** — git push → Vercel deploy worldwide dalam 2 menit.

---

## 🎯 Roadmap Lanjutan (Post-MVP)

### High-priority
- [ ] Print invoice / nota PDF (pakai react-pdf atau puppeteer)
- [ ] Notifikasi WhatsApp (link `wa.me/`) untuk reminder pickup
- [ ] Audit log (tabel ActivityLog: siapa ngapain kapan)
- [ ] Email service (SendGrid/Resend) untuk forgot password real

### Medium
- [ ] Multi-user dengan role (admin / staff)
- [ ] Kalender deadline pesanan (FullCalendar)
- [ ] Vercel Blob untuk foto (gantikan base64 di DB)
- [ ] Export laporan bulanan (PDF/Excel)

### Nice-to-have
- [ ] Dark mode
- [ ] Mobile app (PWA)
- [ ] Backup database otomatis
- [ ] Multi-tenant (1 instance untuk banyak penjahit)

---

*AIS Sijah — Capstone Project | Sistem Informasi Penjahit untuk UMKM*
*Last updated: 2026-04-27*
