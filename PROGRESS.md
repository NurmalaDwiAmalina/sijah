# 📊 Progress Report — AIS Sijah
**Status**: MVP 95% Completed | **Last Updated**: 2026-05-20

---

## 📋 Ringkasan Fitur & Pembagian Pekerjaan

| Fitur | Status | Pengerjaan | Progress |
|-------|--------|-----------|----------|
| **Authentication & User Management** | ✅ Done | Person A | 100% |
| **Manajemen Pelanggan (Customer)** | ✅ Done | Person B | 100% |
| **Manajemen Ukuran Badan** | ✅ Done | Person B | 100% |
| **Manajemen Pesanan (Order)** | ✅ Done | Person C | 100% |
| **Tracking Status Produksi** | ✅ Done | Person C | 100% |
| **Manajemen Pembayaran (Payment)** | ✅ Done | Person A | 100% |
| **Cek Status Publik** | ✅ Done | Person C | 100% |
| **Upload Gambar ke Cloud** | ✅ Done | Person A | 100% |
| **Dashboard (Optional)** | ⏳ In Progress | — | 0% |

---

## 👤 Person A — Authentication, Payment & Cloud Storage
**Fokus**: Backend security, payment logic, file handling

### ✅ Selesai
- [x] Login/Logout system dengan session
- [x] Password hashing menggunakan bcryptjs
- [x] Forgot Password & Reset Password flow
- [x] Session management (expires after 30 days)
- [x] Password reset token validation
- [x] Update Password functionality
- [x] **Payment recording** dengan auto-lunas logic
  - DP (Down Payment) tracking
  - Payment history per order
  - Auto status → Lunas when paid >= total
- [x] **Vercel Blob Storage integration**
  - Upload image endpoint (`/api/upload/image`)
  - Async image upload
  - Cloud storage instead of database
  - 5MB file size support

### 📁 Files yang Dikerjakan
```
src/lib/auth.ts                 — Session & user validation
src/lib/actions/auth.ts         — Login, logout, password reset
src/components/ProfileForm.tsx  — User profile management
src/components/ResetPasswordForm.tsx
src/app/api/auth/               — Auth endpoints
src/components/PembayaranRowActions.tsx
src/components/PembayaranEditForm.tsx
src/app/pembayaran/             — Payment pages
src/app/api/upload/image/route.ts  — Image upload API ⭐ NEW
```

### 🔍 Dokumentasi Fitur
**Payment Auto-Lunas Logic**:
- Saat pembayaran tercatat → sistem cek total bayar
- Jika total bayar >= total harga → status_pembayaran = "Lunas"
- Payment history tersimpan per pesanan

**Image Upload (Vercel Blob)**:
- File diupload ke cloud bukan database
- Return public URL yang disimpan di DB
- Images persist di Vercel production

---

## 👤 Person B — Customer Management & Measurements
**Fokus**: Data management, customer lifecycle, body measurements

### ✅ Selesai
- [x] **CRUD Pelanggan (Customers)**
  - Create customer baru
  - List semua customers dengan pagination
  - View customer detail
  - Edit customer info (nama, WhatsApp, alamat, gender)
  - Delete customer
  - Auto-generated customer code (e.g., CUST-001)

- [x] **Multi-version Body Measurements**
  - 1 customer → many measurements
  - 3 kategori: Atasan / Bawahan / Standar
  - Atasan fields: lingkar leher, bahu, dada, pinggang, lengan, panjang baju
  - Bawahan fields: lingkar pinggang, pinggul, paha, panjang celana
  - Measurement labels untuk identifikasi (e.g., "Ukuran Formal 2025")
  - Custom notes per measurement
  - Timestamp created/updated

- [x] **Measurement History View**
  - List semua ukuran per customer
  - Edit/delete measurements
  - Display dengan kategori grouping

### 📁 Files yang Dikerjakan
```
src/app/pelanggan/              — Customer pages
src/app/pelanggan/new/          — Create customer
src/app/pelanggan/[id]/         — Customer detail & edit
src/components/PelangganForm.tsx — Customer form component
src/lib/actions/pelanggan.ts    — Customer actions
prisma/schema.prisma            — Customer & Measurement models
```

