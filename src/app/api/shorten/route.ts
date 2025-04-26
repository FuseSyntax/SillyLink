// src/app/api/shorten/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    const { longUrl, userId } = await request.json();

    if (!longUrl) {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(longUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const shortCode = nanoid(6); // 6-character unique code

    const newUrl = await prisma.shortenedUrl.create({
      data: {
        longUrl,
        shortCode,
        userId: userId || null, // Store null if no userId
      },
    });

    return NextResponse.json({ shortCode: newUrl.shortCode }, { status: 200 });
  } catch (error) {
    console.error("Error shortening URL:", error);
    return NextResponse.json({ error: "Failed to shorten URL" }, { status: 500 });
  }
}
