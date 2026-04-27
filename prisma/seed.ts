import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const parseDate = (str: string) => {
  // dd/mm/yyyy
  const [d, m, y] = str.split("/").map(Number);
  return new Date(y, m - 1, d);
};

async function main() {
  console.log("🌱 Seeding...");

  // wipe
  await prisma.payment.deleteMany();
  await prisma.additionalCost.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.measurement.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // admin
  const hashed = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@sijah.com",
      username: "Elisa Admin",
      password: hashed,
    },
  });
  console.log("✓ Admin: admin@sijah.com / admin123");

  // pelanggan
  const seedCustomers = [
    { code: "P0015", nama: "Oki Setiawan", noWa: "081234567815", alamat: "Jl. Pemuda No. 30, Purwokerto Timur, Kab. Banyumas", gender: "Laki-laki", createdAt: "05/04/2026", updatedAt: "20/04/2026", ukuran: [{ judul: "Ukuran Kaos kelas 6 S" }, { judul: "Ukuran Kaos kelas 6 M" }] },
    { code: "P0014", nama: "Nina Marlina", noWa: "081234567814", alamat: "Jl. Merapi No. 4, Boyolali Kota, Kab. Boyolali", gender: "Perempuan", createdAt: "02/04/2026", updatedAt: "02/04/2026", ukuran: [{ judul: "Ukuran Gamis Standar" }] },
    { code: "P0013", nama: "Muhammad Aris", noWa: "081234567813", alamat: "Jl. Lawu No. 12, Karanganyar Kota, Kab. Karanganyar", gender: "Laki-laki", createdAt: "25/03/2026", updatedAt: "25/03/2026", ukuran: [{ judul: "Seragam Rebana M" }] },
    { code: "P0012", nama: "Larasati", noWa: "081234567812", alamat: "Jl. Muria No. 88, Badengan, Kab. Kudus", gender: "Perempuan", createdAt: "20/03/2026", updatedAt: "01/04/2026", ukuran: [] },
    { code: "P0011", nama: "Kusuma Wardani", noWa: "081234567811", alamat: "Jl. Gatot Subroto No. 67, Cilacap Selatan, Kab. Cilacap", gender: "Perempuan", createdAt: "12/03/2026", updatedAt: "12/03/2026", ukuran: [] },
    { code: "P0010", nama: "Julia Perez", noWa: "081234567810", alamat: "Jl. Sumbing No. 2, Wonosobo Barat, Kab. Wonosobo", gender: "Perempuan", createdAt: "05/03/2026", updatedAt: "15/04/2026", ukuran: [] },
    { code: "P0009", nama: "Indra Wijaya", noWa: "081234567809", alamat: "Jl. Veteran No. 10, Klaten Tengah, Kab. Klaten", gender: "Laki-laki", createdAt: "02/03/2026", updatedAt: "02/03/2026", ukuran: [] },
    { code: "P0008", nama: "Hani Safitri", noWa: "081234567808", alamat: "Jl. Kartini No. 5, Jepara Kota, Kab. Jepara", gender: "Perempuan", createdAt: "25/02/2026", updatedAt: "25/02/2026", ukuran: [] },
    { code: "P0007", nama: "Galih Rakasiwi", noWa: "081234567807", alamat: "Jl. Diponegoro No. 14, Ungaran Barat, Kab. Semarang", gender: "Laki-laki", createdAt: "18/02/2026", updatedAt: "20/03/2026", ukuran: [] },
    { code: "P0006", nama: "Fitriani", noWa: "081234567806", alamat: "Jl. Jend. Sudirman No. 33, Tegal Timur, Kota Tegal", gender: "Perempuan", createdAt: "10/02/2026", updatedAt: "10/02/2026", ukuran: [] },
  ];

  const customerMap: Record<string, string> = {};
  for (const c of seedCustomers) {
    const created = await prisma.customer.create({
      data: {
        code: c.code,
        nama: c.nama,
        noWa: c.noWa,
        alamat: c.alamat,
        gender: c.gender,
        createdAt: parseDate(c.createdAt),
        updatedAt: parseDate(c.updatedAt),
        measurements: {
          create: c.ukuran.map((u) => ({
            judul: u.judul,
            createdAt: parseDate(c.createdAt),
            updatedAt: parseDate(c.createdAt),
          })),
        },
      },
    });
    customerMap[c.code] = created.id;
  }
  console.log(`✓ ${seedCustomers.length} pelanggan`);

  // pesanan
  const seedOrders = [
    { code: "S0015", judul: "Pesanan Kaos Kelas 6 SD N Kalisari 3", custCode: "P0015", deadline: "20/06/2026", total: 2125000, status: "Antrean", createdAt: "05/04/2026", updatedAt: "20/04/2026" },
    { code: "S0014", judul: "Gamis Muslimah Mbak Nina", custCode: "P0014", deadline: "21/04/2026", total: 250000, status: "Antrean", createdAt: "02/04/2026", updatedAt: "02/04/2026" },
    { code: "S0013", judul: "Pesanan Seragam Rebana Jamiah Nurul Huda", custCode: "P0013", deadline: "29/04/2026", total: 1250000, status: "Antrean", createdAt: "25/03/2026", updatedAt: "25/03/2026" },
    { code: "S0012", judul: "Seragam Keluarga mbak laras", custCode: "P0012", deadline: "20/04/2026", total: 550000, status: "Potong Kain", createdAt: "20/03/2026", updatedAt: "01/04/2026" },
    { code: "S0011", judul: "Gamis Shimmer shimmer mbak kus", custCode: "P0011", deadline: "11/04/2026", total: 350000, status: "Potong Kain", createdAt: "12/03/2026", updatedAt: "12/03/2026" },
    { code: "S0010", judul: "Pesanan Seragam senam Bu Juli", custCode: "P0010", deadline: "31/05/2026", total: 3250000, status: "Potong Kain", createdAt: "05/03/2026", updatedAt: "15/04/2026" },
    { code: "S0009", judul: "Seragam PDH T. Sipil Unnes Mas Indra", custCode: "P0009", deadline: "27/05/2026", total: 4500000, status: "Dijahit", createdAt: "02/03/2026", updatedAt: "02/03/2026" },
    { code: "S0008", judul: "Kemeja Mbak Hani", custCode: "P0008", deadline: "10/03/2026", total: 120000, status: "Potong Kain", createdAt: "25/02/2026", updatedAt: "25/02/2026" },
    { code: "S0007", judul: "Seragam osis Mas galih", custCode: "P0007", deadline: "05/04/2026", total: 70000, status: "Dijahit", createdAt: "18/02/2026", updatedAt: "20/03/2026" },
    { code: "S0006", judul: "Seragam Pramuka SMA mbak fitri", custCode: "P0006", deadline: "28/02/2026", total: 90000, status: "Dibatalkan", createdAt: "10/02/2026", updatedAt: "10/02/2026" },
  ];

  for (const o of seedOrders) {
    const cust = await prisma.customer.findUnique({
      where: { code: o.custCode },
    });
    if (!cust) continue;
    await prisma.order.create({
      data: {
        code: o.code,
        judul: o.judul,
        customerId: cust.id,
        tglMasuk: parseDate(o.createdAt),
        tglEstimasi: parseDate(o.deadline),
        status: o.status,
        totalHarga: o.total,
        snapshotNama: cust.nama,
        snapshotNoWa: cust.noWa,
        createdAt: parseDate(o.createdAt),
        updatedAt: parseDate(o.updatedAt),
        items: {
          create: [
            {
              judulUkuran: "Item 1",
              jumlah: 1,
              hargaSatuan: o.total,
              subTotal: o.total,
            },
          ],
        },
      },
    });
  }
  console.log(`✓ ${seedOrders.length} pesanan`);

  console.log("✅ Done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