### 🔍 Dokumentasi Fitur
**Customer Data Structure**:
- `code`: Unique customer identifier (CUST-001)
- `nama`: Full name
- `noWa`: WhatsApp number (format: 628xxx)
- `alamat`: Full address
- `gender`: Laki-laki / Perempuan

**Measurement Snapshotting**:
- Saat order dibuat → measurement data di-snapshot ke order
- Perubahan measurement di kemudian hari tidak mempengaruhi order lama
- Preserves historical accuracy

---

## 👤 Person C — Order & Status Tracking
**Fokus**: Order lifecycle, production workflow, public features

### ✅ Selesai
- [x] **CRUD Pesanan (Orders)**
  - Create order baru dengan multi-items
  - List orders dengan filter & sort
  - View order detail dengan full breakdown
  - Edit order information
  - Delete order
  - Auto-generated order code (e.g., ORD-001)

- [x] **Order Status Workflow**
  - 6 status: Antrean → Potong Kain → Dijahit → Fitting → Selesai → Diambil
  - Plus: Dibatalkan (optional)
  - Real-time status update di detail page
  - Status-based filtering in order list

- [x] **Order Items Management**
  - Multi-item per order (1 order = many items dari measurements)
  - Per-item: quantity × unit price = sub-total
  - Snapshot measurement data (terbuat dari body measurements)
  - Item-level notes

- [x] **Additional Costs**
  - Per-order biaya tambahan (kain, aksesoris, expedite, dll)
  - Dynamic cost labels
  - Add/remove costs on the fly

- [x] **Public Status Check (Cek Status)**
  - Customers cek status di halaman home tanpa login
  - Query by nama + nomor WhatsApp (snapshot fields)
  - Display: order code, status produksi, status pembayaran
  - Show: total harga, sudah dibayar, sisa bayar
  - Deadline visibility

- [x] **Image Reference Upload**
  - Upload foto referensi pakaian per order
  - Integrasi dengan Vercel Blob Storage (via Person A)
  - Display di order detail page

### 📁 Files yang Dikerjakan
```
src/app/pesanan/                — Order pages
src/app/pesanan/new/            — Create order
src/app/pesanan/[code]/         — Order detail & edit
src/app/cek-status/             — Public status check page
src/components/PesananForm.tsx  — Create order form
src/components/PesananEditForm.tsx — Edit order form
src/components/CekStatusModal.tsx  — Public status modal
src/components/StatusDropdown.tsx  — Status selector
src/lib/actions/pesanan.ts      — Order actions
src/app/api/orders/search       — Search API untuk cek status
```

### 🔍 Dokumentasi Fitur
**Order Snapshotting**:
```
Saat pesanan dibuat:
- Salin nama & noWa dari customer → snapshotNama, snapshotNoWa
- Salin seluruh measurement data → snapshotData (JSON)
- Perubahan customer data kemudian tidak mempengaruhi pesanan lama
```

**Status Workflow**:
```
Antrean (customer baru masuk)
  ↓
Potong Kain (cutting phase)
  ↓
Dijahit (sewing phase)
  ↓
Fitting (try-on & adjustment)
  ↓
Selesai (production done)
  ↓
Diambil (picked up by customer)
```

**Cek Status Feature**:
- Pelanggan input: Nama + No. WhatsApp (dari saat order)
- API query ke `snapshotNama` & `snapshotNoWa`
- Display order(s) ditemukan dengan detail lengkap
- Real-time payment status update

---

## 🎯 MVP Features — Status Summary

| # | Fitur | Done | Person | Evidence |
|---|-------|------|--------|----------|
| 1 | Auth (login/logout/password reset) | ✅ | A | `/login`, `/api/auth/*` |
| 2 | CRUD Pelanggan | ✅ | B | `/pelanggan` pages |
| 3 | CRUD Ukuran Badan (multi per pelanggan) | ✅ | B | Measurement model, detail pages |
| 4 | CRUD Pesanan + snapshot | ✅ | C | `/pesanan` pages, snapshot fields |
| 5 | Status tracking produksi | ✅ | C | StatusDropdown, status enum |
| 6 | Pencatatan pembayaran + auto-lunas | ✅ | A | `/pembayaran` pages, payment logic |
| 7 | Cek status publik (nama + noWa) | ✅ | C | `/cek-status`, `/api/orders/search` |
| 8 | Upload foto referensi (cloud) | ✅ | A | Vercel Blob integration |

