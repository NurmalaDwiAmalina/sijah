# 🎨 Visual Diagrams — AIS Sijah

**Panduan Export & Cetak Diagram**

---

## 📌 Cara Export Diagram Mermaid

### **Opsi 1: Gunakan Mermaid.live (Recommended)**
1. Buka: https://mermaid.live
2. Copy diagram code dari PROGRESS.md
3. Paste ke editor
4. Klik icon "Download" → Pilih format (PNG/SVG/PDF)
5. Save & print!

### **Opsi 2: Gunakan CLI Tool**
```bash
npm install -g @mermaid-js/mermaid-cli
mmdc -i diagram.mmd -o diagram.png
```

---

## 📊 Database Tables Overview

### **User Table**
```
┌──────────────────────────────────────────────────────────────┐
│ USER (Tabel Admin)                                           │
├──────────────────────────────────────────────────────────────┤
│ id (PK)      │ email (UK)    │ username │ password │ avatar  │
├──────────────┼───────────────┼──────────┼──────────┼─────────┤
│ usr_001      │ admin@sijah   │ minjah   │ [hash]   │ [url]   │
│ usr_002      │ staff@sijah   │ staff1   │ [hash]   │ [url]   │
└──────────────────────────────────────────────────────────────┘
```

### **Customer Table**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ CUSTOMER (Tabel Pelanggan)                                              │
├──────────────┬────────────────────┬──────────────┬────────────────────┤
│ id (PK)      │ code (UK)          │ nama         │ noWa               │
├──────────────┼────────────────────┼──────────────┼────────────────────┤
│ cust_001     │ CUST-001           │ Siti         │ 628123456789       │
│ cust_002     │ CUST-002           │ Budi         │ 628987654321       │
│ cust_003     │ CUST-003           │ Aminah       │ 628555666777       │
├──────────────┴────────────────────┴──────────────┴────────────────────┤
│ alamat           │ gender     │ createdAt      │ updatedAt           │
├──────────────────┼────────────┼────────────────┼─────────────────────┤
│ Jl. Merdeka 123  │ Perempuan  │ 2026-01-01     │ 2026-05-20          │
│ Jl. Ahmad Yani   │ Laki-laki  │ 2026-02-15     │ 2026-05-18          │
│ Jl. Sudirman 45  │ Perempuan  │ 2026-03-20     │ 2026-05-19          │
└──────────────────┴────────────┴────────────────┴─────────────────────┘
```

### **Measurement Table**
```
┌──────────────────────────────────────────────────────────────┐
│ MEASUREMENT (Tabel Ukuran Badan)                             │
├──────────────┬──────────────┬───────────┬────────────────────┤
│ id (PK)      │ customerId   │ judul     │ kategori           │
├──────────────┼──────────────┼───────────┼────────────────────┤
│ meas_001     │ cust_001     │ Formal    │ Atasan             │
│ meas_002     │ cust_001     │ Santai    │ Atasan             │
│ meas_003     │ cust_002     │ Standard  │ Standar (M)        │
├──────────────┴──────────────┴───────────┴────────────────────┤
│ lingkarLeher │ lebarBahu │ lingkarDada │ lingkarPinggang     │
├──────────────┼──────────┼─────────────┼────────────────────┤
│ 38cm         │ 42cm     │ 88cm        │ 70cm               │
│ 39cm         │ 43cm     │ 90cm        │ 72cm               │
│ M (std)      │ M (std)  │ M (std)     │ M (std)            │
└──────────────┴──────────┴─────────────┴────────────────────┘
```

### **Order Table**
```
┌──────────────────────────────────────────────────────────────────┐
│ ORDER (Tabel Pesanan)                                            │
├──────────┬──────────┬────────────┬──────────────┬────────────────┤
│ id       │ code     │ customerId │ judul        │ jenisPakaian   │
├──────────┼──────────┼────────────┼──────────────┼────────────────┤
│ ord_001  │ ORD-001  │ cust_001   │ Kebaya Emas  │ Kebaya         │
│ ord_002  │ ORD-002  │ cust_002   │ Jas Pesta    │ Jas            │
│ ord_003  │ ORD-003  │ cust_001   │ Sarung Emas  │ Sarung         │
├──────────┴──────────┴────────────┴──────────────┴────────────────┤
│ tglMasuk   │ tglEstimasi │ status    │ statusBayar │ totalHarga  │
├────────────┼─────────────┼───────────┼─────────────┼─────────────┤
│ 2026-05-20 │ 2026-06-10  │ Dijahit   │ DP          │ 1,050,000   │
│ 2026-05-19 │ 2026-06-05  │ Antrean   │ Belum Bayar │ 800,000     │
│ 2026-05-20 │ 2026-06-15  │ Fitting   │ Lunas       │ 500,000     │
└────────────┴─────────────┴───────────┴─────────────┴─────────────┘
```

### **Payment Table**
```
┌─────────────────────────────────────────────────────────────┐
│ PAYMENT (Tabel Pembayaran)                                  │
├──────────┬──────────┬────────────┬────────────┬──────────────┤
│ id       │ code     │ orderId    │ jumlah     │ metode       │
├──────────┼──────────┼────────────┼────────────┼──────────────┤
│ pay_001  │ PMT-001  │ ord_001    │ 500,000    │ Tunai        │
│ pay_002  │ PMT-002  │ ord_001    │ 550,000    │ Transfer BCA │
│ pay_003  │ PMT-003  │ ord_002    │ 800,000    │ Tunai        │
│ pay_004  │ PMT-004  │ ord_003    │ 500,000    │ Transfer BCA │
├──────────┴──────────┴────────────┴────────────┴──────────────┤
│ catatan                │ createdAt      │ updatedAt          │
├────────────────────────┼────────────────┼────────────────────┤
│ DP (Down Payment)      │ 2026-05-21     │ 2026-05-21         │
│ Lunasan                │ 2026-06-05     │ 2026-06-05         │
│ Pembayaran Penuh       │ 2026-05-20     │ 2026-05-20         │
│ Atas nama Budi         │ 2026-05-22     │ 2026-05-22         │
└────────────────────────┴────────────────┴────────────────────┘
```

---

## 🗂️ Entity Relationship Diagram (Text-based)

```
                              ┌─────────────────┐
                              │     USER        │
                              │─────────────────│
                              │ id (PK)         │
                              │ email (UK)      │
                              │ username        │
                              │ password        │
                              │ avatar          │
                              │ createdAt       │
                              │ updatedAt       │
                              └────────┬────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    │ 1:many           │ 1:many           │
            ┌───────▼──────┐    ┌──────▼───────┐         │
            │   SESSION    │    │ PASSWORD     │         │
            │──────────────│    │ RESET        │         │
            │ id (PK)      │    │──────────────│         │
            │ userId (FK)  │    │ id (PK)      │         │
            │ expiresAt    │    │ token (UK)   │         │
            └──────────────┘    │ userId (FK)  │         │
                                │ expiresAt    │         │
                                │ used         │         │
                                └──────────────┘         │
                                                          │
                                                    ┌─────▼────────┐
                                                    │  CUSTOMER    │
                                                    │──────────────│
                                                    │ id (PK)      │
                                                    │ code (UK)    │
                                                    │ nama         │
                                                    │ noWa         │
                                                    │ alamat       │
                                                    │ gender       │
                                                    │ createdAt    │
                                                    │ updatedAt    │
                                                    └────┬────┬───┘
                                                         │    │
                                   ┌─────────────────────┘    │
                                   │ 1:many                   │ 1:many
                          ┌────────▼──────────┐    ┌─────────▼────────┐
                          │  MEASUREMENT     │    │     ORDER        │
                          │──────────────────│    │──────────────────│
                          │ id (PK)          │    │ id (PK)          │
                          │ customerId (FK)  │    │ code (UK)        │
                          │ judul            │    │ customerId (FK)  │
                          │ kategori         │    │ judul            │
                          │ measurements...  │    │ tglMasuk         │
                          │ catatan          │    │ tglEstimasi      │
                          │ createdAt        │    │ jenisPakaian     │
                          │ updatedAt        │    │ fotoReferensi    │
                          └────────┬─────────┘    │ status           │
                                   │              │ catatan          │
                                   │ 1:many       │ totalHarga       │
                                   │              │ statusBayar      │
                    ┌──────────────┘              │ snapshotNama     │
                    │                            │ snapshotNoWa     │
                    │                            │ createdAt        │
                    │                            │ updatedAt        │
            ┌───────▼─────────────┐    ┌────────▼──────────────┐
            │   ORDER_ITEM        │    │  ADDITIONAL_COST     │
            │─────────────────────│    │──────────────────────│
            │ id (PK)             │    │ id (PK)              │
            │ orderId (FK)        │    │ orderId (FK)         │
            │ measurementId (FK)  │    │ label                │
            │ judulUkuran         │    │ amount               │
            │ catatan             │    └──────────────────────┘
            │ jumlah              │
            │ hargaSatuan         │
            │ subTotal            │
            │ snapshotData        │
            └─────────────────────┘
                    ▲
                    │ 1:many
                    │
            ┌───────┴──────────┐
            │    PAYMENT       │
            │──────────────────│
            │ id (PK)          │
            │ code (UK)        │
            │ orderId (FK)     │
            │ jumlah           │
            │ metode           │
            │ catatan          │
            │ createdAt        │
            │ updatedAt        │
            └──────────────────┘
