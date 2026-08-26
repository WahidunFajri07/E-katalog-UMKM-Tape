import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/kategori
export async function GET() {
  const kategoriList = await prisma.kategori.findMany({
    include: {
      _count: { select: { produkList: true } },
    },
    orderBy: { namaKategori: "asc" },
  });

  return NextResponse.json(kategoriList);
}

// POST /api/kategori
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { namaKategori } = body;

  if (!namaKategori) {
    return NextResponse.json(
      { error: "Nama kategori wajib diisi." },
      { status: 400 }
    );
  }

  const existing = await prisma.kategori.findUnique({
    where: { namaKategori },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Kategori sudah ada." },
      { status: 409 }
    );
  }

  const kategori = await prisma.kategori.create({
    data: { namaKategori },
  });

  return NextResponse.json(kategori, { status: 201 });
}