---

## 🗄️ Database Architecture (ERD)

```mermaid
erDiagram
    USER ||--o{ SESSION : has
    USER ||--o{ PASSWORD_RESET : "requests"
    CUSTOMER ||--o{ MEASUREMENT : "has many"
    CUSTOMER ||--o{ ORDER : "creates"
    MEASUREMENT ||--o{ ORDER_ITEM : "used in"
    ORDER ||--o{ ORDER_ITEM : "contains"
    ORDER ||--o{ ADDITIONAL_COST : "has"
    ORDER ||--o{ PAYMENT : "receives"
    
    USER {
        string id PK
        string email UK
        string username
        string password
        string avatar
        datetime createdAt
        datetime updatedAt
    }
    
    SESSION {
        string id PK
        string userId FK
        datetime expiresAt
    }
    
    PASSWORD_RESET {
        string id PK
        string token UK
        string userId FK
        datetime expiresAt
        boolean used
    }
    
    CUSTOMER {
        string id PK
        string code UK
        string nama
        string noWa
        string alamat
        string gender
        datetime createdAt
        datetime updatedAt
    }
    
    MEASUREMENT {
        string id PK
        string customerId FK
        string judul
        string kategori
        string catatan
        float lingkarLeher
        float lebarBahu
        float lingkarDada
        float lingkarPinggang
        float panjangLengan
        float panjangBaju
        float lingkarPinggul
        float lingkarPaha
        float panjangCelana
        string ukuranStandar
        datetime createdAt
        datetime updatedAt
    }
    
    ORDER {
        string id PK
        string code UK
        string customerId FK
        string judul
        datetime tglMasuk
        datetime tglEstimasi
        string jenisPakaian
        string fotoReferensi
        string status
        string catatan
        float totalHarga
        string statusBayar
        string snapshotNama
        string snapshotNoWa
        datetime createdAt
        datetime updatedAt
    }
    
    ORDER_ITEM {
        string id PK
        string orderId FK
        string measurementId FK
        string judulUkuran
        string catatan
        integer jumlah
        float hargaSatuan
        float subTotal
        string snapshotData
    }
    
    ADDITIONAL_COST {
        string id PK
        string orderId FK
        string label
        float amount
    }
    
    PAYMENT {
        string id PK
        string code UK
        string orderId FK
        float jumlah
        string metode
        string catatan
        datetime createdAt
        datetime updatedAt
    }
```

---

## 🔄 System Flow Architecture