```

---

## 🔄 Process Flow Diagrams

### **Order Creation Flow (Step-by-Step)**

```
┌─────────────────────────────────────────────────────────────────┐
│                    ORDER CREATION PROCESS                       │
└─────────────────────────────────────────────────────────────────┘

    STEP 1: SELECT CUSTOMER
    ┌──────────────────────────────────┐
    │ Admin click "Buat Pesanan"       │
    │ ↓                                │
    │ Search atau pilih dari dropdown  │
    │ ↓                                │
    │ Sistem fetch customer data &     │
    │ measurement history              │
    └──────────────────────────────────┘

    STEP 2: FILL ORDER DETAILS
    ┌──────────────────────────────────┐
    │ • Judul pesanan                  │
    │ • Tanggal masuk (today)          │
    │ • Tanggal estimasi selesai       │
    │ • Jenis pakaian                  │
    │ • Catatan khusus                 │
    └──────────────────────────────────┘

    STEP 3: SELECT ITEMS & PRICING
    ┌──────────────────────────────────┐
    │ For each measurement:             │
    │ ├─ Pilih dari dropdown            │
    │ ├─ Input: Quantity                │
    │ ├─ Input: Unit Price              │
    │ └─ Auto calc: SubTotal (qty×harga)│
    │                                  │
    │ Result: ✅ SUBTOTAL = Rp...      │
    └──────────────────────────────────┘

    STEP 4: UPLOAD PHOTO
    ┌──────────────────────────────────┐
    │ Click "Upload Referensi Gambar"  │
    │ ↓                                │
    │ Select file (JPG/PNG/WebP)       │
    │ ↓                                │
    │ Validasi: < 5MB? ✅              │
    │ ↓                                │
    │ Upload to Vercel Blob Cloud ☁️   │
    │ ↓                                │
    │ System return: Public URL        │
    └──────────────────────────────────┘

    STEP 5: ADD ADDITIONAL COSTS
    ┌──────────────────────────────────┐
    │ Biaya Tambahan (Optional):        │
    │ • Bordir Emas: Rp300,000         │
    │ • Expedite: Rp150,000            │
    │ • Premium Kain: Rp100,000        │
    │                                  │
    │ Result: ✅ TOTAL COSTS = Rp...   │
    └──────────────────────────────────┘

    STEP 6: CALCULATE TOTAL
    ┌──────────────────────────────────┐
    │ SUBTOTAL        = Rp600,000      │
    │ ADDITIONAL COST = Rp450,000      │
    │ ────────────────────────────     │
    │ TOTAL HARGA     = Rp1,050,000 ✅ │
    └──────────────────────────────────┘

    STEP 7: SNAPSHOT & SAVE
    ┌──────────────────────────────────┐
    │ System SNAPSHOT:                 │
    │ ├─ snapshotNama: "Siti"         │
    │ ├─ snapshotNoWa: "628123456789" │
    │ ├─ snapshotData: {...measure...} │
    │ ├─ status: "Antrean"            │
    │ ├─ statusBayar: "Belum Bayar"   │
    │ └─ fotoReferensi: URL           │
    │                                  │
    │ ✅ ORDER SAVED TO DATABASE       │
    │ Auto-generate code: ORD-001      │
    └──────────────────────────────────┘

    STEP 8: CONFIRMATION
    ┌──────────────────────────────────┐
    │ ✅ Pesanan Berhasil Dibuat!      │
    │                                  │
    │ Order Code: ORD-001              │
    │ Customer: Siti Nurhaliza         │
    │ Total: Rp1,050,000               │
    │ Status: Antrean                  │
    │ Deadline: 10 Juni 2026           │
    │                                  │
    │ [Redirect ke Pesanan List]       │
    └──────────────────────────────────┘
