// =============================================================
//  KONFIGURASI APLIKASI — SOFT-CODE
//  Ubah nilai di sini untuk mengganti teks/enum/limit di seluruh app.
//  Jangan hard-code string yang sama di file lain — import dari sini.
// =============================================================

// -------------------------------------------------------------
// BRAND
// -------------------------------------------------------------
export const BRAND = {
  shortName: "sijah Asy-Syifa",
  fullName: "sijah Asy-Syifa",
  tagline: "Sistem Informasi Penjahit Syifa",
  description: "Platform manajemen operasional digital untuk UMKM penjahit",
  logoText: "SJ",
  // Greeting muncul di halaman auth (sebelum login → tidak bisa pakai username DB)
  authHeading: "Hallo,\nMinjah!",
  authSubheading: "Ayo masuk dan kelola semua pelanggan dan pesanan jahitanmu!",
  forgotHeading: "Lupa\nPassword",
  forgotSubheading: "Reset password lama anda, dan buat password baru yang kuat",
  resetHeading: "Lupa\nPassword",
  resetSubheading: "Reset password lama anda, dan buat password baru yang kuat",
  updateHeading: "Update\nPassword",
  updateSubheading:
    "Sebelum update password tolong masukkan password lamamu diform samping!",
  // Greeting di dashboard pakai username dari DB; ini fallback kalau session aneh
  defaultGreetingName: "Admin",
} as const;

// -------------------------------------------------------------
// ENUMS DOMAIN
// -------------------------------------------------------------
export const ORDER_STATUS = [
  "Antrean",
  "Potong Kain",
  "Dijahit",
  "Fitting",
  "Selesai",
  "Diambil",
  "Dibatalkan",
] as const;
export type OrderStatus = (typeof ORDER_STATUS)[number];

