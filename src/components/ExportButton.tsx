"use client";

import { Download } from "lucide-react";

export function ExportButton({
  rows,
  filename,
}: {
  rows: Record<string, string | number>[];
  filename: string;
}) {
  function exportCsv() {
    if (rows.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }
    const headers = Object.keys(rows[0]);
    const escape = (v: unknown) => {
      const s = String(v ?? "");
      if (s.includes(",") || s.includes('"') || s.includes("\n")) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };
    const csv = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
    ].join("\n");

    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button type="button" onClick={exportCsv} className="btn-secondary !py-2.5 !px-4">
      <Download className="h-4 w-4" /> Ekspor
    </button>
  );
}