```

---

### **Payment Workflow with Auto-Lunas Logic**

```
┌─────────────────────────────────────────────────────────────────┐
│                     PAYMENT WORKFLOW                            │
└─────────────────────────────────────────────────────────────────┘

    STATE 1: BEFORE FIRST PAYMENT
    ┌──────────────────────────────────┐
    │ Order Status:                    │
    │ • Status Bayar: "Belum Bayar"    │
    │ • Total Harga: Rp1,050,000       │
    │ • Total Dibayar: Rp0             │
    │ • Sisa: Rp1,050,000              │
    └──────────────────────────────────┘
                    ↓ (Customer bayar)

    STEP 1: ADMIN INPUT PAYMENT
    ┌──────────────────────────────────┐
    │ Admin click "Catat Pembayaran"   │
    │ ↓                                │
    │ Pilih order: ORD-001             │
    │ ↓                                │
    │ Input nominal: Rp500,000 (DP)    │
    │ Input metode: Tunai              │
    │ Input catatan: "DP 50%"          │
    └──────────────────────────────────┘

    STEP 2: SAVE PAYMENT RECORD
    ┌──────────────────────────────────┐
    │ Payment record created:          │
    │ • Code: PMT-001                  │
    │ • Nominal: Rp500,000             │
    │ • Metode: Tunai                  │
    │ • Timestamp: 2026-05-21          │
    └──────────────────────────────────┘

    STEP 3: AUTO-LUNAS LOGIC (SMART) ⭐
    ┌──────────────────────────────────┐
    │ System Calculate:                │
    │                                  │
    │ Cek total pembayaran:            │
    │ SUM(payments) = Rp500,000        │
    │                                  │
    │ Compare with total harga:        │
    │ Rp500,000 >= Rp1,050,000? NO    │
    │                                  │
    │ → Status tetap "DP"              │
    │ → Sisa bayar: Rp550,000          │
    │ → Reminder: Bayar lebih lanjut   │
    └──────────────────────────────────┘

    STATE 2: AFTER FIRST PAYMENT (DP)
    ┌──────────────────────────────────┐
    │ Order Status Updated:            │
    │ • Status Bayar: "DP" ⚠️          │
    │ • Total Harga: Rp1,050,000       │
    │ • Total Dibayar: Rp500,000       │
    │ • Sisa: Rp550,000 🔴             │
    └──────────────────────────────────┘
                    ↓ (Customer bayar lagi)

    STEP 4: SECOND PAYMENT
    ┌──────────────────────────────────┐
    │ Admin input payment lagi:        │
    │ • Nominal: Rp550,000 (Lunas)    │
    │ • Metode: Transfer BCA           │
    │ • Code: PMT-002                  │
    └──────────────────────────────────┘

    STEP 5: AUTO-LUNAS CHECK (AGAIN) ⭐
    ┌──────────────────────────────────┐
    │ System Calculate:                │
    │                                  │
    │ Total pembayaran baru:           │
    │ Rp500,000 + Rp550,000            │
    │ = Rp1,050,000                    │
    │                                  │
    │ Compare:                         │
    │ Rp1,050,000 >= Rp1,050,000? YES ✅
    │                                  │
    │ → Status AUTO-CHANGE → "Lunas"  │
    │ → Sisa: Rp0                      │
    │ → Invoice: [Ready]               │
    └──────────────────────────────────┘

    STATE 3: AFTER FULL PAYMENT (LUNAS)
    ┌──────────────────────────────────┐
    │ Order Status FINAL:              │
    │ • Status Bayar: "✅ LUNAS"       │
    │ • Total Harga: Rp1,050,000       │
    │ • Total Dibayar: Rp1,050,000     │
    │ • Sisa: Rp0                      │
    │                                  │
    │ Transaction Complete! 🎉         │
    └──────────────────────────────────┘