export const PAYMENT_STATUS = ["Belum Bayar", "DP", "Lunas"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

export const PAYMENT_METHOD = ["Tunai", "Transfer"] as const;
export type PaymentMethod = (typeof PAYMENT_METHOD)[number];

export const GENDER = ["Laki-laki", "Perempuan"] as const;
export type Gender = (typeof GENDER)[number];

export const MEASUREMENT_KATEGORI = ["Atasan", "Bawahan", "Standar"] as const;
export type MeasurementKategori = (typeof MEASUREMENT_KATEGORI)[number];
export const KATEGORI = {
  ATASAN: MEASUREMENT_KATEGORI[0],
  BAWAHAN: MEASUREMENT_KATEGORI[1],
  STANDAR: MEASUREMENT_KATEGORI[2],
} as const;

export const STANDAR_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Custom"] as const;

// -------------------------------------------------------------
// FIELD UKURAN per kategori (key harus match Prisma column)
// -------------------------------------------------------------
export const ATASAN_FIELDS: ReadonlyArray<readonly [string, string]> = [
  ["lingkarLeher", "Lingkar Leher"],
  ["lebarBahu", "Lebar Bahu"],
  ["lingkarDada", "Lingkar Dada"],
  ["lingkarPinggang", "Lingkar Pinggang"],
  ["panjangLengan", "Panjang Lengan"],
  ["panjangBaju", "Panjang Baju"],
] as const;

export const BAWAHAN_FIELDS: ReadonlyArray<readonly [string, string]> = [
  ["lingkarPinggang", "Lingkar Pinggang"],
  ["lingkarPinggul", "Lingkar Panggul"],
  ["lingkarPaha", "Lingkar Paha"],
  ["panjangCelana", "Panjang Celana"],
] as const;

// -------------------------------------------------------------
// PALETTE — warna & badge style per status (single source of truth)
// -------------------------------------------------------------
export const STATUS_COLORS: Record<OrderStatus, string> = {
  Antrean: "#868686",
  "Potong Kain": "#008BFF",
  Dijahit: "#FFB62E",
  Fitting: "#0FD859",
  Selesai: "#17D55C",
  Diambil: "#019537",
  Dibatalkan: "#FF4B4B",
};

export const ORDER_STATUS_BADGE: Record<OrderStatus, string> = {
  Antrean: "bg-[#DFDFDF] text-[#504F4F]",
  "Potong Kain": "bg-[#DAEEFF] text-[#008BFF]",
  Dijahit: "bg-[#FFEDB1] text-[#FFB62E]",
  Fitting: "bg-[#DEFFA7] text-[#019537]",
  Selesai: "bg-[#DEFFA7] text-[#019537]",
  Diambil: "bg-[#DEFFA7] text-[#019537]",
  Dibatalkan: "bg-[#FFD1C9] text-[#FF4B4B]",
};

export const PAYMENT_STATUS_BADGE: Record<PaymentStatus, string> = {
  "Belum Bayar": "bg-[#FFD1C9] text-[#FF4B4B]",
  DP: "bg-[#FFEDB1] text-[#FFB62E]",
  Lunas: "bg-[#DEFFA7] text-[#019537]",
};

export const PAYMENT_METHOD_BADGE: Record<PaymentMethod, string> = {
  Tunai: "bg-[#FFEDB1] text-[#FFB62E]",
  Transfer: "bg-[#DAEEFF] text-[#008BFF]",
};

export const GENDER_BADGE: Record<Gender, string> = {
  "Laki-laki": "bg-[#DAEEFF] text-[#008BFF]",
  Perempuan: "bg-[#FFD1C9] text-[#FF4B4B]",
};

// -------------------------------------------------------------
// VALIDATION & LIMITS
// -------------------------------------------------------------
export const VALIDATION = {
  password: {
    minLength: 8,
    needsNumber: /\d/,
    needsSpecial: /[!@#$%^&*()_\-+=]/,
    needsUppercase: /[A-Z]/,
  },
  upload: {
    avatarMaxBytes: 800 * 1024, // 800 KB
    fotoReferensiMaxBytes: 1024 * 1024, // 1 MB
    allowedImageTypes: ["image/jpeg", "image/png", "image/webp"] as const,
    get allowedAcceptString() {
      return this.allowedImageTypes.join(",");
    },
    allowedExtensionsLabel: "JPG / PNG / WebP",
  },
  session: {
    durationMs: 1000 * 60 * 60 * 24 * 30, // 30 hari
    cookieName: "sijah_session",
  },
  passwordReset: {
    durationMs: 1000 * 60 * 60, // 1 jam
  },
} as const;

// Helper untuk dapat checklist password live di UI
export function passwordChecks(pwd: string) {
  const v = VALIDATION.password;
  return [
    { label: `Minimal ${v.minLength} karakter`, ok: pwd.length >= v.minLength },
    { label: "Minimal 1 nomor", ok: v.needsNumber.test(pwd) },
    { label: "Minimal 1 spesial karakter", ok: v.needsSpecial.test(pwd) },
    { label: "Minimal 1 huruf Kapital", ok: v.needsUppercase.test(pwd) },
  ];
}

// -------------------------------------------------------------
// CODE PREFIX
// -------------------------------------------------------------
export const CODE_PREFIX = {
  customer: { prefix: "P", padding: 4 },
  order: { prefix: "S", padding: 4 },
  payment: { prefix: "PAY", padding: 5 },
} as const;

// -------------------------------------------------------------
// NAVIGATION
// -------------------------------------------------------------
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  ShoppingBasket,
  UserCircle2,
  Users,
  Wallet,
} from "lucide-react";

type NavItem = { href: string; label: string; icon: LucideIcon };

export const MAIN_NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pelanggan", label: "Pelanggan", icon: Users },
  { href: "/pesanan", label: "Pesanan", icon: ShoppingBasket },
  { href: "/pembayaran", label: "Pembayaran", icon: Wallet },
];

export const SUPPORT_NAV: NavItem[] = [
  { href: "/profile", label: "Profile", icon: UserCircle2 },
];
