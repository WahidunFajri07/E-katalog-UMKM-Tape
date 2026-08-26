import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ id: string }> };

// PUT /api/kategori/[id]
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
  const { namaKategori } = body;

  if (!namaKategori) {
    return NextResponse.json(
      { error: "Nama kategori wajib diisi." },
      { status: 400 }
    );
  }

  const kategori = await prisma.kategori.update({
    where: { id: numId },
    data: { namaKategori },
  });

  return NextResponse.json(kategori);
}

// DELETE /api/kategori/[id]
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

  // Check if kategori has products
  const count = await prisma.produk.count({ where: { kategoriId: numId } });
  if (count > 0) {
    return NextResponse.json(
      { error: `Kategori masih digunakan oleh ${count} produk.` },
      { status: 409 }
    );
  }

  await prisma.kategori.delete({ where: { id: numId } });

  return NextResponse.json({ success: true });
}