```

---

### **Status Tracking Flow (Production Pipeline)**

```
┌─────────────────────────────────────────────────────────────────┐
│              ORDER STATUS PRODUCTION PIPELINE                   │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│ STEP 1: ANTREAN (Queue)                                           │
│ ├─ Order diterima & dicatat                                      │
│ ├─ Status: 🔴 ANTREAN (waiting)                                  │
│ ├─ Timeline: Saat order dibuat                                   │
│ └─ Action: Waiting untuk giliran produksi                        │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│ STEP 2: POTONG KAIN (Cutting)                                     │
│ ├─ Status: 🟠 POTONG KAIN (cutting phase)                        │
│ ├─ Durasi: 1-2 hari (depend on fabric)                           │
│ ├─ Aktivitas:                                                    │
│ │  ├─ QC kain & check pattern                                    │
│ │  ├─ Marking pola ke kain                                       │
│ │  ├─ Cutting pieces sesuai measurement snapshot                 │
│ │  └─ Organize pieces untuk next step                            │
│ └─ Result: Pieces ready untuk dijahit                            │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│ STEP 3: DIJAHIT (Sewing) — LONGEST PHASE                          │
│ ├─ Status: 🟡 DIJAHIT (production main)                          │
│ ├─ Durasi: 3-5 hari (depend on complexity)                       │
│ ├─ Aktivitas:                                                    │
│ │  ├─ Main sewing (jahit komponen utama)                         │
│ │  ├─ Detail sewing (jahit detail, bordir, dll)                  │
│ │  ├─ Attachment (pasang aksesoris, kancing, dll)               │
│ │  ├─ Quality check intermediate                                 │
│ │  └─ Pressing/steam sebelum fitting                             │
│ └─ Result: Garment sudah jadi bentuknya                          │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│ STEP 4: FITTING (Tailoring/Try-on)                                │
│ ├─ Status: 🟢 FITTING (adjustment)                               │
│ ├─ Durasi: 1-2 hari                                              │
│ ├─ Aktivitas:                                                    │
│ │  ├─ Customer try-on (fitting)                                  │
│ │  ├─ Check fit vs measurement snapshot                          │
│ │  ├─ Mark adjustment areas                                      │
│ │  ├─ Do alterations (pangkas pinggang, etc)                    │
│ │  ├─ Final pressing                                             │
│ │  └─ Customer approval                                          │
│ └─ Result: Garment perfectly fitted                              │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│ STEP 5: SELESAI (Production Complete)                             │
│ ├─ Status: 🔵 SELESAI (ready)                                    │
│ ├─ Durasi: Same day as final fitting                             │
│ ├─ Aktivitas:                                                    │
│ │  ├─ Final QC check                                             │
│ │  ├─ Packaging (dalam plastic bag/box)                          │
│ │  ├─ Tag with order code (ORD-001)                             │
│ │  ├─ Documentation (foto finished product)                      │
│ │  └─ Notify customer: "Siap diambil"                            │
│ └─ Result: Ready untuk pickup                                    │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│ STEP 6: DIAMBIL (Picked Up)                                       │
│ ├─ Status: ✅ DIAMBIL (completed)                                │
│ ├─ Durasi: Saat customer ambil                                   │
│ ├─ Aktivitas:                                                    │
│ │  ├─ Customer datang ambil                                      │
│ │  ├─ Verifikasi identity & order code                           │
│ │  ├─ Final fit check (optional)                                 │
│ │  ├─ Deliver garment                                            │
│ │  ├─ Collect remaining payment (if any)                         │
│ │  └─ Update status di system                                    │
│ └─ Result: ORDER COMPLETE! 🎉                                    │
└────────────────────────────────────────────────────────────────────┘

