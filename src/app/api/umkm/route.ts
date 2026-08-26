import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// GET /api/umkm — List UMKM
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const kategori = searchParams.get("kategori") || "";
  const all = searchParams.get("all") === "true"; // admin wants all

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  // Public only sees active UMKM unless ?all=true (admin)
  if (!all) {
    where.statusTampil = true;
  }

  if (search) {
    where.OR = [
      { namaUsaha: { contains: search } },
      { namaPemilik: { contains: search } },
      { alamat: { contains: search } },
    ];
  }

  if (kategori) {
    where.produkList = {
      some: {
        kategori: { namaKategori: kategori },
      },
    };
  }

  const umkmList = await prisma.umkm.findMany({
    where,
    include: {
      produkList: {
        include: { kategori: true },
      },
      galeriList: true,
      _count: {
        select: { produkList: true, galeriList: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(umkmList);
}

// POST /api/umkm — Create new UMKM
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    namaUsaha,
    namaPemilik,
    alamat,
    noTelepon,
    tahunBerdiri,
    fotoProfil,
    sampulToko,
    latitude,
    longitude,
    linkGmaps,
  } = body;

  if (!namaUsaha || !namaPemilik || !alamat || !noTelepon) {
    return NextResponse.json(
      { error: "Nama usaha, pemilik, alamat, dan no. telepon wajib diisi." },
      { status: 400 }
    );
  }

  // Generate unique slug
  let slug = slugify(namaUsaha);
  const existing = await prisma.umkm.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  // Get admin ID (first admin)
  const admin = await prisma.admin.findFirst();
  if (!admin) {
    return NextResponse.json(
      { error: "Admin not found. Run seed first." },
      { status: 500 }
    );
  }

  const umkm = await prisma.umkm.create({
    data: {
      adminId: admin.id,
      namaUsaha,
      slug,
      namaPemilik,
      alamat,
      noTelepon,
      tahunBerdiri: tahunBerdiri || null,
      fotoProfil: fotoProfil || null,
      sampulToko: sampulToko || null,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      linkGmaps: linkGmaps || null,
    },
  });

  return NextResponse.json(umkm, { status: 201 });
}
