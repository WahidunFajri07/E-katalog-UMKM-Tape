import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ id: string }> };

// PATCH /api/umkm/[id]/toggle-status
export async function PATCH(_request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const numId = parseInt(id);
  if (isNaN(numId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const umkm = await prisma.umkm.findUnique({ where: { id: numId } });
  if (!umkm) {
    return NextResponse.json({ error: "UMKM not found" }, { status: 404 });
  }

  const updated = await prisma.umkm.update({
    where: { id: numId },
    data: { statusTampil: !umkm.statusTampil },
  });

  return NextResponse.json(updated);
}