TIMELINE EXAMPLE:
┌─────────┬──────────┬────────┬─────────┬──────────┬────────┐
│ Antrean │  Potong  │ Dijahit│ Fitting │ Selesai  │ Diambil│
│ 20 May  │ 21-22 May│23-26 May│ 27 May │ 28 May   │ 29 May │
│   1 day │   2 days │ 4 days │ 1 day  │ same day │        │
└─────────┴──────────┴────────┴─────────┴──────────┴────────┘
                         ~9 days total
```

---

### **Public Status Check (Customer View)**

```
┌─────────────────────────────────────────────────────────────────┐
│            CUSTOMER CEK STATUS (PUBLIC - NO LOGIN)               │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ 1. VISIT HOME PAGE                         │
│    https://sijah-asy-syifa.com             │
│    ↓                                       │
│    See button: "🔍 Cek Status"            │
└────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────┐
│ 2. CLICK CEK STATUS BUTTON                 │
│    ↓                                       │
│    Modal terbuka dengan form               │
└────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────┐
│ 3. INPUT SEARCH CRITERIA                   │
│    ┌──────────────────────────────────┐   │
│    │ Nama Pelanggan:                  │   │
│    │ [Siti Nurhaliza           ]      │   │
│    │                                  │   │
│    │ Nomor WhatsApp:                  │   │
│    │ [628123456789            ]       │   │
│    │                                  │   │
│    │ [  Cek Status  ] Button          │   │
│    └──────────────────────────────────┘   │
│    ↓                                       │
│    Query database:                        │
│    WHERE snapshotNama = "Siti"            │
│    AND snapshotNoWa = "628123456789"      │
└────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────┐
│ 4. SYSTEM SEARCH RESULTS                   │
│    ↓                                       │
│    FOUND! 1 order                         │
│    (Could be 1 atau lebih)                │
└────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. DISPLAY ORDER DETAILS (Card View)                        │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 📦 PESANAN: ORD-001                  [🟡Dijahit][🟠DP]│
│ │ Tanggal Pesan: 20 Mei 2026                            │
│ │ Nama: Siti Nurhaliza                                  │
│ │ ─────────────────────────────────────────────────────│
│ │ Pesanan: Kebaya Pengikut Pengantin                    │
│ │                                                       │
│ │ Keterangan Harga:                                     │
│ │   Total Harga      : Rp 1,050,000                    │
│ │   Sudah Dibayar    : Rp   500,000 (DP)              │
│ │   Sisa Bayar       : Rp   550,000 🔴                │
│ │                                                       │
│ │ Deadline Pesanan   : 10 Juni 2026                    │
│ │                                                       │
│ │ Status Produksi:                                     │
│ │ ┌─────────┬─────────┬────────┬────────┬────────┐   │
│ │ │Antrean ✓│ Potong  │Dijahit ●│Fitting │Selesai │   │
│ │ │(Done)   │(Next)   │(Now)   │(Later) │(Later) │   │
│ │ └─────────┴─────────┴────────┴────────┴────────┘   │
│ │                                                       │
│ │ [📄 Download Invoice]                                │
│ └──────────────────────────────────────────────────────┘
│                                                              │
│ Ibu Siti sekarang tahu:                                    │
│ ✅ Pesanannya sedang dijahit                               │
│ ✅ Harus bayar sisa Rp550,000                              │
│ ✅ Harus selesai sebelum 10 Juni                           │
│ ✅ Tidak perlu telpon/WhatsApp admin lagi                 │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────┐
│ 6. OPTIONAL: SEARCH AGAIN                  │
│    [  Cari Lagi  ] Button                  │
│    ↓                                       │
│    Back to search form                     │
│    (Bisa cari order lain)                  │
└────────────────────────────────────────────┘
```

---

## 📋 Data Snapshot Illustration

```
══════════════════════════════════════════════════════════════════

