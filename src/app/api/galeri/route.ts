import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/galeri?umkmId=
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const umkmId = searchParams.get("umkmId");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (umkmId) {
    where.umkmId = parseInt(umkmId);
  }

  const galeriList = await prisma.galeri.findMany({
    where,
    include: {
      umkm: { select: { id: true, namaUsaha: true } },
    },
    orderBy: { id: "desc" },
  });

  return NextResponse.json(galeriList);
}

// POST /api/galeri
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { umkmId, urlFoto, keterangan } = body;

  if (!umkmId || !urlFoto) {
    return NextResponse.json(
      { error: "UMKM dan foto wajib diisi." },
      { status: 400 }
    );
  }

  const galeri = await prisma.galeri.create({
    data: {
      umkmId: parseInt(umkmId),
      urlFoto,
      keterangan: keterangan || null,
    },
    include: { umkm: { select: { namaUsaha: true } } },
  });

  return NextResponse.json(galeri, { status: 201 });
}
