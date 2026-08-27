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

type RouteParams = { params: Promise<{ id: string }> };

// DELETE /api/galeri/[id]
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
    const galeri = await prisma.galeri.findUnique({
      where: { id: numId },
    });

    if (galeri && galeri.urlFoto) {
      try {
        const urlParts = galeri.urlFoto.split("/upload/");
        if (urlParts.length === 2) {
          const publicId = urlParts[1].split("/").slice(1).join("/").split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (e) {
        console.error("Failed to delete image from Cloudinary", e);
      }
    }

    await prisma.galeri.delete({ where: { id: numId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