TIMELINE: CUSTOMER DATA JOURNEY

[Day 1] ────────────────────────────────────────────────────────
         Customer registered in system:
         
         CUSTOMER TABLE:
         └─ Nama: "Siti"
         └─ NoWa: "628123456789"
         └─ Alamat: "Jl. Merdeka 123"
         
         MEASUREMENT TABLE:
         └─ Ukuran Formal 2025
            └─ Lingkar Dada: 88cm
            └─ Panjang Baju: 65cm

[Day 2] ────────────────────────────────────────────────────────
         Customer memesan pesanan ORD-001
         
         System SNAPSHOT data ke Order:
         
         ORDER TABLE (ORD-001):
         └─ snapshotNama: "Siti" ← SNAPSHOT dari CUSTOMER
         └─ snapshotNoWa: "628123456789" ← SNAPSHOT
         └─ snapshotData: {
              lingkarDada: 88,
              panjangBaju: 65
            } ← SNAPSHOT dari MEASUREMENT
         
         (Original CUSTOMER & MEASUREMENT tidak diubah)

[Day 20] ───────────────────────────────────────────────────────
         Customer update data:
         
         CUSTOMER TABLE (UPDATED):
         └─ Nama: "Siti Nurhaliza" ← CHANGED
         └─ NoWa: "629876543210" ← CHANGED
         └─ Alamat: "Jl. Ahmad Yani 456" ← CHANGED
         
         MEASUREMENT TABLE (UPDATED):
         └─ Ukuran Formal 2025
            └─ Lingkar Dada: 90cm ← CHANGED
            └─ Panjang Baju: 67cm ← CHANGED

