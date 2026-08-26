import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalUmkm, totalProduk, totalKategori, umkmNonaktif] =
    await Promise.all([
      prisma.umkm.count(),
      prisma.produk.count(),
      prisma.kategori.count(),
      prisma.umkm.count({ where: { statusTampil: false } }),
    ]);

  return NextResponse.json({
    totalUmkm,
    totalProduk,
    totalKategori,
    umkmNonaktif,
  });
}
