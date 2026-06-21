import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// Endpoint ini publik (tanpa login) karena dipakai juga oleh pelanggan saat
// membuat pesanan dari web katalog untuk mengunggah foto referensi. Tetap
// dibatasi: hanya gambar (JPG/PNG/WebP) maksimal 5MB.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Format harus JPG, PNG, atau WebP" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Maksimal 5MB" },
        { status: 400 }
      );
    }

    const filename = `sijah-foto-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const blob = await put(filename, file, {
      access: "public",
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