[Day 21] ───────────────────────────────────────────────────────
         ORD-001 di-review:
         
         ORDER TABLE (ORD-001) — UNCHANGED! 🔒
         └─ snapshotNama: "Siti" ← STILL OLD DATA
         └─ snapshotNoWa: "628123456789" ← STILL OLD DATA
         └─ snapshotData: {
              lingkarDada: 88,
              panjangBaju: 65
            } ← STILL OLD DATA
         
         ✅ Jahit akan tetap pake data lama
         ✅ Tidak ada konflik/error
         ✅ Order history tetap akurat

══════════════════════════════════════════════════════════════════

BENEFIT OF SNAPSHOTTING:
┌────────────────────────────────────────────────────────────────┐
│ Skenario 1: WITHOUT Snapshotting (PROBLEM)                    │
│                                                                │
│ Day 1: Buat order pake measurement A (88cm)                  │
│ Day 2: Customer update measurement jadi B (90cm)             │
│ Day 3: Order history show measurement B (90cm) ← WRONG!      │
│        ← Jahit malah pake data baru, bukan yang dipesan awal  │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ Skenario 2: WITH Snapshotting (SOLUTION) ✅                   │
│                                                                │
│ Day 1: Buat order, SNAPSHOT measurement A (88cm)             │
│ Day 2: Customer update measurement jadi B (90cm)             │
│ Day 3: Order history STILL show measurement A (88cm) ✅      │
│        ← Jahit tetap pake data awal yang dipesan customer    │
└────────────────────────────────────────────────────────────────┘
```

---

## 🖨️ How to Print/Export

### **Option 1: Print from Browser**
1. Open PROGRESS.md in GitHub
2. Press `Ctrl+P` (or `Cmd+P` on Mac)
3. Choose printer settings
4. Print! 📄

### **Option 2: Export as PDF**
```bash
# Using pandoc (install first)
pandoc PROGRESS.md -o PROGRESS.pdf
```

### **Option 3: Export Diagrams**
1. Go to https://mermaid.live
2. Copy diagram code
3. Click "Download" → Select PNG/SVG/PDF
4. Save diagram image
5. Insert to Word/PowerPoint 📊

---

**Last Updated**: 2026-05-20  
**For**: Team presentation & documentation
