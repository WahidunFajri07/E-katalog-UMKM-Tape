import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function deleteCloudinaryImage(url: string | null) {
  if (!url) return;
  try {
    const urlParts = url.split("/upload/");
    if (urlParts.length === 2) {
      const publicId = urlParts[1].split("/").slice(1).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (e) {
    console.error("Failed to delete image from Cloudinary", e);
  }
}

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/umkm/[id] — Detail UMKM (by id or slug)
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  // Try to find by slug first, then by ID
  let umkm = await prisma.umkm.findUnique({
    where: { slug: id },
    include: {
      produkList: { include: { kategori: true }, orderBy: { createdAt: "desc" } },
      galeriList: true,
    },
  });

  if (!umkm) {
    const numId = parseInt(id);
    if (!isNaN(numId)) {
      umkm = await prisma.umkm.findUnique({
        where: { id: numId },
        include: {
          produkList: { include: { kategori: true }, orderBy: { createdAt: "desc" } },
          galeriList: true,
        },
      });
    }
  }

  if (!umkm) {
    return NextResponse.json({ error: "UMKM not found" }, { status: 404 });
  }

  return NextResponse.json(umkm);
}

// PUT /api/umkm/[id] — Update UMKM
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
  const {
    namaUsaha,
    namaPemilik,
    alamat,
    noTelepon,
    tahunBerdiri,
    fotoProfil,
    sampulToko,
    statusTampil,
    latitude,
    longitude,
    linkGmaps,
  } = body;

  const umkm = await prisma.umkm.update({
    where: { id: numId },
    data: {
      ...(namaUsaha !== undefined && { namaUsaha }),
      ...(namaPemilik !== undefined && { namaPemilik }),
      ...(alamat !== undefined && { alamat }),
      ...(noTelepon !== undefined && { noTelepon }),
      ...(tahunBerdiri !== undefined && { tahunBerdiri }),
      ...(fotoProfil !== undefined && { fotoProfil }),
      ...(sampulToko !== undefined && { sampulToko }),
      ...(statusTampil !== undefined && { statusTampil }),
      ...(latitude !== undefined && { latitude: latitude ? parseFloat(latitude) : null }),
      ...(longitude !== undefined && { longitude: longitude ? parseFloat(longitude) : null }),
      ...(linkGmaps !== undefined && { linkGmaps }),
    },
  });

  return NextResponse.json(umkm);
}

// DELETE /api/umkm/[id]
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

  try {
    const umkm = await prisma.umkm.findUnique({
      where: { id: numId },
      include: {
        produkList: true,
        galeriList: true,
      }
    });

    if (umkm) {
      await deleteCloudinaryImage(umkm.fotoProfil);
      await deleteCloudinaryImage(umkm.sampulToko);
      
      for (const p of umkm.produkList) {
        await deleteCloudinaryImage(p.fotoProduk);
      }
      for (const g of umkm.galeriList) {
        await deleteCloudinaryImage(g.urlFoto);
      }
    }

    await prisma.umkm.delete({ where: { id: numId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
