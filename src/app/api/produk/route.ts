import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/produk?umkmId=
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const umkmId = searchParams.get("umkmId");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (umkmId) {
    where.umkmId = parseInt(umkmId);
  }

  const produkList = await prisma.produk.findMany({
    where,
    include: {
      kategori: true,
      umkm: { select: { id: true, namaUsaha: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(produkList);
}

// POST /api/produk
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { umkmId, kategoriId, namaProduk, deskripsi, harga, stok, fotoProduk } =
    body;

  if (!umkmId || !kategoriId || !namaProduk || harga === undefined) {
    return NextResponse.json(
      { error: "UMKM, kategori, nama produk, dan harga wajib diisi." },
      { status: 400 }
    );
  }

  const produk = await prisma.produk.create({
    data: {
      umkmId: parseInt(umkmId),
      kategoriId: parseInt(kategoriId),
      namaProduk,
      deskripsi: deskripsi || null,
      harga: parseFloat(harga),
      stok: stok ? parseInt(stok) : 0,
      fotoProduk: fotoProduk || null,
    },
    include: { kategori: true, umkm: { select: { namaUsaha: true } } },
  });

  return NextResponse.json(produk, { status: 201 });
}
