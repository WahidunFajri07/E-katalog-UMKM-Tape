import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ id: string }> };

// PUT /api/produk/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const numId = parseInt(id);
  if (isNaN(numId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const body = await request.json();
  const { kategoriId, namaProduk, deskripsi, harga, stok, fotoProduk } = body;

  const produk = await prisma.produk.update({
    where: { id: numId },
    data: {
      ...(kategoriId !== undefined && { kategoriId: parseInt(kategoriId) }),
      ...(namaProduk !== undefined && { namaProduk }),
      ...(deskripsi !== undefined && { deskripsi }),
      ...(harga !== undefined && { harga: parseFloat(harga) }),
      ...(stok !== undefined && { stok: parseInt(stok) }),
      ...(fotoProduk !== undefined && { fotoProduk }),
    },
    include: { kategori: true },
  });

  return NextResponse.json(produk);
}

// DELETE /api/produk/[id]
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const numId = parseInt(id);
  if (isNaN(numId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  await prisma.produk.delete({ where: { id: numId } });

  return NextResponse.json({ success: true });
}
