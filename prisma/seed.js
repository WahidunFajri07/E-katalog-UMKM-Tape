const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Seed Admin
  const passwordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash,
      namaLengkap: "Admin Desa Bakung Kidul",
      jabatan: "Pengelola E-Katalog",
    },
  });

  console.log("✅ Admin created:", admin.username);

  // Seed Kategori
  const kategoriNames = [
    "Tape Singkong",
    "Tape Ketan",
    "Olahan Tape",
    "Keripik",
    "Minuman",
    "Makanan Ringan",
  ];

  for (const nama of kategoriNames) {
    await prisma.kategori.upsert({
      where: { namaKategori: nama },
      update: {},
      create: { namaKategori: nama },
    });
  }

  console.log("✅ Kategori seeded:", kategoriNames.length);

  // Seed UMKM
  const umkmData = [
    {
      namaUsaha: "Tape Manis Bu Sari",
      slug: "tape-manis-bu-sari",
      namaPemilik: "Sari Wulandari",
      alamat: "Dusun Bakung RT 01/RW 02, Desa Bakung Kidul",
      noTelepon: "081234567890",
      tahunBerdiri: "2015",
      statusTampil: true,
    },
    {
      namaUsaha: "Tape Ketan Pak Joko",
      slug: "tape-ketan-pak-joko",
      namaPemilik: "Joko Susanto",
      alamat: "Dusun Kidul RT 03/RW 01, Desa Bakung Kidul",
      noTelepon: "081298765432",
      tahunBerdiri: "2018",
      statusTampil: true,
    },
    {
      namaUsaha: "Olahan Tape Mbak Ani",
      slug: "olahan-tape-mbak-ani",
      namaPemilik: "Ani Rahayu",
      alamat: "Dusun Tengah RT 02/RW 03, Desa Bakung Kidul",
      noTelepon: "085712345678",
      tahunBerdiri: "2020",
      statusTampil: true,
    },
  ];

  for (const data of umkmData) {
    await prisma.umkm.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        adminId: admin.id,
        ...data,
      },
    });
  }

  console.log("✅ UMKM seeded:", umkmData.length);

  // Seed Produk
  const umkmList = await prisma.umkm.findMany();
  const kategoriList = await prisma.kategori.findMany();

  const kategoriMap = {};
  kategoriList.forEach((k) => {
    kategoriMap[k.namaKategori] = k.id;
  });

  const produkData = [
    {
      umkmSlug: "tape-manis-bu-sari",
      kategori: "Tape Singkong",
      namaProduk: "Tape Singkong Manis Original",
      deskripsi: "Tape singkong pilihan dengan rasa manis alami, difermentasi selama 3 hari.",
      harga: 15000,
      stok: 50,
    },
    {
      umkmSlug: "tape-manis-bu-sari",
      kategori: "Tape Singkong",
      namaProduk: "Tape Singkong Premium",
      deskripsi: "Tape singkong premium dengan kualitas terbaik dan rasa yang lebih manis.",
      harga: 25000,
      stok: 30,
    },
    {
      umkmSlug: "tape-ketan-pak-joko",
      kategori: "Tape Ketan",
      namaProduk: "Tape Ketan Hitam",
      deskripsi: "Tape ketan hitam yang lembut dengan aroma khas fermentasi alami.",
      harga: 20000,
      stok: 40,
    },
    {
      umkmSlug: "tape-ketan-pak-joko",
      kategori: "Tape Ketan",
      namaProduk: "Tape Ketan Putih",
      deskripsi: "Tape ketan putih dengan tekstur lembut dan rasa manis natural.",
      harga: 18000,
      stok: 35,
    },
    {
      umkmSlug: "olahan-tape-mbak-ani",
      kategori: "Olahan Tape",
      namaProduk: "Dodol Tape",
      deskripsi: "Dodol berbahan dasar tape dengan tekstur kenyal dan rasa manis legit.",
      harga: 30000,
      stok: 25,
    },
    {
      umkmSlug: "olahan-tape-mbak-ani",
      kategori: "Keripik",
      namaProduk: "Keripik Tape Renyah",
      deskripsi: "Keripik tape yang renyah dan gurih, cocok sebagai cemilan.",
      harga: 12000,
      stok: 60,
    },
  ];

  for (const p of produkData) {
    const umkm = umkmList.find((u) => u.slug === p.umkmSlug);
    if (umkm && kategoriMap[p.kategori]) {
      await prisma.produk.create({
        data: {
          umkmId: umkm.id,
          kategoriId: kategoriMap[p.kategori],
          namaProduk: p.namaProduk,
          deskripsi: p.deskripsi,
          harga: p.harga,
          stok: p.stok,
        },
      });
    }
  }

  console.log("✅ Produk seeded:", produkData.length);
  console.log("\n🎉 Seed completed!");
  console.log("   Login: admin / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
