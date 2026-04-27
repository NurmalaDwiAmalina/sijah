import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIS Sijah — Sistem Informasi Penjahit",
  description: "Platform manajemen operasional digital untuk UMKM penjahit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="font-sans">{children}</body>
    </html>
  );
}
