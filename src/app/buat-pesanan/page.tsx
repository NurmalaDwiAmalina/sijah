import Link from "next/link";
import { CustomerPesananForm } from "@/components/CustomerPesananForm";

export default function BuatPesananPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-ink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-start gap-2">
            <div className="text-3xl font-black text-brand-600">SJ</div>
            <div>
              <div className="font-black text-brand-600 text-base leading-tight">sijah Asy-Syifa</div>
              <div className="text-xs text-ink-500">Sistem Informasi Penjahit Syifa</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-ink-100">
          <h1 className="text-3xl font-bold text-ink-900 mb-3">Buat Pesanan Sekarang</h1>
          <p className="text-ink-700 mb-8">
            Lengkapi form pesanan berikut. Tim kami akan segera memproses pesananmu.
          </p>

          <CustomerPesananForm />
        </div>
      </div>
    </div>
  );
}
