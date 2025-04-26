import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { JsonValue } from "@prisma/client/runtime/library";

interface ShortenedUrl {
  id: string;
  shortCode: string;
  longUrl: string;
  clicks: number;
  createdAt: Date;
  referrals: JsonValue;
}

export const dynamic = "force-dynamic"; // Ensure route is not statically generated

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const period = searchParams.get("period");

  try {
    const where: Record<string, string | { lte: Date }> = {};
    if (userId) {
      where.userId = userId;
    }
    if (period === "previous") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      where.createdAt = {
        lte: thirtyDaysAgo,
      };
    }

    const urls: ShortenedUrl[] = await prisma.shortenedUrl.findMany({
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

    if (period !== "previous" && userId) {
      await prisma.metricsSnapshot.create({
        data: {
          userId,
          totalUrls: urls.length,
          totalClicks: urls.reduce((sum: number, url: ShortenedUrl) => sum + url.clicks, 0),
          averageClicks: urls.length ? urls.reduce((sum: number, url: ShortenedUrl) => sum + url.clicks, 0) / urls.length : 0,
        },
      });
    }

    return NextResponse.json(urls);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}