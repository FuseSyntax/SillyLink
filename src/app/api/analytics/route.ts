import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const period = searchParams.get("period");

  try {
    let where: any = {};
    if (userId) {
      where.userId = userId;
    }

    if (period === "previous") {
      // Fetch data from before today (e.g., yesterday)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      where.createdAt = {
        lte: yesterday,
      };
    }

    const urls = await prisma.shortenedUrl.findMany({
      where,
      select: {
        id: true,
        shortCode: true,
        longUrl: true,
        clicks: true,
        createdAt: true,
        referrals: true,
      },
    });

    return NextResponse.json(urls);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