```mermaid
graph TB
    subgraph "Public Access"
        HOME["🏠 Home Page"]
        CEK_STATUS["🔍 Cek Status Modal"]
    end
    
    subgraph "Admin Dashboard"
        LOGIN["🔐 Login Page"]
        DASHBOARD["📊 Dashboard"]
        PROFILE["👤 Profile"]
    end
    
    subgraph "Customer Management (Person B)"
        LIST_PELANGGAN["📋 List Pelanggan"]
        NEW_PELANGGAN["➕ Create Pelanggan"]
        DETAIL_PELANGGAN["👥 Detail Pelanggan"]
        MEASUREMENTS["📏 Measurements"]
    end
    
    subgraph "Order Management (Person C)"
        LIST_PESANAN["📦 List Pesanan"]
        NEW_PESANAN["➕ Create Pesanan"]
        DETAIL_PESANAN["📄 Detail Pesanan"]
        EDIT_PESANAN["✏️ Edit Pesanan"]
    end
    
    subgraph "Payment Management (Person A)"
        LIST_PEMBAYARAN["💰 List Pembayaran"]
        NEW_PEMBAYARAN["➕ Create Pembayaran"]
        EDIT_PEMBAYARAN["✏️ Edit Pembayaran"]
    end
    
    subgraph "Backend Services (Person A)"
        AUTH_API["🔑 Auth API"]
        UPLOAD_API["☁️ Upload API"]
        ORDERS_API["📦 Orders API"]
    end
    
    HOME --> CEK_STATUS
    CEK_STATUS --> ORDERS_API
    LOGIN --> AUTH_API
    AUTH_API --> DASHBOARD
    DASHBOARD --> LIST_PELANGGAN
    DASHBOARD --> LIST_PESANAN
    DASHBOARD --> LIST_PEMBAYARAN
    
    LIST_PELANGGAN --> NEW_PELANGGAN
    LIST_PELANGGAN --> DETAIL_PELANGGAN
    DETAIL_PELANGGAN --> MEASUREMENTS
    
    LIST_PESANAN --> NEW_PESANAN
    LIST_PESANAN --> DETAIL_PESANAN
    DETAIL_PESANAN --> EDIT_PESANAN
    NEW_PESANAN --> UPLOAD_API
    EDIT_PESANAN --> UPLOAD_API
    
    LIST_PEMBAYARAN --> NEW_PEMBAYARAN
    LIST_PEMBAYARAN --> EDIT_PEMBAYARAN
```

---

## 📝 Order Creation Flow (Person C)

```mermaid
sequenceDiagram
    actor User as Admin User
    participant Form as Order Form
    participant DB as Database
    participant Cloud as Vercel Blob
    
    User->>Form: Select Customer
    Form->>DB: Fetch customer details & measurements
    DB-->>Form: Return customer & measurement list
    
    User->>Form: Fill order info (judul, tanggal, dll)
    User->>Form: Select measurement items (quantity, harga)
    User->>Form: Upload foto referensi
    Form->>Cloud: POST /api/upload/image
    Cloud-->>Form: Return image URL
    
    User->>Form: Add additional costs (biaya kain, dll)
    User->>Form: Submit form
    
    Form->>DB: Create order with:
    Note over DB: - snapshotNama (customer name at time of order)
    Note over DB: - snapshotNoWa (customer phone at time of order)
    Note over DB: - OrderItems (with snapshotData)
    Note over DB: - fotoReferensi (URL from Vercel Blob)
    Note over DB: - AdditionalCosts
    Note over DB: - status = "Antrean"
    Note over DB: - statusBayar = "Belum Bayar"
    
    DB-->>Form: Order created (ORD-001)
    Form-->>User: ✅ Redirect to pesanan list
```

---

## 💰 Payment Flow (Person A)

```mermaid
sequenceDiagram
    actor User as Admin/User
    participant Form as Payment Form
    participant DB as Database
    participant Logic as Auto-Lunas Logic
    
    User->>Form: Select Order
    Form->>DB: Fetch order details
    DB-->>Form: Return order (totalHarga, existing payments)
    Form->>Form: Calculate remaining balance
    
    User->>Form: Input pembayaran (jumlah, metode)
    User->>Form: Submit
    
    Form->>DB: Create Payment record
    DB->>Logic: Calculate total paid vs total price
    
    alt Total Paid >= Total Price
        Logic->>DB: Update Order statusBayar = "Lunas"
        DB-->>Form: ✅ Payment recorded & auto-marked as LUNAS
    else Total Paid < Total Price
        Logic->>DB: Keep Order statusBayar = "DP"
        DB-->>Form: ✅ Payment recorded (DP status)
    end
    
    Form-->>User: ✅ Redirect to pembayaran list
```

---

## 🎯 Status Tracking Flow (Person C)

```mermaid
stateDiagram-v2
    [*] --> Antrean: Order created
    Antrean --> "Potong Kain": Admin update
    "Potong Kain" --> Dijahit: Admin update
    Dijahit --> Fitting: Admin update
    Fitting --> Selesai: Admin update
    Selesai --> Diambil: Customer pickup
    Diambil --> [*]: Order completed
    
    Antrean -.-> Dibatalkan: Cancel
    "Potong Kain" -.-> Dibatalkan: Cancel
    Dibatalkan --> [*]: Order cancelled
```

