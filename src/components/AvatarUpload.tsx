"use client";

import { useRef, useState } from "react";
import { User } from "lucide-react";

const MAX_SIZE = 800 * 1024; // 800KB

export function AvatarUpload({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File) {
    setError(null);
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Hanya format JPG, PNG, atau WebP");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Ukuran maksimal 800KB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex items-center gap-6">
      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 ring-2 ring-white shadow-sm overflow-hidden grid place-items-center">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="avatar" className="h-full w-full object-cover" />
        ) : (
          <User className="h-10 w-10 text-white/60" />
        )}
      </div>
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="btn-secondary !py-2 !px-4 text-xs"
          >
            Upload Foto Baru
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-xs text-[#FF4B4B] hover:underline"
            >
              Hapus
            </button>
          )}
        </div>
        <p className="mt-3 text-xs text-ink-500">
          At least 512 × 512 px recommended.
          <br />
          JPG / PNG / WebP, max 800KB.
        </p>
        {error && <p className="mt-1 text-xs text-[#FF4B4B]">{error}</p>}
      </div>
    </div>
  );
}