---

## 🔍 Public Status Check Flow (Person C)

```mermaid
sequenceDiagram
    actor Customer as Customer (Public)
    participant Modal as Cek Status Modal
    participant API as /api/orders/search
    participant DB as Database
    
    Customer->>Modal: Visit homepage or click "Cek Status"
    Modal->>Customer: Show search form
    Customer->>Modal: Input nama + noWa
    
    Modal->>API: GET /api/orders/search?nama=X&noWa=Y
    API->>DB: Query WHERE snapshotNama=X AND snapshotNoWa=Y
    DB-->>API: Return matching orders
    
    alt Orders found
        API-->>Modal: Return orders with details
        Modal->>Modal: Display order cards:
        Note over Modal: - Order Code & Date
        Note over Modal: - Status (color-coded)
        Note over Modal: - Total harga
        Note over Modal: - Dibayar amount
        Note over Modal: - Sisa bayar
        Note over Modal: - Deadline
        Modal-->>Customer: ✅ View order status
    else No orders found
        API-->>Modal: Empty result
        Modal-->>Customer: ❌ Show "Pesanan tidak ditemukan"
    end
```

---

## 📊 Data Snapshotting Illustration

```mermaid
graph LR
    subgraph "Moment Order Created"
        C["Customer:<br/>Nama: Budi<br/>NoWa: 628xxx"]
        M["Measurement:<br/>Lingkar Dada: 90cm<br/>Panjang Baju: 70cm"]
    end
    
    subgraph "Stored in Order"
        SNAP["✅ Snapshot:<br/>snapshotNama: 'Budi'<br/>snapshotNoWa: '628xxx'<br/>snapshotData: {<br/>lingkarDada: 90,<br/>panjangBaju: 70<br/>}"]
    end
    
    subgraph "Later..."
        C2["Customer Updated:<br/>Nama: Budi Setiawan<br/>NoWa: 629xxx"]
        M2["Measurement Changed:<br/>Lingkar Dada: 92cm<br/>Panjang Baju: 72cm"]
    end
    
    subgraph "Order Remains Unchanged"
        SNAP2["✅ Order Still Has:<br/>snapshotNama: 'Budi'<br/>snapshotNoWa: '628xxx'<br/>snapshotData: {<br/>lingkarDada: 90,<br/>panjangBaju: 70<br/>} ← NO CHANGE"]
    end
    
    C --> SNAP
    M --> SNAP
    C2 -.-> SNAP2
    M2 -.-> SNAP2
    SNAP --> SNAP2
```

---

## 📈 Metrics

- **Total Pages**: 15 (auth, pelanggan, pesanan, pembayaran, profile, dll)
- **Total API Routes**: 4 groups (auth, customers, orders, upload)
- **Database Models**: 7 (User, Session, Customer, Measurement, Order, OrderItem, Payment)
- **Components**: 20+ reusable components
- **Authentication**: ✅ Secure session-based
- **Data Persistence**: ✅ PostgreSQL (Prisma ORM)
- **File Storage**: ✅ Vercel Blob (cloud)

---

## 🚀 Deploy Checklist

- [x] Database migrations ready
- [x] Environment variables configured
- [x] Prisma schema validated
- [x] Authentication working
- [x] Image upload to cloud (no local filesystem)
- [ ] Dashboard analytics (optional, not in MVP)
- [ ] Invoice PDF export (optional, not in MVP)

---

## 📝 Catatan Teknis

### Data Flow
```
1. Customer Input → Database
2. Measurement saved per customer
3. Order created → snapshot customer & measurement data
4. Payment recorded → auto-check lunas status
5. Status updated → reflected on public cek-status
```

### Security
- Password hashed dengan bcryptjs
- Session-based auth (30 hari)
- requireUser() middleware on protected routes
- File upload validated (type & size)

### Performance
- Prisma ORM dengan indexes
- Revalidate cache on data changes
- Efficient queries (include relationships)

---

**Prepared by**: Development Team A, B, C  
**Last Updated**: 2026-05-20  
**Next Review**: Post-deployment feedback
